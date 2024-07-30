import React from "react";
import { BsDot, BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { dateFormat } from "../../../features/dateFormat";
import style from "./inventory.module.scss";

function Table({
  items,
  user,
  setItemToDelete,
  setItemToEdit,
  dispatch,
  setUser,
  setCategories,
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>
            <input type="checkbox" disabled />
          </th>
          <th>Name</th>
          <th>Category</th>
          <th>Last Modification</th>
          <th>Quantity</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items?.map((item) => (
          <Tr
            key={item._id}
            user={user}
            item={item}
            setItemToDelete={setItemToDelete}
            setItemToEdit={setItemToEdit}
            dispatch={dispatch}
            setCategories={setCategories}
            setUser={setUser}
          />
        ))}
      </tbody>
    </table>
  );
}

export const Tr = ({
  item,
  user,
  setItemToDelete,
  setItemToEdit,
  dispatch,
  setUser,
  setCategories,
}) => {
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

  const backgroundColor =
    item.condition === "Available"
      ? "#B5e4b5"
      : item.condition === "Damaged"
      ? "#E69696"
      : "#E2dada";

  const color =
    item.condition === "Available"
      ? "#066B06"
      : item.condition === "Damaged"
      ? "#870B0B"
      : "#524f4f";
  return (
    <tr>
      <td>
        <input type="checkbox" />
      </td>
      <td>{item.name}</td>
      <td>{item.category?.name} Component</td>
      <td>
        {item.last_modification ? dateFormat(item.last_modification) : "/"}
      </td>
      <td>{item.quantity}</td>
      <td>
        <div
          className={style.status}
          style={{
            backgroundColor,
            color,
          }}
        >
          <BsDot style={{ marginTop: "2px" }} />
          {item.condition}
        </div>
      </td>
      <td className={style.icons}>
        <FiEdit color="#151596" onClick={editItem} />
        {user?.role === "admin" && (
          <BsTrash color="#Bf1111" onClick={deleteItem} />
        )}
      </td>
    </tr>
  );
};

export default Table;
