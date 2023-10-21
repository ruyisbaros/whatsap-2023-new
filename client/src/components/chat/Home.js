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

const Home = () => {
  const myVideo = useRef();
  const inComingVideo = useRef();
  const connectionRef = useRef();
  const dispatch = useDispatch();
  const { activeConversation, chattedUser } = useSelector(
    (store) => store.messages
  );
  const { socket } = useSelector((store) => store.sockets);
  const { loggedUser, mySocketId } = useSelector((store) => store.currentUser);
  //const { loggedUser } = useSelector((store) => store.currentUser);
  const [stream, setStream] = useState("");
  const [call, setCall] = useState({
    receivingCall: false,
    callEnded: false,
    callAccepted: false,
    videoScreen: false,
    name: "",
    picture: "",
    callerSocketId: "",
    signal: "",
    audioMuted: false,
    ringingMuted: false,
    IamCaller: false,
  });

  useEffect(() => {
    setCall((prev) => ({ ...prev, callerSocketId: mySocketId }));
  }, [mySocketId]);
  //On Sockets
  useEffect(() => {
    if (socket) {
      socket.on("call user", (data) => {
        //console.log("Socket runs first UE");
        setCall((prev) => ({
          ...prev,
          callerSocketId: data.from,
          name: data.name,
          picture: data.picture,
          signal: data.signal,
          receivingCall: true,
        }));
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("end call user", () => {
        console.log("Socket runs second UE");
        setCall((prev) => ({
          ...prev,
          callEnded: true,
          videoScreen: false,
          IamCaller: false,
        }));
        //myVideo.current.srcObject = null;
        // connectionRef.current && connectionRef.current.destroy();
        if (call.callAccepted) {
          connectionRef?.current?.destroy();
        }
      });
    }
  }, [socket]);

  //console.log(call);
  const enableMedia = () => {
    myVideo.current.srcObject = stream;
  };
  const streamMedia = useCallback(async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(currentStream);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);
  useEffect(() => {
    streamMedia();
  }, [streamMedia]);

  const callUser = async () => {
    try {
      enableMedia();
      setCall((prev) => ({
        ...prev,
        name: loggedUser.name,
        picture: loggedUser.picture,
        videoScreen: true,
        IamCaller: true,
        callerSocketId: mySocketId,
      }));
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });
      peer.on("signal", (data) => {
        socket.emit("call user", {
          userToCall: chattedUser._id,
          signal: data,
          from: call.callerSocketId,
          name: loggedUser.name,
          picture: loggedUser.picture,
        });
      });
      peer.on("stream", (lineStream) => {
        //console.log(lineStream);
        myVideo.current.srcObject = stream;
        inComingVideo.current.srcObject = lineStream;
      });
      socket.on("answer call user", (signal) => {
        //console.log(signal);
        peer.signal(signal);
        setCall((prev) => ({ ...prev, callAccepted: true, videoScreen: true }));
      });

      connectionRef.current = peer;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const answerCall = async () => {
    try {
      enableMedia();
      setCall((prev) => ({ ...prev, callAccepted: true, videoScreen: true }));
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
        //console.log(currentStream);
        inComingVideo.current.srcObject = currentStream;
        myVideo.current.srcObject = stream;
      });
      peer.signal(call.signal);
      connectionRef.current = peer;
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleEndCall = () => {
    console.log(call);
    let id = call.IamCaller ? chattedUser._id : call.callerSocketId;
    console.log("ID", id);
    //myVideo.current.srcObject = null;
    setCall((prev) => ({
      ...prev,
      callEnded: true,
      videoScreen: false,
      receivingCall: false,
    }));
    socket.emit("end call user", {
      calle: call.IamCaller,
      id,
    });
    connectionRef?.current?.destroy();
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
        handleEndCall={handleEndCall}
      />
    </>
  );
};

export default Home;
