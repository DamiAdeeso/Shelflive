import { Button, MenuItem, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import addMessage from "../../../features/addMessage";
import SelectForm from "../../../features/SelectForm";
import {
  selectCategories,
  setCategories,
} from "../../../reducers/categorySlice";
import { selectUser, setUser } from "../../../reducers/userSlice";
import style from "./category.module.scss";

import { AiFillCloseSquare } from 'react-icons/ai'

function CategoryModal({ open, handleClose }) {
  // get categories
  const categories = useSelector(selectCategories);

  // get user info
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const { register, control, handleSubmit, reset } = useForm();
  const submitHandler = async (data) => {
    // add the user id to the data object
    const args = Object.assign(
      {
        userID: user._id,
      },
      data
    );

    // get the result from the backend
    const result = JSON.parse(await window.api.category.add(args));

    // check if there is an error
    if (result.err) {
      if (result.result === undefined) return dispatch(setUser(null));
      return addMessage(result, dispatch);
    }

    // return a message if everything did well
    reset();
    dispatch(setCategories(result.result));
    return addMessage(result, dispatch);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={style.root}>
      <AiFillCloseSquare data-style="close" onClick={handleClose} />
        <form onSubmit={handleSubmit(submitHandler)}>
          {/* show this section only for admin user */}
          {user && user.role === "admin" && (
            <>
              <h3>category</h3>
              <TextField
                {...register("category_name", {
                  required: user && user.role === "admin" && !categories.length ? true : false,
                })}
                label="name"
                size="small"
                variant="outlined"
              />
            </>
          )}

          {/* check if there is at least one category to avoid errors */}
          {categories && categories.length ? (
            <>
              <h3>add sub category</h3>
              <TextField
                {...register("sub_name", {
                  required: user && user.role !== "admin" && true,
                })}
                label="name"
                size="small"
                variant="outlined"
              />

              <SelectForm
                defaultValue={categories.length ? categories[0]._id : ""}
                label={"category"}
                name={"category"}
                control={control}
                optional={true}
              >
                {categories.map((val) => (
                  <MenuItem key={val._id} value={val._id}>
                    {val.name}
                  </MenuItem>
                ))}
              </SelectForm>
            </>
          ) : (
            <></>
          )}

          {/* show message if there is no categories and user is not admin */}
          {!categories.length && user && user.role !== "admin" ? (
            <p data-style="no-category">
              there must be at least one category !
            </p>
          ) : (
            <></>
          )}

          <div data-class="buttons">
            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={handleClose}
            >
              cancel
            </Button>

            {/* show confirme button only if there is an admin user or one category found */}
            {categories.length || user.role === "admin" ? (
              <Button type="submit" variant="contained">
                confirme
              </Button>
            ) : (
              <></>
            )}
          </div>
        </form>
      </Box>
    </Modal>
  );
}

export default CategoryModal;
