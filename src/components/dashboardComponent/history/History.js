import { Button } from "@mui/material";
import React from "react";
import { AiTwotoneFilter } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import addMessage from "../../../features/addMessage";
// import { historyToday, historyYesterday } from "../../../assets/data/SubCat";
import { dateFormat, dateFormatHistory } from "../../../features/dateFormat";
import { intoText } from "../../../features/historyText";
import { setCategories } from "../../../reducers/categorySlice";
import { selectHistory, setHistory } from "../../../reducers/historySlice";
import { selectUser } from "../../../reducers/userSlice";
import ModalFilter from "../../modal/ModalFilter";
import style from "./history.module.scss";

const History = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const history = useSelector(selectHistory);
  const [array, setArray] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = async () => {
    // get categories first
    const categories = JSON.parse(await window.api.category.get(user._id));
    if (!categories.err) dispatch(setCategories(categories.result));
    setIsOpen(true);
  };

  // reset history
  const reset = async () => {
    const history_ = JSON.parse(
      await window.api.history.getAll({
        userID: user._id,
        match: null,
      })
    );
    if (history_.err) return addMessage(history_, dispatch);
    dispatch(setHistory(history_.result));
  };

  React.useEffect(() => {
    if (history) setArray(history);
  }, [history]);

  return (
    <section>
      <div className={style.experiment}>
        <div>
          <h2 style={{ color: "#0d1e6d", fontSize: "30px" }}>History</h2>
          <p>Previously done activities</p>
        </div>
        <div className={style.content}>
          <Button
            sx={{ marginRight: "20px" }}
            variant="outlined"
            color="secondary"
            onClick={reset}
          >
            reset
          </Button>
          <div
            className={style.content__Action}
            style={{ marginRight: "20px", marginTop: "3px", color: "#0d1e6d" }}
            onClick={openModal}
          >
            <span className={style.filter} style={{ marginRight: "4px" }}>
              <AiTwotoneFilter size={20} />
            </span>
            <h2>Filter</h2>
          </div>
        </div>
        {isOpen ? (
          <ModalFilter userID={user._id} setIsOpen={setIsOpen} />
        ) : null}
      </div>
      {array.map((val, i) => (
        <table key={i}>
          <thead>
            <tr>
              <th>{val[0].day}</th>
              <th>{dateFormatHistory(val[0].date)}</th>
            </tr>
          </thead>
          <tbody>
            {val.map((item) => {
              return (
                <tr key={item._id}>
                  <td style={{ whiteSpace: "nowrap", maxWidth: "100" }}>
                    {dateFormat(item.date, true)}{" "}
                  </td>
                  <td style={{ height: "25px", textAlign: "left" }}>
                    {intoText(item)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ))}
    </section>
  );
};

export default History;
