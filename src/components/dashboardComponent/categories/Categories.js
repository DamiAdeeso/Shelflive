import { TextField } from "@mui/material";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import addMessage from "../../../features/addMessage";
import {
  selectCategories,
  setCategories,
} from "../../../reducers/categorySlice";
import { selectItems } from "../../../reducers/inventorySlice";
import { selectUser, setUser } from "../../../reducers/userSlice";
import CategoryModal from "../../modal/category&sub-category/CategoryModal";
import DeleteItem from "../../modal/inventoryModal/delete/DeleteItem";
import EditItem from "../../modal/inventoryModal/edit/EditItem";
import style from "./categories.module.scss";
import TableCategory from "./TableCategory";

const Category = () => {
  const user = useSelector(selectUser);
  const inventory = useSelector(selectItems);
  const dispatch = useDispatch();

  // get categories
  const categories = useSelector(selectCategories);

  // search statement
  const [search, setSearch] = React.useState("");

  // add item state
  const [open, setOpen] = React.useState(false);

  // delete item state
  const [itemToDelete, setItemToDelete] = React.useState(null);

  // categories array state
  const [category, setCategory] = React.useState("All");

  // sub category array state
  const [sub_category, setSub_category] = React.useState("All");
  const [subCategories, setSubCategories] = React.useState([]);

  // items array state
  const [items, setItemsArray] = React.useState([]);

  // edit item state
  const [itemToEdit, setItemToEdit] = React.useState(false);

  const setCategoryName = (name) => {
    setCategory(name);
    setSubCategories(categories.filter((val) => val.name === name));
  };

  const handleCloseModal = async (getCategories) => {
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
      setItemsArray(
        inventory.filter((val) => {
          const s = search.toUpperCase();
          if (category === "All")
            return (
              val.name.toUpperCase().includes(s) ||
              val.sub_category?.name.toUpperCase().includes(s) ||
              val.category?.name.toUpperCase().includes(s)
            );
          else if (val && val.category && val.category.name) {
            if (sub_category !== "All")
              return (
                category
                  .toUpperCase()
                  .includes(val.category.name.toUpperCase()) &&
                sub_category
                  .toUpperCase()
                  .includes(val.sub_category.name.toUpperCase()) &&
                (val.name.toUpperCase().includes(s) ||
                  val.sub_category?.name.toUpperCase().includes(s) ||
                  val.category?.name.toUpperCase().includes(s))
              );
            return (
              category
                .toUpperCase()
                .includes(val.category.name.toUpperCase()) &&
              (val.name.toUpperCase().includes(s) ||
                val.sub_category?.name.toUpperCase().includes(s) ||
                val.category?.name.toUpperCase().includes(s))
            );
          } else return false;
        })
      );
  }, [inventory, category, sub_category, search]);

  return (
    <section>
      <div className={style.inventory}>
        <div>
          <h2 style={{ color: "#0d1e6d", fontSize: "30px" }}>Category</h2>
          <p>All your items categoried for easy access</p>
        </div>
        <div className={style.content}>
          <TextField
            size="small"
            sx={{ marginRight: "20px" }}
            label="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            className={style.icon}
            data-target-add_button="true"
            style={{
              backgroundColor: "#0d1e6d",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => handleCloseModal(true)}
          >
            <span className={style.filter}>
              <AiOutlinePlus size={30} />
            </span>
            <h4>Add Sub-Category</h4>
          </div>
          <CategoryModal handleClose={handleCloseModal} open={open} />
        </div>
      </div>

      <div className={style.cat}>
        <p
          onClick={() => setCategoryName("All")}
          className={category === "All" ? style.active : ""}
        >
          all
        </p>
        {categories?.map((val) => {
          return (
            <p
              key={val._id}
              onClick={() => setCategoryName(val.name)}
              className={category === val.name ? style.active : ""}
            >
              {val.name}
            </p>
          );
        })}
      </div>

      {category !== "All" && (
        <div className={style.cat}>
          <p
            onClick={() => setSub_category("All")}
            className={sub_category === "All" ? style.active : ""}
          >
            all
          </p>
          {subCategories[0]?.sub_category.map((val) => {
            return (
              <p
                key={val._id}
                onClick={() => setSub_category(val.name)}
                className={sub_category === val.name ? style.active : ""}
              >
                {val.name}
              </p>
            );
          })}
        </div>
      )}

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

      <TableCategory
        items={items}
        setItemToDelete={setItemToDelete}
        setItemToEdit={setItemToEdit}
        user={user}
      />
    </section>
  );
};

export default Category;
