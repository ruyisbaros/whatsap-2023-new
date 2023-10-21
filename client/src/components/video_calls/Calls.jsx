import React, { useEffect, useState } from "react";
import Ringing from "./Ringing";
import Header from "./Header";
import CallAreaInfo from "./CallAreaInfo";
import CallAreaActions from "./CallAreaActions";
import { useSelector } from "react-redux";

const Calls = ({
  inComingVideo,
  myVideo,
  answerCall,
  call,
  setCall,
  stream,
  handleEndCall,
}) => {
  const { chattedUser } = useSelector((store) => store.messages);
  const [showCallActions, setShowCallActions] = useState(false);
  const [toggleVide, setToggleVide] = useState(false);

  return (
    <>
      <div
        className={`fixed top-1/2 left-1/2 
  -translate-x-1/2 -translate-y-1/2 z30 w-[360px] h-[550px] rounded-2xl overflow-hidden callBg shadow-lg ${
    !call.videoScreen ? "hidden" : ""
  }`}
        onMouseOver={() => setShowCallActions(true)}
        onMouseLeave={() => setShowCallActions(false)}
      >
        <div>
          <div>
            <Header />
            <CallAreaInfo name={chattedUser?.name} call={call} />
            {showCallActions && (
              <CallAreaActions
                setCall={setCall}
                call={call}
                handleEndCall={handleEndCall}
              />
            )}
          </div>
          {/* Show videos */}
          <div>
            {/* In coming video */}
            {call.callAccepted && !call.callEnded ? (
              <div>
                <video
                  ref={inComingVideo}
                  playsInline
                  muted
                  autoPlay
                  className={toggleVide ? "SmallVideoCall" : "largeVideoCall"}
                  onClick={() => setToggleVide((prev) => !prev)}
                ></video>
              </div>
            ) : null}
            {/* My video */}
            {stream ? (
              <div>
                <video
                  ref={myVideo}
                  playsInline
                  muted
                  autoPlay
                  className={`${
                    toggleVide ? "largeVideoCall" : "SmallVideoCall"
                  } ${showCallActions ? "moveVideoCall" : ""}`}
                  onClick={() => setToggleVide((prev) => !prev)}
                ></video>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {call.receivingCall && !call.callAccepted && (
        <Ringing
          answerCall={answerCall}
          call={call}
          setCall={setCall}
          handleEndCall={handleEndCall}
        />
      )}
    </>
  );
};

export default Calls;
