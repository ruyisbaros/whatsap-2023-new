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
  const { loggedUser } = useSelector((store) => store.currentUser);
  const { videoScreen } = useSelector((store) => store.callStatuses);
  const { localStream, offerObject, peerConnection, haveOffer, iceCandidates } =
    useSelector((store) => store.streams);

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
      dispatch(reduxUpdateCallStatus({ cst: "videoScreen", value: true }));
      await fetchUserMedia();
      const { remoteStream } = await createPeerConnection();
      dispatch(reduxAddRemoteStream(remoteStream));
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
      const { remoteStream } = await createPeerConnection(offerObject);
      dispatch(reduxAddRemoteStream(remoteStream));
      const answer = await peerConnection.createAnswer({});
      //console.log(answer);
      await peerConnection.setLocalDescription(answer);

      //socket.emit("newAnswer", offerObj);
    } catch (error) {
      toast.error("Something went wrong! Try again");
    }
  };

  useEffect(() => {
    const createAnswers = async () => {
      const answer = await peerConnection.createAnswer({});
      peerConnection.setLocalDescription(answer);
      dispatch(reduxUpdateHaveOffer({ have: "haveOffer", value: true }));
      socket.emit("newAnswer", { answer });
    };
    if (peerConnection && offerObject.offer !== "") {
      createAnswers();
    }
  }, [peerConnection, socket, dispatch, offerObject.offer]);
  const stopVideoCall = async () => {
    try {
      //socket.emit("newAnswer", offerObj);
    } catch (error) {
      toast.error("Something went wrong! Try again");
    }
  };

  useEffect(() => {
    if (iceCandidates.length > 0 && peerConnection) {
      iceCandidates.forEach((candidate) => {
        peerConnection.addIceCandidate(candidate);
      });

      console.log("all candidates added");
    }
  }, [dispatch, iceCandidates, peerConnection]);

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
      {videoScreen && (
        <Calls
          stopVideoCall={stopVideoCall}
          answerVideoCall={answerVideoCall}
          myVideo={myVideo}
          inComingVideo={inComingVideo}
        />
      )}
    </>
  );
};

export default Home;
