import React from "react";
import style from "./experiment.module.scss";

// icons
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { BsDot, BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { dateFormat } from "../../../features/dateFormat";

function ExpComponent({ exp, setExpInfo, setStudentInfo, setStudentToDelete }) {
  const [showTable, setShowTable] = React.useState(false);
  // show table experiment handler
  const showExpHandler = () => {
    setShowTable((prev) => !prev);
  };

  return (
    <>
      <div data-style="button">
        <div className={style.toggle__action}>
          <div className={style.toggle__content} onClick={showExpHandler}>
            <h2>{dateFormat(exp.date)}</h2>
            <div>
              <h2>{exp.title}</h2>
              <span className={style.toggle__filter}>
                {showTable ? (
                  <IoIosArrowDown size={30} />
                ) : (
                  <IoIosArrowForward size={30} />
                )}
              </span>
            </div>
          </div>
          {showTable ? (
            <button
              className={style.toggle__button}
              onClick={() => setExpInfo(exp)}
            >
              <span style={{ marginRight: "10px" }}>
                <FaEye />
              </span>
              <h4>Check Out</h4>
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className={style.table}>
        {showTable ? (
          <table>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" disabled />
                </th>
                <th>Matric No</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {exp?.students.map((student) => {
                const bgcl =
                  student.status === "returned" ? "#B5e4b5" : "#E2dada";
                const cl =
                  student.status === "returned" ? "#066B06" : "#524f4f";
                return (
                  <tr key={student._id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{student.matno}</td>
                    <td>
                      {student.fname} {student.lname}
                    </td>
                    <td>
                      <div
                        className={style.status}
                        style={{
                          backgroundColor: bgcl,
                          color: cl,
                        }}
                      >
                        <BsDot style={{ marginTop: "2px" }} />
                        {student.status}
                      </div>
                    </td>
                    <td className={style.icons}>
                      <FiEdit
                        color="#151596"
                        onClick={() => setStudentInfo(student)}
                      />
                      <BsTrash
                        color="#Bf1111"
                        onClick={() => setStudentToDelete(student)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default ExpComponent;
