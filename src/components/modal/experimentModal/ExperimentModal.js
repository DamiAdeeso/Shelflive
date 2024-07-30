import { Box, Button, MenuItem, Modal, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import SelectForm from "../../../features/SelectForm";
import style from "./experiment.module.scss";

// icons
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { selectItems } from "../../../reducers/inventorySlice";
import { resetUser, selectUser } from "../../../reducers/userSlice";
import addMessage from "../../../features/addMessage";
import { setExp } from "../../../reducers/experimentSlice";

import { AiFillCloseSquare } from 'react-icons/ai'

function ExperimentModal({ open, handleClose }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { reset, handleSubmit, register, control } = useForm();
  const inventory = useSelector(selectItems);

  const [searchItem, setSearchItem] = React.useState("");
  const [items, setItems] = React.useState([]);

  // display to handle the display list of items
  const [display, setDisplay] = React.useState(false);
  const displayHandler = () => {
    setDisplay((prev) => !prev);
  };

  // set selected items list
  const [selectedItems, setSelectedItems] = React.useState([]);
  const selectItemHandler = (val) => {
    setSelectedItems((prev) => [...prev, val]);
  };

  // delete from selected items array
  const deleteItemHandler = (id) => {
    setSelectedItems(selectedItems.filter((val) => val !== id));
  };

  const submitHandler = async (data) => {
    const obj = Object.assign(
      {
        items: selectedItems,
      },
      data
    );

    const result = JSON.parse(
      await window.api.exp.addExp({
        userID: user._id,
        data: obj,
      })
    );

    if (result.err) {
      if (result.err === undefined) {
        addMessage(result, dispatch);
        return dispatch(resetUser());
      } else return addMessage(result);
    }

    addMessage(result, dispatch);
    const exps = JSON.parse(await window.api.exp.getExp(user._id));
    if (exps.err) return addMessage(exps, dispatch);

    dispatch(setExp(exps.result));

    setSelectedItems([]);
    reset();
  };

  React.useEffect(() => {
    if (inventory)
      setItems(
        inventory.filter(
          (val) =>
            !selectedItems.includes(val._id) &&
            val.name.toUpperCase().includes(searchItem.toUpperCase())
        )
      );
  }, [selectedItems, inventory, searchItem]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={style.root}>
      <AiFillCloseSquare data-style="close" onClick={handleClose} />

        <h3>add experiment</h3>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div data-style="section">
            <TextField
              {...register("title", {
                required: true,
              })}
              label="Experiment Title"
              size="small"
              variant="outlined"
            />

            <TextField
              {...register("handler", {
                required: true,
              })}
              label="Experiment Handler"
              size="small"
              variant="outlined"
            />

            <SelectForm
              defaultValue={1}
              label={"student level"}
              name={"level"}
              control={control}
            >
              <MenuItem value={1}>Year One</MenuItem>
              <MenuItem value={2}>Year Two</MenuItem>
              <MenuItem value={3}>Year Three</MenuItem>
              <MenuItem value={4}>Year Four</MenuItem>
            </SelectForm>
          </div>

          <div data-style="section">
            <div data-style="drop-down">
              <TextField
                label="items"
                size="small"
                variant="outlined"
                onBlur={(e) => {}}
                onFocus={displayHandler}
                onChange={(e) => setSearchItem(e.target.value)}
                value={searchItem}
                sx={{
                  "&.MuiFormControl-root": {
                    width: "100%",
                  },
                }}
              />
              {display && <RxCross2 onClick={displayHandler} />}
              <ul
                display="hide"
                data-display={display || searchItem.length ? "show" : ""}
              >
                {items.map((val) => (
                  <li
                    key={val._id}
                    onClick={() => {
                      displayHandler();
                      setSearchItem("");
                      selectItemHandler(val._id);
                    }}
                    display="hide"
                  >
                    {val.name}
                  </li>
                ))}
              </ul>
            </div>

            <div data-style="selected-items">
              {selectedItems.map((val) => {
                const name = inventory.find((obj) => obj._id === val).name;
                return (
                  <span key={val}>
                    {name}
                    <RxCross2 onClick={() => deleteItemHandler(val)} />
                  </span>
                );
              })}
            </div>
          </div>

          <div data-class="buttons">
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
          </div>
        </form>
      </Box>
    </Modal>
  );
}

export default ExperimentModal;
