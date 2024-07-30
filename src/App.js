import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/* uncomment the home variable before using it in the routes section */
import { Dashboard, Login, Signup, /* Home,*/ Reset } from "./pages";
import React from "react";
import MessageComponent from "./reducers/message/MessageComponent";

function App() {

  return (
    <>
      <MessageComponent />
        <Routes>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset" element={<Reset />} />
        </Routes>
    </>
  );
}

export default App;
