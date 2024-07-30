import React from "react";
import styles from "./header.module.scss";
import { BiSearch } from "react-icons/bi";
import { BsBellFill } from "react-icons/bs";
import userImage from "../../../assets/images/user.png";

// icons
import { BiLogOutCircle } from "react-icons/bi";
import { useSelector } from "react-redux";
import { selectUser } from "../../../reducers/userSlice";
import Logout from "../../modal/logoutModal/LogoutModal";

const Search = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const user = useSelector(selectUser);

  const logout = () => {
    setShowMenu(false);
    setOpenModal(true);
  };

  const menu = () => {
    setShowMenu(true);
  };

  const closeHandler = () => {
    setShowMenu(false);
    setOpenModal(false);
  };

  return (
    <header>
      <Logout handleClose={closeHandler} open={openModal} />
      <div className={styles.header}>
        {/* <div className={styles.search}>
          <BiSearch className={styles.icon} size={20} />
          <input type="text" placeholder="Search" />
        </div> */}
        <div>
          <BsBellFill size={28} />
          <div className={styles.user} onClick={menu}>
            <img src={userImage} alt="user" className={styles.image} />
            <p>{user.fname}</p>
            <button data-display={showMenu && "show"} onClick={logout}>
              <span>logout</span>
              <BiLogOutCircle />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Search;
