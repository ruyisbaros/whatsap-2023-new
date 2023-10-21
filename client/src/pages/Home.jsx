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
import { createPeerConnection, fetchUserMedia } from "../utils/webRTCUtils";
import {
  reduxAddPeerConnection,
  reduxAddRemoteStream,
} from "../redux/callStreamSlicer";
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
  const { localStream, offerObject, peerConnection } = useSelector(
    (store) => store.streams
  );

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

  const startVideoCall = async () => {
    try {
      setCall((prev) => ({ ...prev, videoScreen: true }));
      await fetchUserMedia();
      await createPeerConnection();
    } catch (error) {
      toast.error("Calling Error", error.message);
    }
  };

  useEffect(() => {
    if (localStream && peerConnection) {
      localStream.getVideoTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
      myVideo.current.srcObject = localStream;
    }
  }, [localStream, peerConnection]);

  useEffect(() => {
    const createOffers = async () => {
      const offer = await peerConnection.createOffer();
      peerConnection.setLocalDescription(offer);
    };
    if (peerConnection) {
      createOffers();
    }
  }, [peerConnection]);

  const answerVideoCall = async () => {
    try {
      await fetchUserMedia();
      const { peerConnection, remoteStream } = await createPeerConnection(
        offerObject
      );
      dispatch(reduxAddRemoteStream(remoteStream));
      dispatch(reduxAddPeerConnection(peerConnection));
      myVideo.current.srcObject = localStream;

      const answer = await peerConnection.createAnswer({});
      //console.log(answer);
      await peerConnection.setLocalDescription(answer);

      //socket.emit("newAnswer", offerObj);
    } catch (error) {
      toast.error("Something went wrong! Try again");
    }
  };

  return (
    <>
      <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden borderC">
        <div className="headBanner"></div>
        <div className="container h-[95%] pt-[19px] flex dark:bg-dark_bg_1">
          <SidebarLeft />
          {activeConversation ? (
            <ActiveChat startVideoCall={startVideoCall} />
          ) : (
            <WhatsappHome />
          )}
        </div>
      </div>
      {/* Calls */}
      {call.videoScreen && (
        <Calls
          myVideo={myVideo}
          inComingVideo={inComingVideo}
          call={call}
          setCall={setCall}
          localStream={localStream}
        />
      )}
    </>
  );
};

export default Home;
