import { Button } from "@mui/material";
import React, { useState } from "react";
import { AiTwotoneFilter } from "react-icons/ai";
import { BsArrowLeftRight, BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { GiCoins, GiTwoCoins } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { dateFormat } from "../../../features/dateFormat";
import { setCategories } from "../../../reducers/categorySlice";
import { selectInfo, selectItems } from "../../../reducers/inventorySlice";
import { selectUser, setUser } from "../../../reducers/userSlice";
import Card from "../../card/Card";
import DeleteItem from "../../modal/inventoryModal/delete/DeleteItem";
import EditItem from "../../modal/inventoryModal/edit/EditItem";
import Modal from "../../modal/Modal";
import style from "./accounting.module.scss";

const Accounting = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [itemToEdit, setItemToEdit] = React.useState(null);

  const inventory = useSelector(selectItems);

  // state for filter
  const [item, setItem] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [startDate, setStartDate] = React.useState(0);
  const [endDate, setEndDate] = React.useState(new Date().getTime());
  const [condition, setCondition] = React.useState("");
  const [info, setInfo] = React.useState({
    net_spend: 0,
    current_worth: 0,
    net_loss: 0,
  });

  const [items, setItems] = React.useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const toggleBar = async () => {
    // get categories first
    const categories = JSON.parse(await window.api.category.get(user._id));
    if (!categories.err) dispatch(setCategories(categories.result));
    setIsOpen(true);
  };

  // reset button function
  const reset = () => {
    setItem("");
    setCategory("");
    setStartDate(0);
    setEndDate(new Date().setHours(23, 59, 59, 99));
    setCondition("");
  };

  React.useEffect(() => {
    if (inventory) {
      setInfo({
        current_worth: 0,
        net_loss: 0,
        net_spend: 0,
      });
      setItems(
        inventory.filter((val) => {
          const isTrue =
            val.name.toUpperCase().includes(item.toUpperCase()) &&
            val.category.name.toUpperCase().includes(category.toUpperCase()) &&
            val.condition.toUpperCase().includes(condition.toUpperCase()) &&
            val.created >= startDate &&
            val.created <= endDate;

          if (isTrue) {
            const quantity = val.quantity;
            const cost = val.cost;
            const condition = val.condition;

            const net_spend = quantity * cost;
            const current_worth = quantity * val.current_worth;
            let netL = 0;
            if (condition === "Damaged") netL += quantity * cost;

            setInfo((prev) => ({
              current_worth: prev.current_worth + current_worth,
              net_loss: prev.net_loss + netL,
              net_spend: prev.net_spend + net_spend,
            }));
          }

          return isTrue;
        })
      );
    }
  }, [inventory, item, category, startDate, endDate, condition]);
  return (
    <section>
      <div className={style.experiment}>
        <div>
          <h2 style={{ color: "#0d1e6d", fontSize: "30px" }}>Accounting</h2>
          <p>A brief summary accounting for financial spending</p>
        </div>
        <div className={style.content}>
          <Button
            sx={{ marginRight: "20px" }}
            variant="outlined"
            color="secondary"
            onClick={reset}
          >
            reset
          </Button>
          <div
            className={style.content__Action}
            style={{ marginRight: "20px", color: "#0d1e6d" }}
            onClick={toggleBar}
          >
            <span className={style.filter} style={{ marginRight: "4px" }}>
              <AiTwotoneFilter size={20} style={{ marginBottom: "12px" }} />
            </span>
            <h2>Filter</h2>
          </div>
        </div>
        {isOpen ? (
          <Modal
            setItem={setItem}
            setCategory={setCategory}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setCondition={setCondition}
            setIsOpen={setIsOpen}
          />
        ) : null}
      </div>

      <div style={{ backgroundColor: "#Ebedee" }}>
        <div className={style.account}>
          <Card cardClass={style.card}>
            <div>
              <span
                className={style.filter}
                style={{ marginRight: "10px", backgroundColor: "#Eaa7a7" }}
              >
                <BsArrowLeftRight color="#7d0c0d" size={16} />
              </span>
              <p style={{ fontSize: "20px" }}>Net Spend</p>
            </div>
            <h2>{toCurrency(info.net_spend)}</h2>
          </Card>

          <Card cardClass={style.card}>
            <div>
              <span
                className={style.filter}
                style={{ marginRight: "10px", backgroundColor: "#E6b2db" }}
              >
                <GiTwoCoins color="#941b7a" size={16} />
              </span>
              <p style={{ fontSize: "20px" }}>Current Worth</p>
            </div>
            <h2>{toCurrency(info.current_worth)}</h2>
          </Card>

          <Card cardClass={style.card}>
            <div>
              <span
                className={style.filter}
                style={{ marginRight: "10px", backgroundColor: "#Eaaea1" }}
              >
                <GiCoins color="#922a13" size={16} />
              </span>
              <p style={{ fontSize: "20px" }}>Net Loss</p>
            </div>
            <h2>{toCurrency(info.net_loss)}</h2>
          </Card>
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

        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" disabled />
              </th>
              <th>Name</th>
              <th>Type</th>
              <th>Last Modification</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <Tr
                key={item._id}
                dispatch={dispatch}
                item={item}
                user={user}
                setUser={setUser}
                setCategories={setCategories}
                setItemToDelete={setItemToDelete}
                setItemToEdit={setItemToEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const Tr = ({
  item,
  user,
  setItemToDelete,
  setItemToEdit,
  dispatch,
  setUser,
  setCategories,
}) => {
  const f = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  });

  const deleteItem = () => {
    setItemToDelete(item);
  };

  const editItem = async () => {
    const categories = JSON.parse(await window.api.category.get(user._id));
    if (categories.err)
      if (categories.result === undefined) return dispatch(setUser(null));

    dispatch(setCategories(categories.result));
    setItemToEdit(item);
  };

  return (
    <tr>
      <td>
        <input type="checkbox" />
      </td>
      <td>{item.name}</td>
      <td>{item.sub_category?.name}</td>
      <td>
        {item.last_modification ? dateFormat(item.last_modification) : "/"}
      </td>
      <td>{item.quantity}</td>
      <td>{f.format(item.quantity * item.current_worth)}</td>
      <td className={style.icons}>
        <FiEdit color="#151596" onClick={editItem} />
        {user?.role === "admin" && (
          <BsTrash color="#Bf1111" onClick={deleteItem} />
        )}
      </td>
    </tr>
  );
};

export default Accounting;

const toCurrency = (num) => {
  const f = new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
  });
  return f.format(num ? num : 0);
};
