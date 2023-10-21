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
  reduxUpdateHaveOffer,
} from "../redux/callStreamSlicer";
import { reduxUpdateCallStatus } from "../redux/callingsSlice";

const Home = () => {
  const myVideo = useRef(null);
  const inComingVideo = useRef(null);
  const dispatch = useDispatch();
  const { activeConversation, chattedUser } = useSelector(
    (store) => store.messages
  );
  const { socket } = useSelector((store) => store.sockets);
  const { loggedUser, mySocketId } = useSelector((store) => store.currentUser);
  const { videoScreen } = useSelector((store) => store.callStatuses);
  const { localStream, offerObject, peerConnection, haveOffer } = useSelector(
    (store) => store.streams
  );

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

  useEffect(() => {
    if (socket) {
      socket.on("iceToClient", (iceCandidate) => {
        peerConnection.addIceCandidate(iceCandidate);
      });
    }
  }, [socket, peerConnection]);

  const startVideoCall = async () => {
    try {
      dispatch(reduxUpdateCallStatus({ cst: "videoScreen", value: true }));
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
      dispatch(reduxUpdateHaveOffer({ have: "haveOffer", value: true }));
      socket.emit("newOffer", { offer });
    };
    if (peerConnection && !haveOffer) {
      createOffers();
    }
  }, [peerConnection, socket, dispatch, haveOffer]);

  const answerVideoCall = async () => {
    try {
      await fetchUserMedia();
      await createPeerConnection(offerObject);

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
      {videoScreen && <Calls myVideo={myVideo} inComingVideo={inComingVideo} />}
    </>
  );
};

export default Home;
