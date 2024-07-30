import { Button, ButtonGroup, TextField } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectUser, selectUsers } from "../../../reducers/userSlice";
import style from "./user.module.scss";

// icons
import { HiCheckCircle } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";
import VerifyModal from "../../modal/adminModal/VerifyModal";
import DeleteModal from "../../modal/adminModal/DeleteModal";

const User = () => {
  const users = useSelector(selectUsers);
  const user = useSelector(selectUser);
  const [list, setList] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [button, setButton] = React.useState(null);
  const [verifyUser, setVerifyUser] = React.useState(null);
  const [deleteUser, setDeleteUser] = React.useState(null);

  const handleClose = (opp) => {
    if (opp === 1) return setVerifyUser(null);
    setDeleteUser(null);
  };

  const changeButton = (data) => {
    setButton(data);
  };

  React.useEffect(() => {
    if (users)
      setList(
        users.filter((val) => {
          const fullName = `${val.fname} ${val.lname}`;
          if (button === null)
            return fullName.toUpperCase().includes(search.toUpperCase());
          return (
            fullName.toUpperCase().includes(search.toUpperCase()) &&
            val.verified === button
          );
        })
      );
  }, [users, search, button]);
  return (
    <section className={style.index}>
      <h1>users</h1>
      <div className={style.search_section}>
        <TextField
          label="search user"
          type="text"
          size="small"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />

        <ButtonGroup
          variant="contained"
          color="inherit"
          aria-label="outlined primary button group"
        >
          <Button
            color={button === null ? "info" : "inherit"}
            onClick={() => changeButton(null)}
          >
            <span>all</span>
          </Button>
          <Button
            color={button ? "info" : "inherit"}
            onClick={() => changeButton(true)}
          >
            <span>verified</span>
          </Button>
          <Button
            color={button === false ? "info" : "inherit"}
            onClick={() => changeButton(false)}
          >
            <span>not verified</span>
          </Button>
        </ButtonGroup>
      </div>

      {/* verify modal */}
      <VerifyModal user={user} open={verifyUser} handleClose={handleClose} />

      {/* delete modal */}
      <DeleteModal user={user} open={deleteUser} handleClose={handleClose} />

      <table>
        <thead>
          <tr>
            <th>first name</th>
            <th>last name</th>
            <th>email</th>
            <th>Status</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {list?.map((item) => (
            <Tr
              key={item._id}
              item={item}
              setDeleteUser={setDeleteUser}
              setVerifyUser={setVerifyUser}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default User;

const Tr = ({ item, setVerifyUser, setDeleteUser }) => {
  return (
    <tr>
      <td>{item.fname}</td>
      <td>{item.lname}</td>
      <td>{item.email}</td>
      <td>
        <span data-verify={item.verified}>
          {item.verified ? "verified" : "unverified"}
        </span>
      </td>
      <td>
        {!item.verified && (
          <HiCheckCircle
            size={18}
            color="#07bc0c"
            onClick={() => setVerifyUser(item)}
          />
        )}
        <BsTrash
          size={16}
          color="#Bf1111"
          onClick={() => setDeleteUser(item)}
        />
      </td>
    </tr>
  );
};
