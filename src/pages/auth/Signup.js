import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import RegisterImg from "../../assets/images/GDPR.gif";
import Logo from "../../assets/images/logo.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import addMessage from "../../features/addMessage";
import { useDispatch } from "react-redux";
import { setUser } from "../../reducers/userSlice";

const Signup = () => {
  const { register, reset, handleSubmit } = useForm();
  const [check, setCheck] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    const result = JSON.parse(await window.api.auth.signup(data));
    addMessage(result, dispatch);

    if (!result.err) {
      dispatch(setUser(result.result));
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
        <img width="400" src={RegisterImg} alt="login" />
      </div>
      <Card>
        <div className={styles.form}>
          <div className={styles.header}>
            <h2>Create an account</h2>
            <p>Lets's get you all set up</p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)}>
            <label>
              <p>First Name</p>
              <input
                type="text"
                placeholder="Enter first name"
                required
                {...register("fname", {
                  required: true,
                })}
              />
            </label>

            <label>
              <p>Last Name</p>
              <input
                type="text"
                placeholder="Enter last name"
                required
                {...register("lname", {
                  required: true,
                })}
              />
            </label>

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

            <label data-style="icon">
              <p>Password</p>
              <input
                type="password"
                placeholder="Create Password"
                required
                {...register("password", {
                  required: true,
                })}
              />
              <span onClick={() => setEye()}>
                {check ? <AiFillEye /> : <AiFillEyeInvisible />}
              </span>
            </label>
            <div>
              <input type="checkbox" />
              <h5>I accept the terms and conditions</h5>
            </div>
            <button type="submit">Sign Up</button>
            <span className={styles.register}>
              <p>Already have an account?</p>
              <Link to="/" className={styles.reg__link}>
                Login
              </Link>
            </span>
          </form>
        </div>
      </Card>
    </section>
  );
};

export default Signup;
