import React, { useCallback, useEffect, useRef, useState } from "react";
import SidebarLeft from "../components/sidebar/SidebarLeft";
import axios from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { reduxGetMyConversations } from "../redux/chatSlice";
import WhatsappHome from "../components/chat/WhatsappHome";
import ActiveChat from "../components/chat/ActiveChat";
import Calls from "../components/video_calls/Calls";
import { reduxMakeTokenExpired } from "../redux/currentUserSlice";
const callData = {
  receivingCall: false,
  callEnded: false,
  callAccepted: false,
  videoScreen: false,
  name: "",
  picture: "",
  callerSocketId: "",
  signal: "",
  ringingMuted: false,
};
const Home = () => {
  const myVideo = useRef(null);
  const inComingVideo = useRef(null);
  const dispatch = useDispatch();
  const { activeConversation, chattedUser } = useSelector(
    (store) => store.messages
  );
  const { socket } = useSelector((store) => store.sockets);
  const { loggedUser, mySocketId } = useSelector((store) => store.currentUser);

  const [stream, setStream] = useState();
  const [call, setCall] = useState(callData);
  const fetchMyConversations = useCallback(async () => {
    try {
      const { data } = await axios.get("/conversation/my_conversations");
      console.log(data);
      console.log(data.filter((dt) => dt.latestMessage));
      dispatch(reduxGetMyConversations(data.filter((dt) => dt.latestMessage)));
    } catch (error) {
      if (error.response.data.message === "jwt expired") {
        dispatch(reduxMakeTokenExpired());
      } else {
        toast.error(error.response.data.message);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMyConversations();
  }, [fetchMyConversations]);

  return (
    <>
      <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden borderC">
        <div className="headBanner"></div>
        <div className="container h-[95%] pt-[19px] flex dark:bg-dark_bg_1">
          <SidebarLeft />
          {activeConversation ? <ActiveChat /> : <WhatsappHome />}
        </div>
      </div>
      {/* Calls */}
      {!call.videoScreen && (
        <Calls
          myVideo={myVideo}
          inComingVideo={inComingVideo}
          call={call}
          setCall={setCall}
          stream={stream}
        />
      )}
    </>
  );
};

export default Home;
