import React, { useCallback, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LoggedInRoutes from "./ristrict_routes/LoggedInRoutes";
import NotLoggedInRoutes from "./ristrict_routes/NotLoggedInRoutes";
import RegisteredRoutes from "./ristrict_routes/RegisteredRoutes";
//import { connectToSocketServer, joinUser } from "./SocketIOConnection";
import { useDispatch, useSelector } from "react-redux";
import axios from "./axios";
import {
  reduxMakeTokenExpired,
  reduxRegisterUser,
} from "./redux/currentUserSlice";
import {
  reduxDeleteMyStatus,
  reduxGetActiveStatuses,
  reduxSetMyStatus,
} from "./redux/statusSlicer";
import { deleteStatus } from "./SocketIOConnection";

/* https://github.com/robertbunch/webrtcCourse */
const App = () => {
  const dispatch = useDispatch();
  const { loggedUser } = useSelector((store) => store.currentUser);
  const { myStatus } = useSelector((store) => store.statuses);

  const reFreshToken = useCallback(async () => {
    try {
      const { data } = await axios.get("/auth/refresh_token");
      window.localStorage.setItem("registeredUser", JSON.stringify(data.user));
      await dispatch(reduxRegisterUser(data.user));
    } catch (error) {
      dispatch(reduxMakeTokenExpired());
      console.log(error.response.data.message);
    }
  }, [dispatch]);
  useEffect(() => {
    if (loggedUser) {
      reFreshToken();
    }
  }, [reFreshToken]);

  const fetchActiveStatuses = useCallback(async () => {
    try {
      const { data } = await axios.get("/status/active_sts");
      console.log(data);
      dispatch(reduxGetActiveStatuses(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchActiveStatuses();
  }, [fetchActiveStatuses]);

  const fetchMyStatus = useCallback(async () => {
    try {
      const { data } = await axios.get("/status/my_status");

      console.log(data);
      dispatch(reduxSetMyStatus(data));
    } catch (error) {
      toast.error(error.response.data?.message);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMyStatus();
  }, [fetchMyStatus]);

  //DELETE STORIES AUTOMATICALLY
  const deleteExpiredStory = useCallback(async () => {
    const { data } = await axios.delete(`/status/delete/${myStatus._id}`);
    if (data === "deleted") {
      dispatch(reduxDeleteMyStatus());

      //Emit deleted status
      deleteStatus(myStatus?.targets, myStatus?._id);
    }
  }, [myStatus, dispatch]);

  return (
    <div className="dark ">
      <ToastContainer position="bottom-center" limit={1} />

      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<RegisteredRoutes />}>
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

/* 

import { extractPublicId } from 'cloudinary-build-url'

const publicId = extractPublicId(
    "http://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  ) 
*/
