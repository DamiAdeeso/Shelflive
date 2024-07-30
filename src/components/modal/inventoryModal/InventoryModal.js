import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import addMessage from "../../../features/addMessage";
import { selectCategories } from "../../../reducers/categorySlice";
import { setItems } from "../../../reducers/inventorySlice";
import { selectUser } from "../../../reducers/userSlice";
import style from "./invent.module.scss";

import {AiFillCloseSquare} from 'react-icons/ai'

function InventoryModal({ open, handleClose }) {
  // get categories with sub category
  const categories = useSelector(selectCategories);
  const [subCategories, setSubCategories] = React.useState([]);
  const dispatch = useDispatch();

  // get user information
  const user = useSelector(selectUser);

  const { reset, handleSubmit, register, control, setValue } = useForm();
  const submitHandler = async (data) => {
    // asign the user id to the data object
    const args = Object.assign(
      {
        userID: user._id,
      },
      data
    );

    // get the result from the server
    const result = JSON.parse(await window.api.inventory.add(args));
    if (result.err) return addMessage(result, dispatch);

    // display result message
    addMessage(result, dispatch);

    // get all items
    const items = JSON.parse(await window.api.inventory.getAll(user._id));
    dispatch(setItems(items.result));
    handleClose();
  };

  React.useEffect(() => {
    if (categories.length && categories[0].sub_category)
      setSubCategories(categories[0].sub_category);
  }, [categories]);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={style.root}>
        <AiFillCloseSquare data-style="close" onClick={handleClose} />
        <h3>add item</h3>
        <form onSubmit={handleSubmit(submitHandler)}>
          {categories.length ? (
            <>
              <TextField
                {...register("name", {
                  required: true,
                })}
                label="item name"
                size="small"
                variant="outlined"
              />

              <SelectForm
                defaultValue={categories.length ? categories[0]._id : ""}
                label={"category"}
                name={"category"}
                control={control}
                categories={categories}
                setSubCategories={setSubCategories}
                setValue={setValue}
                targetName={"sub_category"}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </SelectForm>

              <SelectForm
                defaultValue={
                  subCategories.length > 0 ? subCategories[0]._id : ""
                }
                label={"sub category"}
                name={"sub_category"}
                control={control}
                optional={true}
              >
                <MenuItem key={"1"} value={""}></MenuItem>

                {subCategories.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </SelectForm>

              <TextField
                {...register("cost", {
                  required: true,
                })}
                label="cost for puchase"
                size="small"
                variant="outlined"
                type="number"
              />
              <TextField
                {...register("quantity", { required: true })}
                label="quantity"
                size="small"
                type="number"
                variant="outlined"
              />
              <TextField
                {...register("current_worth", { required: true })}
                label="current worth"
                size="small"
                type="number"
                variant="outlined"
              />

              <SelectForm
                defaultValue={"Available"}
                label={"condition"}
                name={"condition"}
                control={control}
              >
                <MenuItem value={"Available"}>Available</MenuItem>
                <MenuItem value={"Damaged"}>Damaged</MenuItem>
                <MenuItem value={"Not Available"}>Not available</MenuItem>
              </SelectForm>
            </>
          ) : (
            <p data-style="no-category">
              there must be at least one category to add an item !
            </p>
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
            {categories.length > 0 && (
              <Button type="submit" variant="contained">
                confirme
              </Button>
            )}
          </div>
        </form>
      </Box>
    </Modal>
  );
}

const SelectForm = ({
  name,
  label,
  control,
  defaultValue,
  children,
  rules,
  optional,
  setValue,
  targetName,
  categories,
  setSubCategories,
}) => {
  const labelId = `${name}-label`;
  return (
    <FormControl size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        render={({ field }) => {
          return (
            <Select
              labelId={labelId}
              label={label}
              value={field.value}
              onChange={(e) => {
                const data = e.target.value;
                field.onChange(data);
                if (setValue) {
                  const selectedCategory = categories.filter(
                    (val) => val._id === data
                  );

                  setValue(
                    targetName,
                    selectedCategory[0].sub_category.length
                      ? selectedCategory[0].sub_category[0]._id
                      : ""
                  );
                  setSubCategories(selectedCategory[0].sub_category);
                }
              }}
            >
              {children}
            </Select>
          );
        }}
        name={name}
        defaultValue={defaultValue}
        control={control}
        rules={{
          required: optional ? false : true,
          ...rules,
        }}
      />
    </FormControl>
  );
};

export default InventoryModal;
