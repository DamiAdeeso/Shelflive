import { Box, Button, MenuItem, Modal, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import style from "./student.module.scss";

// icons
import { useDispatch, useSelector } from "react-redux";
import { resetUser, selectUser } from "../../../../reducers/userSlice";
import addMessage from "../../../../features/addMessage";
import { setExp } from "../../../../reducers/experimentSlice";
import SelectForm from "../../../../features/SelectForm";
import { AiFillCloseSquare } from "react-icons/ai";

function EditStudent({ open, handleClose }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { handleSubmit, register, control, setValue } = useForm();

  const submitHandler = async (data) => {
    const result = JSON.parse(
      await window.api.exp.editStudent({
        userID: user._id,
        data,
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

  React.useEffect(() => {
    if (open) {
      setValue("fname", open.fname);
      setValue("lname", open.lname);
      setValue("matno", open.matno);
      setValue("status", open.status);
    }
  }, [open, setValue]);

  return (
    <Modal
      open={open ? true : false}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={style.root}>
        <AiFillCloseSquare data-style="close" onClick={handleClose} />
        <h3>edit student info</h3>
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

          <SelectForm
            defaultValue={"returned"}
            label={"student status"}
            name={"status"}
            control={control}
          >
            <MenuItem value={"not returned"}>Not Returned</MenuItem>
            <MenuItem value={"returned"}>Returned</MenuItem>
          </SelectForm>

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

export default EditStudent;
