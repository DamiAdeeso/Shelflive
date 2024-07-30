import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import addMessage from "../../../../features/addMessage";
import { setArchives, setItems } from "../../../../reducers/inventorySlice";
import { setUser } from "../../../../reducers/userSlice";
import style from "../invent.module.scss";

function DeleteItem({ item, setItem, userID }) {
  const dispatch = useDispatch();
  const cancel = () => {
    setItem(null);
  };
  const confirme = async () => {
    // delete the selected item
    const result = JSON.parse(
      await window.api.inventory.delete({ _id: item._id, userID })
    );
    if (result.err) {
      if (result.result === undefined) return dispatch(setUser(null));
      return addMessage(result, dispatch);
    }

    // show message if item was deleted successfully
    addMessage(result, dispatch);

    // get items to refresh the old items
    const items = JSON.parse(await window.api.inventory.getAll(userID));
    if (items.err) return addMessage(items, dispatch);
    dispatch(setItems(items.result));

    // get archives to refresh the archive page
    const archives = JSON.parse(await window.api.inventory.getArchives(userID));
    if (archives.err) return addMessage(archives, dispatch);
    dispatch(setArchives(archives.result));

    // reset the selected item to delete and close the modal
    cancel();
  };
  return (
    <Modal
      open={item ? true : false}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={style.delete}>
        <h3>{item?.name}</h3>
        <p>do you really want to delete this item ?</p>
        <div>
          <Button variant="contained" onClick={cancel}>
            no, cancel
          </Button>
          <Button variant="contained" color="error" onClick={confirme}>
            yes delete it
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default DeleteItem;
