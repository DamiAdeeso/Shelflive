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
import addMessage from "../../../../features/addMessage";
import { selectCategories } from "../../../../reducers/categorySlice";
import { setItems } from "../../../../reducers/inventorySlice";
import { setUser } from "../../../../reducers/userSlice";
import style from "../invent.module.scss";

import {AiFillCloseSquare} from 'react-icons/ai'

function EditItem({ itemToEdit, setItemToEdit, userID }) {
  // get categories with sub category
  const categories = useSelector(selectCategories);
  const [subCategories, setSubCategories] = React.useState([]);
  const dispatch = useDispatch();

  // close modal
  const close = () => {
    setItemToEdit(null);
  };

  const { handleSubmit, register, control, setValue } = useForm();
  const submitHandler = async (data) => {
    const args = Object.assign(
      {
        userID,
        itemID: itemToEdit._id,
      },
      data
    );
    const result = JSON.parse(await window.api.inventory.editItem(args));
    if (result.err)
      if (result.result === undefined) {
        addMessage(result, dispatch);
        return dispatch(setUser(null));
      } else {
        return addMessage(result, dispatch);
      }

    addMessage(result, dispatch);
    setItemToEdit(result.result);

    const items = JSON.parse(await window.api.inventory.getAll(userID));
    if (items.err) return;
    dispatch(setItems(items.result));
  };

  React.useEffect(() => {
    if (itemToEdit) {
      setSubCategories(() => {
        const categ = categories.filter(
          (val) => itemToEdit?.category?._id === val._id
        );
        return categ[0]?.sub_category;
      });
      setValue("name", itemToEdit?.name);
      setValue("category", itemToEdit?.category?._id);
      setValue("sub_category", itemToEdit?.sub_category?._id);
      setValue("quantity", itemToEdit?.quantity);
      setValue("cost", itemToEdit?.cost);
      setValue("current_worth", itemToEdit?.current_worth);
      setValue("condition", itemToEdit?.condition);
    }
  }, [itemToEdit, setValue, categories]);

  return (
    <Modal
      open={itemToEdit ? true : false}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={style.root}>
        <AiFillCloseSquare data-style="close" onClick={close} />

        <h3>edit {itemToEdit?.name}</h3>
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
                label={"sub category"}
                name={"sub_category"}
                control={control}
                optional={true}
              >
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
              onClick={close}
            >
              cancel
            </Button>
            {categories.length > 0 && (
              <Button type="submit" variant="contained">
                edit item
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

export default EditItem;
