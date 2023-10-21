import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const RegisteredRoutes = () => {
  const { loggedUser } = useSelector((store) => store.currentUser);
  return loggedUser ? <Navigate to="/" /> : <Outlet />;
};

export default RegisteredRoutes;
