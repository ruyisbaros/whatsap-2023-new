import React, { useCallback, useEffect, useRef, useState } from "react";
import SidebarLeft from "../components/sidebar/SidebarLeft";
import axios from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { reduxGetMyConversations } from "../redux/chatSlice";
import WhatsappHome from "../components/chat/WhatsappHome";
import ActiveChat from "../components/chat/ActiveChat";
import Calls from "../components/video_calls/Calls";
import Peer from "simple-peer";
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
};
const Home = () => {
  const myVideo = useRef(null);
  const inComingVideo = useRef(null);
  const connectionRef = useRef(null);
  const dispatch = useDispatch();
  const { activeConversation, chattedUser } = useSelector(
    (store) => store.messages
  );
  const { socket } = useSelector((store) => store.sockets);
  const { loggedUser, mySocketId } = useSelector((store) => store.currentUser);
  //const { loggedUser } = useSelector((store) => store.currentUser);
  const { callingUser } = useSelector((store) => store.videos);

  const [stream, setStream] = useState();
  const [call, setCall] = useState(callData);

  //On Sockets
  useEffect(() => {
    if (socket) {
      socket.on("call user", (data) => {
        setCall({
          ...call,
          callerSocketId: data.from,
          name: data.name,
          picture: data.picture,
          signal: data.signal,
          receivingCall: true,
        });
      });
    }
  }, [socket]);

  //console.log(call);
  const enableMedia = () => {
    myVideo.current.srcObject = stream;
  };
  const streamMedia = async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(currentStream);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    streamMedia();
  }, []);

  const callUser = async () => {
    try {
      enableMedia();
      setCall({
        ...call,
        name: loggedUser.name,
        picture: loggedUser.picture,
        videoScreen: true,
      });
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });
      peer.on("signal", (data) => {
        socket.emit("call user", {
          userToCall: chattedUser._id,
          signal: data,
          from: mySocketId,
          name: loggedUser.name,
          picture: loggedUser.picture,
        });
      });
      peer.on("stream", (lineStream) => {
        console.log(lineStream);
        myVideo.current.srcObject = stream;
        inComingVideo.current.srcObject = lineStream;
      });
      socket.on("answer call user", (signal) => {
        console.log(signal);
        peer.signal(signal);
        setCall({ ...call, callAccepted: true, videoScreen: true });
      });

      connectionRef.current = peer;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const answerCall = async () => {
    try {
      enableMedia();
      setCall({ ...call, callAccepted: true, videoScreen: true });
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on("signal", (data) => {
        socket.emit("answer call user", {
          signal: data,
          to: call.callerSocketId,
        });
      });
      peer.on("stream", (currentStream) => {
        console.log(currentStream);
        inComingVideo.current.srcObject = currentStream;
        myVideo.current.srcObject = stream;
      });
      peer.signal(call.signal);
      connectionRef.current = peer;
    } catch (error) {
      toast.error(error.message);
    }
  };

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
          {activeConversation ? (
            <ActiveChat callUser={callUser} />
          ) : (
            <WhatsappHome />
          )}
        </div>
      </div>
      {/* Calls */}
      <Calls
        myVideo={myVideo}
        inComingVideo={inComingVideo}
        answerCall={answerCall}
        call={call}
        setCall={setCall}
        stream={stream}
      />
    </>
  );
};

export default Home;
