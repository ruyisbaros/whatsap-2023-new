import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../pages/Login";

const LoggedInRoutes = () => {
  const { loggedUser, tokenExpired } = useSelector(
    (store) => store.currentUser
  );
  //console.log(loggedUser);
  return loggedUser && !tokenExpired ? <Outlet /> : <Login />;
};

export default LoggedInRoutes;
