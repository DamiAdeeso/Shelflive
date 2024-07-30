import { TextField } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { dateFormat } from "../../../features/dateFormat";
import { selectArchives } from "../../../reducers/inventorySlice";
import style from "./archives.module.scss";

const Accounting = () => {
  const archives = useSelector(selectArchives);
  const [list, setList] = React.useState([]);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (archives)
      setList(
        archives.filter((val) =>
          val.name.toUpperCase().includes(search.toUpperCase())
        )
      );
  }, [archives, search]);
  return (
    <section className={style.index}>
      <h1>archives</h1>
      <TextField
        label="search item"
        type="text"
        size="small"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>date of delete</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {list?.map((item) => (
            <Tr key={item._id} item={item} />
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Accounting;

const Tr = ({ item }) => {
  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.category?.name}</td>
      <td>{dateFormat(item.deletedDate)}</td>
      <td>{item.quantity}</td>
      <td>
        <span>deleted</span>
      </td>
    </tr>
  );
};
