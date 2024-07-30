import React from "react";
import { NavLink } from "react-router-dom";
import style from "./navbar.module.scss";
import {
  MdOutlineInventory,
  MdOutlineDashboard,
  MdOutlineCategory,
} from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { HiOutlineUsers } from "react-icons/hi";
import { RiInboxArchiveLine } from "react-icons/ri";
import { AiOutlineExperiment, AiOutlineHistory } from "react-icons/ai";
import { GiCoins } from "react-icons/gi";
import dashLogo from "../../../assets/images/dashLogo.PNG";
import { useDispatch, useSelector } from "react-redux";
import {
  resetUser,
  selectUser,
  setUser,
  setUsers,
} from "../../../reducers/userSlice";
import {
  setArchives,
  setInformations,
  setItems,
} from "../../../reducers/inventorySlice";
import { setCategories } from "../../../reducers/categorySlice";
import addMessage from "../../../features/addMessage";
import { setHistory } from "../../../reducers/historySlice";
import { setExp } from "../../../reducers/experimentSlice";

const activeLink = ({ isActive }) => (isActive ? `${style.active}` : "");
const Navbar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // get all items for inventory page
  const getInventory = async () => {
    const items = JSON.parse(await window.api.inventory.getAll(user._id));
    if (!items.err) dispatch(setItems(items.result));
  };

  // get all categories and sub-categories for category page
  const getCategories = async () => {
    const categories = JSON.parse(await window.api.category.get(user._id));
    if (!categories.err) dispatch(setCategories(categories.result));
  };

  // get the the history for history page
  const getHistory = async () => {
    const history = JSON.parse(
      await window.api.history.getAll({
        userID: user._id,
        match: null,
      })
    );
    if (history.err) return addMessage(history, dispatch);
    dispatch(setHistory(history.result));
  };

  // get information for dashboard and accounting pages
  const getInfo = async () => {
    const informations = JSON.parse(
      await window.api.inventory.getInfo(user._id)
    );
    if (informations.err) {
      if (informations.result === undefined) return dispatch(setUser(null));
      return addMessage(informations, dispatch);
    }
    return dispatch(setInformations(informations.result));
  };

  // get the archives for archives page
  const getArchives = async () => {
    const archives = JSON.parse(
      await window.api.inventory.getArchives(user._id)
    );
    if (archives.err) {
      if (archives.result === undefined) {
        addMessage(archives, dispatch);
        return dispatch(setUser(null));
      } else return addMessage(archives, dispatch);
    }

    dispatch(setArchives(archives.result));
  };

  // get all users
  const getUsers = async () => {
    const users = JSON.parse(await window.api.users.getUsers(user._id));
    if (users.err) {
      if (users.result === undefined) {
        addMessage(users, dispatch);
        return dispatch(resetUser());
      } else return addMessage(users, dispatch);
    }

    dispatch(setUsers(users.result));
  };

  // get experiments
  const getExperiment = async () => {
    const experiments = JSON.parse(await window.api.exp.getExp(user._id));
    if (experiments.err) {
      if (experiments.result === undefined) {
        addMessage(experiments, dispatch);
        return dispatch(resetUser);
      } else return addMessage(experiments, dispatch);
    }

    dispatch(setExp(experiments.result));
  };

  return (
    <div className={style.navbar}>
      <img
        src={dashLogo}
        width="150px"
        height="70px"
        style={{ marginLeft: "55px" }}
        alt="logo"
      />
      <nav>
        <ul>
          <li className={style.content}>
            <NavLink
              to="/dashboard/main"
              className={activeLink}
              onClick={getInfo}
            >
              <MdOutlineDashboard className={style.icon} />
              Dashboard
            </NavLink>
          </li>

          <li className={style.content}>
            <NavLink
              to="/dashboard/inventory"
              className={activeLink}
              onClick={getInventory}
            >
              <MdOutlineInventory className={style.icon} />
              Inventory
            </NavLink>
          </li>

          <li className={style.content}>
            <NavLink
              to="/dashboard/categories"
              className={activeLink}
              onClick={() => {
                getCategories();
                getInventory();
              }}
            >
              <MdOutlineCategory className={style.icon} />
              Categories
            </NavLink>
          </li>

          <li className={style.content}>
            <NavLink
              to="/dashboard/experiment"
              className={activeLink}
              onClick={() => {
                getInventory();
                getExperiment();
              }}
            >
              <AiOutlineExperiment className={style.icon} />
              Experiment
            </NavLink>
          </li>

          <li className={style.content}>
            <NavLink
              to="/dashboard/history"
              className={activeLink}
              onClick={getHistory}
            >
              <AiOutlineHistory className={style.icon} />
              History
            </NavLink>
          </li>

          <li className={style.content}>
            <NavLink
              to="/dashboard/accounting"
              className={activeLink}
              onClick={() => {
                getInventory();
                getInfo();
              }}
            >
              <GiCoins className={style.icon} />
              Accounting
            </NavLink>
          </li>
          {user?.role === "admin" && (
            <>
              <li className={style.content}>
                <NavLink
                  to="/dashboard/archives"
                  className={activeLink}
                  onClick={getArchives}
                >
                  <div>
                    <RiInboxArchiveLine className={style.icon} />
                  </div>
                  archives
                </NavLink>
              </li>
              <li className={style.content}>
                <NavLink
                  to="/dashboard/users"
                  className={activeLink}
                  onClick={getUsers}
                >
                  <div>
                    <HiOutlineUsers className={style.icon} />
                  </div>
                  admin
                </NavLink>
              </li>
            </>
          )}
          <li className={style.content}>
            <NavLink to="/dashboard/setting" className={activeLink}>
              <div>
                <FiSettings className={style.icon} />
              </div>
              Setting
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
