import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import addMessage from "../../../features/addMessage";
import { resetUser, setUsers } from "../../../reducers/userSlice";
import style from "./admin.module.scss";

function VerifyModal({ open, handleClose, user }) {
  const dispatch = useDispatch();

  const verifyUser = async () => {
    const res = JSON.parse(
      await window.api.users.editUser({ admin: user._id, user: open._id })
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
    handleClose(1)
  };
  return (
    <Modal
      open={open ? true : false}
      onClose={() => handleClose(1)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={style.root}>
        <h3>
          {open?.lname} {open?.fname}
        </h3>
        <p>you want to update this user account from unverified to verifed ?</p>
        <Button variant="contained" color="info" onClick={verifyUser}>
          yes
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleClose(1)}
        >
          no, cancel
        </Button>
      </Box>
    </Modal>
  );
}

export default VerifyModal;
