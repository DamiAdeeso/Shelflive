import { TextField } from "@mui/material";
import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

import { useDispatch, useSelector } from "react-redux";
import addMessage from "../../../features/addMessage";
import { setCategories } from "../../../reducers/categorySlice";
import { selectItems } from "../../../reducers/inventorySlice";
import { selectUser, setUser } from "../../../reducers/userSlice";
import DeleteItem from "../../modal/inventoryModal/delete/DeleteItem";
import EditItem from "../../modal/inventoryModal/edit/EditItem";
import InventoryModal from "../../modal/inventoryModal/InventoryModal";
import style from "./inventory.module.scss";
import Table from "./Table";

const Inventory = () => {
  // get user information
  const user = useSelector(selectUser);

  // get items inventory
  const inventory = useSelector(selectItems);

  // init a table for items
  const [items, setitemsArray] = React.useState([]);

  // add item state
  const [open, setOpen] = useState(false);

  // delete item state
  const [itemToDelete, setItemToDelete] = useState(null);

  // edit item state
  const [itemToEdit, setItemToEdit] = useState(false);

  // search field statement
  const [search, setSearch] = React.useState("");

  const dispatch = useDispatch();
  const handleClose = async (getCategories) => {
    setOpen((prev) => !prev);
    if (getCategories) {
      const result = JSON.parse(await window.api.category.get(user._id));

      // check for errors
      if (result.err) {
        if (result.result === undefined) dispatch(setUser(null));
        setOpen((prev) => !prev);
        return addMessage(result, dispatch);
      }
      dispatch(setCategories(result.result));
    }
  };

  React.useEffect(() => {
    if (inventory)
      setitemsArray(
        inventory.filter((val) => {
          const s = search.toUpperCase();
          return (
            val.name.toUpperCase().includes(s) ||
            val.sub_category?.name.toUpperCase().includes(s) ||
            val.category?.name.toUpperCase().includes(s)
          );
        })
      );
  }, [inventory, search]);

  return (
    <section>
      <div className={style.inventory}>
        <div>
          <h2 style={{ color: "#0d1e6d", fontSize: "30px" }}>Inventory</h2>
          <p>A list of all items in one place</p>
        </div>

        <div className={style.content}>
          <TextField
            label="search"
            size="small"
            sx={{
              marginRight: "20px",
            }}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div
            className={style.icon}
            style={{
              backgroundColor: "#0d1e6d",
              color: "white",
              cursor: "pointer",
            }}
            onClick={handleClose}
          >
            <span className={style.filter}>
              <AiOutlinePlus size={30} />
            </span>
            <h4>Add To Inventory</h4>
          </div>
          {open ? (
            <InventoryModal handleClose={handleClose} open={open} />
          ) : (
            <></>
          )}
        </div>
      </div>

      <DeleteItem
        item={itemToDelete}
        setItem={setItemToDelete}
        userID={user?._id}
      />
      <EditItem
        setItemToEdit={setItemToEdit}
        itemToEdit={itemToEdit}
        userID={user?._id}
      />

      <Table
        dispatch={dispatch}
        items={items}
        setCategories={setCategories}
        setItemToDelete={setItemToDelete}
        setItemToEdit={setItemToEdit}
        setUser={setUser}
        user={user}
      />
    </section>
  );
};

export default Inventory;
