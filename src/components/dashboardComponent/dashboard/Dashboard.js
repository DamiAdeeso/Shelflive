import React from "react";
import style from "./dashboard.module.scss";
import Card from "../../card/Card";
import { BsStack } from "react-icons/bs";
import { MdOutlineInventory, MdOutlineInventory2 } from "react-icons/md";
import { useSelector } from "react-redux";
import { selectInfo } from "../../../reducers/inventorySlice";

const Dashboard = () => {
  // get informations
  const info = useSelector(selectInfo);

  return (
    <>
      <div className={style.header}>
        <hr />
        <h2 style={{ color: "#0d1e6d" }}>Dashboard</h2>
        <p>A brief summary of all the items</p>
      </div>

      <div style={{ backgroundColor: "#Ebedee" }}>
        <div className={style.content}>
          <Card cardClass={style.item}>
            <div className={style.img}>
              <div
                style={{
                  backgroundColor: "#8bbdda",
                  width: "35px",
                  textAlign: "center",
                  border: "1px solid #8bbdda",
                }}
                className={style.content__icon}
              >
                <BsStack size={20} />
              </div>
              <p>Total - Items</p>
            </div>
            <h1>{info?.totaleItems[0]?.total_items || 0}</h1>
          </Card>

          <Card cardClass={style.item}>
            <div className={style.img}>
              <div
                style={{
                  backgroundColor: "#95e08f",
                  width: "35px",
                  textAlign: "center",
                  border: "1px solid #95e08f",
                }}
                className={style.content__icon}
              >
                <MdOutlineInventory size={22} />
              </div>
              <p>Available Items</p>
            </div>
            <h1>
              {info?.condition.find((obj) => obj._id === "Available")?.total ||
                0}
            </h1>
          </Card>

          <Card cardClass={style.item}>
            <div className={style.img}>
              <div
                style={{
                  backgroundColor: "#E8a5a5",
                  width: "35px",
                  textAlign: "center",
                  border: "1px solid #E8a5a5",
                }}
                className={style.content__icon}
              >
                <MdOutlineInventory2 size={22} />
              </div>
              <p>Used Items</p>
            </div>
            <h1>
              {info?.condition.find((obj) => obj._id === "Damaged")?.total || 0}
            </h1>
          </Card>

        </div>

        <div className={`container ${style.details}`}>
          <Card cardClass={style.check}>
            <h2>Item Overview</h2>
            <div className={style.box__action}>
              <div className={style.box}>
                <span>
                  <BsStack
                    className={style.content__icon}
                    style={{ border: "1px solid #48a64f", color: "#48a64f" }}
                  />
                  <div>
                    <p>New Item</p>
                  </div>
                </span>
                <p>{info?.item_overview[0]?.new || 0}</p>
              </div>
              <div className={style.box}>
                <span>
                  <BsStack
                    className={style.content__icon}
                    style={{ border: "1px solid #E43939", color: "#E43939" }}
                  />
                  <div>
                    <p>Old Item</p>
                  </div>
                </span>
                <p>{info?.item_overview[0]?.old || 0}</p>
              </div>
              
            </div>
          </Card>

          <Card cardClass={style.check}>
            <h2>Condition Details</h2>
            <div className={style.box__action}>
              <div className={style.box}>
                <span>
                  <BsStack
                    className={style.content__icon}
                    style={{ border: "1px solid #48a64f", color: "#48a64f" }}
                  />
                  <div>
                    <p>Available / Good Condition</p>
                  </div>
                </span>
                <p>
                  {info?.condition.find((obj) => obj._id === "Available")
                    ?.total || 0}
                </p>
              </div>
              <div className={style.box}>
                <span>
                  <BsStack
                    className={style.content__icon}
                    style={{ border: "1px solid #E43939", color: "#E43939" }}
                  />
                  <div>
                    <p>Damaged</p>
                  </div>
                </span>
                <p>
                  {info?.condition.find((obj) => obj._id === "Damaged")
                    ?.total || 0}
                </p>
              </div>
              <div className={style.box}>
                <span>
                  <BsStack
                    className={style.content__icon}
                    style={{ border: "1px solid #6b70e2", color: "#6b70e2" }}
                  />
                  <div>
                    <p>Not Available</p>
                  </div>
                </span>
                <p>
                  {info?.condition.find((obj) => obj._id === "Not Available")
                    ?.total || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card cardClass={style.check}>
            <h2>Categories Details</h2>
            <div className={style.box__action}>
              {info?.categories.map((val) => (
                <div key={val._id} className={style.box}>
                  <span>
                    <BsStack
                      className={style.content__icon}
                      style={{ border: "1px solid #6b70e2", color: "#6b70e2" }}
                    />
                    <div>
                      <p style={{ textTransform: "capitalize" }}>
                        {val._id} Components
                      </p>
                    </div>
                  </span>
                  <p>{val.total}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card cardClass={style.check}>
            <h2>Accounting</h2>
            <div className={style.box__action}>
              <div className={style.box}>
                <span>
                  <BsStack
                    className={style.content__icon}
                    style={{ border: "1px solid #24d6ac", color: "#24d6ac" }}
                  />
                  <div>
                    <p>Net Spend</p>
                  </div>
                </span>
                <p>{toCurrency(info?.accounting[0]?.net_spend)}</p>
              </div>
              <div className={style.box}>
                <span>
                  <BsStack
                    className={style.content__icon}
                    style={{ border: "1px solid #48a64f", color: "#48a64f" }}
                  />
                  <div>
                    <p>Current Loss</p>
                  </div>
                </span>
                <p>{toCurrency(info?.accounting[0]?.current_worth)}</p>
              </div>
              <div className={style.box}>
                <span>
                  <BsStack
                    className={style.content__icon}
                    style={{ border: "1px solid #B7b90a", color: "#B7b90a" }}
                  />
                  <div>
                    <p>Net Loss</p>
                  </div>
                </span>
                <p>{toCurrency(info?.accounting[0]?.net_loss)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

const toCurrency = (num) => {
  const f = new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
  });
  return f.format(num ? num : 0);
};
