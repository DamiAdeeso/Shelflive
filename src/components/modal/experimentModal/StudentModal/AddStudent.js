import { Box, Button, Modal, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import style from "./student.module.scss";

// icons
import { useDispatch, useSelector } from "react-redux";
import { resetUser, selectUser } from "../../../../reducers/userSlice";
import addMessage from "../../../../features/addMessage";
import { setExp } from "../../../../reducers/experimentSlice";

import {AiFillCloseSquare} from 'react-icons/ai'

function AddStudent({ open, handleClose }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { reset, handleSubmit, register } = useForm();

  const submitHandler = async (data) => {
    const obj = Object.assign(
      {
        expID: open._id,
      },
      data
    );

    const result = JSON.parse(
      await window.api.exp.addStudent({
        userID: user._id,
        data: obj,
      })
    );
    addMessage(result, dispatch);

    if (result.err && result.err === undefined) return dispatch(resetUser());

    const exps = JSON.parse(await window.api.exp.getExp(user._id));
    if (exps.err) return addMessage(exps, dispatch);

    dispatch(setExp(exps.result));
    reset();
  };

  return (
    <Modal
      open={open ? true : false}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={style.root}>
      <AiFillCloseSquare data-style="close" onClick={handleClose} />
        <h3>add student</h3>
        <form onSubmit={handleSubmit(submitHandler)}>
          <TextField
            {...register("fname", {
              required: true,
            })}
            label="first name"
            size="small"
            variant="outlined"
          />

          <TextField
            {...register("lname", {
              required: true,
            })}
            label="last name"
            size="small"
            variant="outlined"
          />

          <TextField
            {...register("matno", {
              required: true,
            })}
            label="matricule N°"
            size="small"
            variant="outlined"
          />
          <i />
          <Button
            type="button"
            variant="contained"
            color="error"
            onClick={handleClose}
          >
            cancel
          </Button>
          <Button type="submit" variant="contained">
            confirme
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default AddStudent;
