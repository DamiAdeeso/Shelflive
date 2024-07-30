import React, { useRef, useState } from "react";
import ReactDom from "react-dom";
import style from "./modal.module.scss";
import { RiCloseLine } from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdDateRange } from "react-icons/md";
import { useSelector } from "react-redux";
import { selectCategories } from "../../reducers/categorySlice";

const Modal = ({
  setIsOpen,
  setItem,
  setCategory,
  setCondition,
  setStartDate,
  setEndDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);

  // get categories
  const categories = useSelector(selectCategories);

  // state for filter
  const [condition, setCon] = React.useState("");
  const [item, setIt] = React.useState("");
  const [category, setCat] = React.useState("");

  const modalRef = useRef();
  const closeModal = (e) => {
    if (e.target === modalRef.current) setIsOpen(false);
  };

  // set the parent state for filter
  const filter = () => {
    setItem(item);
    setCategory(category);
    setCondition(condition);
    // to avoid errors
    setStartDate(selectedDate ? new Date(selectedDate).getTime() : 0);
    setEndDate(
      selectedEnd
        ? new Date(selectedEnd).setHours(23, 59, 59, 99)
        : new Date().getTime()
    );

    setIsOpen(false);
  };
  return ReactDom.createPortal(
    <div ref={modalRef} onClick={closeModal}>
      <div className={style.centered}>
        <div className={style.modal}>
          <button className={style.closeBtn} onClick={() => setIsOpen(false)}>
            <RiCloseLine />
          </button>
          <form className={style.modalContent}>
            <div className={style.contentTop}>
              <label>
                <h2>Item Name</h2>
                <input
                  type="text"
                  onChange={(e) => setIt(e.target.value)}
                  value={item}
                />
              </label>
              <label>
                <h2>Item Category</h2>
                <select
                  style={{ textTransform: "capitalize" }}
                  onChange={(e) => setCat(e.target.value)}
                  value={category}
                >
                  <option key={1} value="">
                    All
                  </option>
                  {categories?.map((cat) => (
                    <option
                      style={{ textTransform: "capitalize" }}
                      key={cat._id}
                      value={cat.name}
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className={style.contentBottom}>
              <div>
                <h2>Start Date</h2>
                <label className={style.search}>
                  <DatePicker
                    className={style.dPicker}
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    maxDate={new Date()}
                    filterDate={(date) =>
                      date.getDay() !== 6 && date.getDay() !== 0
                    }
                    showYearDropdown
                    scrollableYearDropdown
                    preventOpenOnFocus={true}
                  />
                  <MdDateRange className={style.icon} size={20} />
                </label>
              </div>

              <div>
                <h2>End Date</h2>
                <label className={style.search}>
                  <DatePicker
                    className={style.dPicker}
                    selected={selectedEnd}
                    onChange={(date) => setSelectedEnd(date)}
                    maxDate={new Date()}
                    filterDate={(date) =>
                      date.getDay() !== 6 && date.getDay() !== 0
                    }
                    showYearDropdown
                    scrollableYearDropdown
                    preventOpenOnFocus={true}
                  />
                  <MdDateRange className={style.icon} size={20} />
                </label>
              </div>

              <div>
                <label className={style.contentLast}>
                  <h2>Condition</h2>
                  <select
                    onChange={(e) => setCon(e.target.value)}
                    value={condition}
                  >
                    <option value="">All</option>
                    <option value="available">Available</option>
                    <option value="Not Available">Not Available</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </label>
              </div>
            </div>
          </form>

          <div className={style.modalActions}>
            <div className={style.actionsContainer}>
              <button className={style.cancelBtn} onClick={filter}>
                Filter Data
              </button>
              <button
                className={style.deleteBtn}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default Modal;
