import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../../components/dashboardComponent/dashboard/Dashboard";
import Accounting from "../../components/dashboardComponent/accounting/Accounting";
import Setting from "../../components/dashboardComponent/setting/Setting";
import Categories from "../../components/dashboardComponent/categories/Categories";
import Inventory from "../../components/dashboardComponent/inventory/Inventory";
import History from "../../components/dashboardComponent/history/History";
import Experiment from "../../components/dashboardComponent/experiment/Experiment";
import Navbar from "../../components/dashboardComponent/navbar/Navbar";
import Header from "../../components/dashboardComponent/header/Header";
import Electronics from "../../components/dashboardComponent/subCategory/electronics/Electronics";
import Computer from "../../components/dashboardComponent/subCategory/computer/Computer";
import Software from "../../components/dashboardComponent/subCategory/software/Software";
import Archives from "../../components/dashboardComponent/archives/Archives";
import Admin from "../../components/dashboardComponent/user/User";
import style from "./dashboard.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../../reducers/userSlice";

const DAshboard = () => {
  const user = useSelector(selectUser);

  if (!user) return <Navigate replace to="/" />;

  return (
    <div className={style.dashboard}>
      <div className={style.navbar}>
        <Navbar />
      </div>
      <div className={style.content}>
        <Header />
        <Routes>
          <Route path="main" element={<Dashboard />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="setting" element={<Setting />} />
          <Route path="categories" element={<Categories />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="history" element={<History />} />
          <Route path="experiment" element={<Experiment />} />
          <Route path="categories/electronics" element={<Electronics />} />
          <Route path="categories/computer" element={<Computer />} />
          <Route path="categories/software" element={<Software />} />
          {user?.role === "admin" && (
            <>
              <Route path="archives" element={<Archives />} />
              <Route path="users" element={<Admin />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default DAshboard;
