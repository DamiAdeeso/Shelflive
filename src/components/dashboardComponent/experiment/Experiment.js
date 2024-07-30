import React, { useState } from "react";
import style from "./experiment.module.scss";
import { AiOutlinePlus } from "react-icons/ai";
import ExperimentModal from "../../modal/experimentModal/ExperimentModal";
import { selectExp } from "../../../reducers/experimentSlice";
import { useSelector } from "react-redux";
import ExpComponent from "./ExpComponent";
import AddStudent from "../../modal/experimentModal/StudentModal/AddStudent";
import EditStudent from "../../modal/experimentModal/StudentModal/EditStudent";
import DeleteStudent from "../../modal/experimentModal/StudentModal/DeleteStudent";
import { TextField } from "@mui/material";

const Experiment = () => {
  // get experiments array
  const experiments = useSelector(selectExp);

  // search statement
  const [search, setSearch] = React.useState("");

  const [expArray, setExpArray] = React.useState([]);
  const [expInfo, setExpInfo] = React.useState(null);
  const [studentInfo, setStudentInfo] = React.useState(null);
  const [studentToDelete, setStudentToDelete] = React.useState(null);

  const closeStudentModalHandler = () => {
    setExpInfo(null);
  };
  const closeStudentEditModelHandler = () => {
    setStudentInfo(null);
  };
  const closeDeleteStudentModalHandler = () => {
    setStudentToDelete(null);
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen((prev) => !prev);
  };

  React.useEffect(() => {
    if (experiments)
      setExpArray(
        experiments.filter((val) => {
          const s = search.toUpperCase();
          return (
            val.handler.toUpperCase().includes(s) ||
            val.title.toUpperCase().includes(s)
          );
        })
      );
  }, [experiments, search]);

  return (
    <section>
      <div className={style.experiment}>
        <div>
          <h2 style={{ color: "#0d1e6d", fontSize: "30px" }}>Experiment</h2>
          <p>A curated list of all experiments carried out in the lab</p>
        </div>
        <div className={style.content}>
          <TextField
            size="small"
            sx={{ marginRight: "20px" }}
            label="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            className={style.icon}
            style={{ backgroundColor: "#0d1e6d", color: "white" }}
            onClick={handleClose}
          >
            <span className={style.filter}>
              <AiOutlinePlus size={30} />
            </span>
            <h4>Add Experiment</h4>
          </div>
          <ExperimentModal handleClose={handleClose} open={open} />
        </div>
      </div>
      <AddStudent handleClose={closeStudentModalHandler} open={expInfo} />
      <EditStudent
        handleClose={closeStudentEditModelHandler}
        open={studentInfo}
      />
      <DeleteStudent
        handleClose={closeDeleteStudentModalHandler}
        open={studentToDelete}
      />
      <div className={style.subExp}>
        {expArray.map((val) => (
          <ExpComponent
            setExpInfo={setExpInfo}
            setStudentInfo={setStudentInfo}
            setStudentToDelete={setStudentToDelete}
            exp={val}
            key={val._id}
          />
        ))}
      </div>
    </section>
  );
};

export default Experiment;
