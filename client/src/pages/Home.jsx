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
  reduxAddRemoteStream,
  reduxRemoveStreamPeer,
} from "../redux/callStreamSlicer";
import { reduxUpdateCallStatus } from "../redux/callingsSlice";
import GroupInfo from "../components/groupChat/GroupInfo";
import SideBarStatus from "../components/status/SideBarStatus";
import CreateStatus from "../components/status/CreateStatus";
import ViewStatus from "../components/status/ViewStatus";
import ViewMyStatus from "../components/status/ViewMyStatus";

const Home = () => {
  const myVideo = useRef(null);
  const inComingVideo = useRef(null);
  const dispatch = useDispatch();
  const { activeConversation, chattedUser, targets } = useSelector(
    (store) => store.messages
  );
  const { socket } = useSelector((store) => store.sockets);
  const { loggedUser } = useSelector((store) => store.currentUser);
  const {
    videoScreen,
    offerer,
    caller,
    callee,
    current,
    haveOffer,
    callRejected,
    callAccepted,
  } = useSelector((store) => store.callStatuses);
  const {
    localStream,
    offerObject,
    peerConnection,
    iceCandidates,
    remoteStream,
  } = useSelector((store) => store.streams);
  const { activeStatuses } = useSelector((store) => store.statuses);

  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showStatusInfo, setShowStatusInfo] = useState(false);
  const [showCreateStatus, setShowCreateStatus] = useState(false);
  const [showViewStatus, setShowViewStatus] = useState(false);
  const [showMyStatus, setShowMyStatus] = useState(false);
  const [statusCondition, setStatusCondition] = useState({
    available: false,
    seen: false,
  });

  const fetchMyConversations = useCallback(async () => {
    try {
      const { data } = await axios.get("/conversation/my_conversations");
      console.log(data);
      //console.log(data.filter((dt) => dt.latestMessage));
      dispatch(
        reduxGetMyConversations(
          data.filter((dt) => (dt.isGroup ? dt : dt.latestMessage))
        )
      );
    } catch (error) {
      if (error?.response?.data?.message === "jwt expired") {
        dispatch(reduxMakeTokenExpired());
      } else {
        toast.error(error.response.data?.message);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMyConversations();
  }, [fetchMyConversations]);
  //console.log(targets);
  const startVideoCall = async () => {
    try {
      dispatch(reduxUpdateCallStatus({ cst: "videoScreen", value: true }));
      dispatch(reduxUpdateCallStatus({ cst: "caller", value: true }));
      dispatch(reduxUpdateCallStatus({ cst: "callEnded", value: false }));
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
  //Create offer
  useEffect(() => {
    const createOffers = async () => {
      const offer = await peerConnection.createOffer();
      peerConnection.setLocalDescription(offer);
      dispatch(reduxUpdateCallStatus({ cst: "haveOffer", value: true }));
      socket.emit("newOffer", {
        offer,
        target: chattedUser?._id,
        name: chattedUser?.name,
        picture: chattedUser?.picture,
        offerer: loggedUser.id,
      });
    };
    if (socket && peerConnection && !haveOffer && caller) {
      createOffers();
    }
  }, [
    peerConnection,
    socket,
    dispatch,
    haveOffer,
    loggedUser,
    chattedUser,
    caller,
  ]);

  const answerVideoCall = async () => {
    try {
      dispatch(reduxUpdateCallStatus({ cst: "callAccepted", value: true }));
      dispatch(reduxUpdateCallStatus({ cst: "callee", value: true }));
      dispatch(reduxUpdateCallStatus({ cst: "callEnded", value: false }));
      await fetchUserMedia();
      const { remoteStream } = await createPeerConnection(offerObject);
      dispatch(reduxAddRemoteStream(remoteStream));
    } catch (error) {
      toast.error("Something went wrong! Try again");
    }
  };
  //Create answer
  useEffect(() => {
    const createAnswers = async () => {
      const answer = await peerConnection.createAnswer({});
      if (answer) {
        peerConnection.setLocalDescription(answer);
      }
      socket.emit("newAnswer", { answer, offerer });
    };
    if (
      socket &&
      peerConnection &&
      offerObject?.offer !== "" &&
      offerer &&
      callee
    ) {
      createAnswers();
    }
  }, [peerConnection, socket, dispatch, offerObject.offer, offerer, callee]);

  //Reject incoming call!
  const rejectVideoCall = async () => {
    dispatch(reduxUpdateCallStatus({ cst: "videoScreen", value: false }));
    dispatch(reduxUpdateCallStatus({ cst: "haveOffer", value: false }));
    dispatch(reduxUpdateCallStatus({ cst: "receivingCall", value: false }));
    dispatch(reduxUpdateCallStatus({ cst: "offerer", value: "" }));
    dispatch(reduxUpdateCallStatus({ cst: "name", value: "" }));
    dispatch(reduxUpdateCallStatus({ cst: "picture", value: "" }));
    dispatch(reduxRemoveStreamPeer());

    socket.emit("callRejected", offerer);
  };
  //Stop...
  const stopVideoCall = async () => {
    try {
      peerConnection.close();
      peerConnection.onicecandidate = null;
      peerConnection.onaddstream = null;
      localStream.getVideoTracks().forEach((track) => {
        track.stop();
      });
      const to = offerer ? offerer : chattedUser?._id;
      if (!callRejected && callAccepted) {
        socket.emit("callEnded", to);
      }
      dispatch(reduxUpdateCallStatus({ cst: "videoScreen", value: false }));
      dispatch(reduxUpdateCallStatus({ cst: "callEnded", value: true }));
      dispatch(reduxUpdateCallStatus({ cst: "callRejected", value: false }));
      dispatch(reduxUpdateCallStatus({ cst: "caller", value: false }));
      dispatch(reduxUpdateCallStatus({ cst: "callee", value: false }));
      dispatch(reduxUpdateCallStatus({ cst: "cstOffer", value: false }));
      dispatch(reduxUpdateCallStatus({ cst: "offerer", value: "" }));
      dispatch(reduxUpdateCallStatus({ cst: "name", value: "" }));
      dispatch(reduxUpdateCallStatus({ cst: "picture", value: "" }));
      dispatch(reduxUpdateCallStatus({ cst: "current", value: "idle" }));
      dispatch(reduxUpdateCallStatus({ cst: "receivingCall", value: false }));
      dispatch(reduxUpdateCallStatus({ cst: "callAccepted", value: false }));
      dispatch(reduxUpdateCallStatus({ cst: "haveOffer", value: false }));
      dispatch(reduxRemoveStreamPeer());
    } catch (error) {
      toast.error("Something went wrong! Try again");
    }
  };

  const cancelVideoCall = () => {
    //peerConnection.close();
    peerConnection.onicecandidate = null;
    peerConnection.onaddstream = null;
    localStream.getVideoTracks().forEach((track) => {
      track.stop();
    });
    if (!callRejected && !callAccepted) {
      socket.emit("cancelCall", chattedUser?._id);
    }
    dispatch(reduxUpdateCallStatus({ cst: "videoScreen", value: false }));
    dispatch(reduxUpdateCallStatus({ cst: "caller", value: false }));
    dispatch(reduxUpdateCallStatus({ cst: "haveOffer", value: false }));
    dispatch(reduxRemoveStreamPeer());
  };

  //Set remote Description for Caller
  useEffect(() => {
    const setRemote = async () => {
      await peerConnection.setRemoteDescription(offerObject?.answer);
    };
    if (offerObject?.answer !== "" && peerConnection) {
      setRemote();
    }
  }, [offerObject.answer, peerConnection]);
  //Add Ice Candidates
  useEffect(() => {
    if (iceCandidates.length > 0 && peerConnection) {
      iceCandidates.forEach((candidate) => {
        peerConnection.addIceCandidate(candidate);
      });

      console.log("all candidates added");
    }
  }, [dispatch, iceCandidates, peerConnection]);

  //The magic Users connected:)
  useEffect(() => {
    if (current === "enabled") {
      inComingVideo.current.srcObject = remoteStream;
    }
  }, [current, remoteStream]);

  return (
    <>
      {showCreateStatus ? (
        <CreateStatus setShowCreateStatus={setShowCreateStatus} />
      ) : showViewStatus ? (
        <ViewStatus setShowViewStatus={setShowViewStatus} />
      ) : (
        <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden borderC">
          <div className="headBanner"></div>
          <div className="container h-[95%] pt-[19px] flex dark:bg-dark_bg_1">
            {showStatusInfo ? (
              <SideBarStatus
                setShowStatusInfo={setShowStatusInfo}
                setShowCreateStatus={setShowCreateStatus}
                setShowMyStatus={setShowMyStatus}
                setShowViewStatus={setShowViewStatus}
              />
            ) : (
              <SidebarLeft
                setShowStatusInfo={setShowStatusInfo}
                statusCondition={statusCondition}
                setStatusCondition={setStatusCondition}
              />
            )}
            {activeConversation ? (
              <ActiveChat
                startVideoCall={startVideoCall}
                setShowGroupInfo={setShowGroupInfo}
              />
            ) : (
              <WhatsappHome />
            )}
            {showMyStatus && <ViewMyStatus setShowMyStatus={setShowMyStatus} />}
          </div>
        </div>
      )}
      {/* Calls */}
      {videoScreen && (
        <Calls
          rejectVideoCall={rejectVideoCall}
          stopVideoCall={stopVideoCall}
          answerVideoCall={answerVideoCall}
          cancelVideoCall={cancelVideoCall}
          myVideo={myVideo}
          inComingVideo={inComingVideo}
        />
      )}
      {showGroupInfo && <GroupInfo setShowGroupInfo={setShowGroupInfo} />}
    </>
  );
};

export default Home;
