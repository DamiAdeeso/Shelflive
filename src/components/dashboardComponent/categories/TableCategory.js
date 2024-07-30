import React from "react";
import { BsDot, BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { dateFormat } from "../../../features/dateFormat";

import style from "./categories.module.scss";

function TableCategory({ items, user, setItemToDelete, setItemToEdit }) {
  return (
    <table>
      <thead>
        <tr>
          <th>
            <input type="checkbox" disabled />
          </th>
          <th>Name</th>
          <th>Sub-Category</th>
          <th>Last Modification</th>
          <th>Quantity</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items?.map((item) => (
          <Tr
            item={item}
            user={user}
            key={item._id}
            setItemToDelete={setItemToDelete}
            setItemToEdit={setItemToEdit}
          />
        ))}
      </tbody>
    </table>
  );
}

export const Tr = ({ item, user, setItemToDelete, setItemToEdit }) => {
  const deleteItem = () => {
    setItemToDelete(item);
  };

  const editItem = () => {
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
      <td>{item.sub_category?.name}</td>
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

export default TableCategory;
