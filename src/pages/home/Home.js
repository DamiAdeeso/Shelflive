import React from 'react'
import { Link } from 'react-router-dom'
import style from "./home.module.scss"

const Home = () => {
  return (
    <div>
        <h1>HOME PAGE IS EMPTY </h1>
        <div className={style.home}>
          <Link to="/dashboard/main" className={style.home__link}>
            DASHBOARD
          </Link>
          <Link to="/signup" className={style.home__link}>
            SIGNUP
          </Link>
          <Link to="/login" className={style.home__link}>
            LOGIN
          </Link>
        </div>
    </div>
  )
}

export default Home