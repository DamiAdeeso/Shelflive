import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import Login from "../../assets/images/login.gif";
import Logo from "../../assets/images/logo.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import addMessage from "../../features/addMessage";
import { setUser } from "../../reducers/userSlice";
import { setInformations } from "../../reducers/inventorySlice";

const Signup = () => {
  const { register, reset, handleSubmit } = useForm();
  const [check, setCheck] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    // send data to server and wait for the response
    // parse the json response
    const result = JSON.parse(await window.api.auth.login(data));

    // show the err or success message
    addMessage(result, dispatch);

    // reset the form if error found
    if (!result.err) {
      dispatch(setUser(result.result));
      const info = JSON.parse(
        await window.api.inventory.getInfo(result.result._id)
      );
      if (!info.err) dispatch(setInformations(info.result));
      navigate("/dashboard/main");
      return reset();
    }
  };

  const setEye = () => {
    setCheck(!check);
  };
  return (
    <section className={`container ${styles.auth}`}>
      <div className={styles.img}>
        <img
          src={Logo}
          alt="login"
          style={{ width: "150px" }}
          className={styles.img__content}
        />
        <img width="400" src={Login} alt="login" />
      </div>
      <Card>
        <div className={styles.form} style={{ justifyContent: "center" }}>
          <div className={styles.header}>
            <h2>Log In</h2>
            <p>Lets's continue from where you stopped</p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)}>
            <label>
              <p>Work Email</p>
              <input
                type="email"
                placeholder="Enter your work email"
                required
                {...register("email", {
                  required: true,
                })}
              />
            </label>
            {/* data-style="icon" this attribute will be used to style this label */}
            <label data-style="icon">
              <p>Password</p>
              <input
                type={!check ? `password` : "text"}
                placeholder="Enter Password"
                required
                {...register("password", {
                  required: true,
                })}
              />
              <span onClick={() => setEye()} style={{ top: 0 }}>
                {check ? <AiFillEye /> : <AiFillEyeInvisible />}
              </span>
            </label>
            <div>
              <input type="checkbox" />
              <h5>Remember me</h5>
            </div>
            <Link to="/reset" className={styles.links}>
              <h5>Forgot Password</h5>
            </Link>
            <button type="submit">Login</button>
            <span className={styles.register}>
              <p>Do not have an account?</p>
              <Link to="/signup" className={styles.reg__link}>
                Register
              </Link>
            </span>
          </form>
        </div>
      </Card>
    </section>
  );
};

export default Signup;
