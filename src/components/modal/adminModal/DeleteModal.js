import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import addMessage from "../../../features/addMessage";
import { resetUser, setUsers } from "../../../reducers/userSlice";
import style from "./admin.module.scss";

function DeleteModal({ open, handleClose, user }) {
  const dispatch = useDispatch();

  const deleteUser = async () => {
    const res = JSON.parse(
      await window.api.users.deleteUser({ admin: user._id, user: open._id })
    );
    if (res.err) {
      if (res.result === undefined) {
        addMessage(res, dispatch);
        return dispatch(resetUser());
      } else return addMessage(res, dispatch);
    }

    addMessage(res, dispatch);
    const users = JSON.parse(await window.api.users.getUsers(user._id));
    if (users.err) return addMessage(users, dispatch);
    dispatch(setUsers(users.result));
    handleClose(2)
  };

  return (
    <Modal
      open={open ? true : false}
      onClose={() => handleClose(2)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={style.root}>
        <h3>
          {open?.lname} {open?.fname}
        </h3>
        <p>you realy want to delete this user ?</p>
        <Button variant="contained" color="warning" onClick={deleteUser}>
          yes
        </Button>
        <Button variant="contained" color="info" onClick={() => handleClose(2)}>
          no, cancel
        </Button>
      </Box>
    </Modal>
  );
}

export default DeleteModal;
