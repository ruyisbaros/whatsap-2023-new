import React, { useEffect, useState } from "react";
import Ringing from "./Ringing";
import Header from "./Header";
import CallAreaInfo from "./CallAreaInfo";
import CallAreaActions from "./CallAreaActions";
import { useSelector } from "react-redux";

const Calls = ({
  inComingVideo,
  myVideo,
  stopVideoCall,
  answerVideoCall,
  rejectVideoCall,
  cancelVideoCall,
}) => {
  const { chattedUser } = useSelector((store) => store.messages);
  const { callEnded, callAccepted, receivingCall, current } = useSelector(
    (store) => store.callStatuses
  );
  const { localStream } = useSelector((store) => store.streams);
  const [showCallActions, setShowCallActions] = useState(false);
  const [toggleVideo, setToggleVideo] = useState(false);

  return (
    <>
      <div
        className={`fixed top-1/2 left-1/2 
  -translate-x-1/2 -translate-y-1/2 z30 w-[360px] h-[550px] rounded-2xl overflow-hidden callBg shadow-lg `}
        onMouseOver={() => setShowCallActions(true)}
        onMouseLeave={() => setShowCallActions(false)}
      >
        <div>
          <div>
            <Header />
            <CallAreaInfo name={chattedUser?.name} />
            {showCallActions && (
              <CallAreaActions
                stopVideoCall={stopVideoCall}
                cancelVideoCall={cancelVideoCall}
              />
            )}
          </div>
          {/* Show videos */}
          <div>
            {/* In coming video */}
            {callAccepted && !callEnded ? (
              <div>
                <video
                  ref={inComingVideo}
                  playsInline
                  muted
                  autoPlay
                  className={`largeVideoCall`}
                  onClick={() => setToggleVideo((prev) => !prev)}
                ></video>
              </div>
            ) : null}
            {/* My video */}
            {localStream ? (
              <div>
                <video
                  ref={myVideo}
                  playsInline
                  muted
                  autoPlay
                  className={`${
                    current === "enabled"
                      ? "SmallVideoCall"
                      : current === "idle"
                      ? "largeVideoCall"
                      : ""
                  } ${showCallActions ? "moveVideoCall" : ""}`}
                  onClick={() => setToggleVideo((prev) => !prev)}
                ></video>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {receivingCall && !callAccepted && (
        <Ringing
          rejectVideoCall={rejectVideoCall}
          answerVideoCall={answerVideoCall}
        />
      )}
    </>
  );
};

export default Calls;
