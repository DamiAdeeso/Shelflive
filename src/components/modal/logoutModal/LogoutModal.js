import { Box, Button, Modal } from "@mui/material";
import React from "react";
import style from "./logout.module.scss";

// icons
import { useDispatch } from "react-redux";
import { resetUser } from "../../../reducers/userSlice";

function Logout({ open, handleClose }) {
  const dispatch = useDispatch();

  const confirmeLogoutHandler = async () => {
    dispatch(resetUser());
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={style.root}>
        <p>are you sure ?</p>
        <Button
          variant="contained"
          color="error"
          onClick={confirmeLogoutHandler}
        >
          yes, i'm sure
        </Button>
        <Button variant="contained" color="info" onClick={handleClose}>
          no, cancel
        </Button>
      </Box>
    </Modal>
  );
}

export default Logout;
