import { Box, Button, Modal } from "@mui/material";
import React from "react";
import style from "./student.module.scss";

// icons
import { useDispatch, useSelector } from "react-redux";
import { resetUser, selectUser } from "../../../../reducers/userSlice";
import addMessage from "../../../../features/addMessage";
import { setExp } from "../../../../reducers/experimentSlice";

function DeleteStudent({ open, handleClose }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const confirmeDelteHandler = async () => {
    const result = JSON.parse(
      await window.api.exp.deleteStudent({
        userID: user._id,
        studentID: open._id,
      })
    );
    addMessage(result, dispatch);

    if (result.err && result.err === undefined) return dispatch(resetUser());

    const exps = JSON.parse(await window.api.exp.getExp(user._id));
    if (exps.err) return addMessage(exps, dispatch);

    dispatch(setExp(exps.result));
    handleClose();
  };

  return (
    <Modal
      open={open ? true : false}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={style.root}>
        <h3>
          delete {open?.fname} {open?.lname}
        </h3>
        <p>are you sure that you want delete this student ?</p>
        <div data-style="delete-buttons">
          <Button
            variant="contained"
            color="error"
            onClick={confirmeDelteHandler}
          >
            yes, i'm sure
          </Button>
          <Button variant="contained" color="info" onClick={handleClose}>
            no, cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default DeleteStudent;
