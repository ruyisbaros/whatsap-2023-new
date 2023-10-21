import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidVolumeMute } from "react-icons/bi";
import { GoUnmute } from "react-icons/go";
import { TiCancel } from "react-icons/ti";
import { ValidIcon } from "../../assets/svg/Valid";
import sendCall from "../../assets/audio/ringtone.mp3";

const Ringing = ({ call, setCall, handleEndCall }) => {
  const dispatch = useDispatch();
  //const { loggedUser } = useSelector((store) => store.currentUser);
  //const { callingUser } = useSelector((store) => store.videos);
  const [ringTimer, setRingTimer] = useState(0);

  let interval;
  const handleTimer = () => {
    interval = setInterval(() => {
      setRingTimer((prev) => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    if (ringTimer <= 20) {
      //setCall((prev) => ({ ...prev, getCall: true }));
      handleTimer();
    } else if (ringTimer > 20) {
      console.log("Inside else block");
      setCall((prev) => ({ ...prev, receivingCall: false }));
    }
    return () => {
      clearInterval(interval);
    };
  }, [ringTimer, dispatch]);

  return (
    <div
      className=" dark:bg-dark_bg_1 rounded-lg fixed top-1/2 left-1/2 
  -translate-x-1/2 -translate-y-1/2 shadow-lg z-50"
    >
      {/* Container */}
      <div className="p-4 flex items-center justify-between gap-x-8">
        {/* Call infos */}
        <div className="flex items-center gap-x-2 ">
          <img
            src={call?.picture}
            alt="called user"
            className="w-20 h-20 rounded-full "
          />
          <div>
            <h1 className="dark:text-white">
              <b>{call?.name}</b>
            </h1>
            <span className="dark:text-dark_text_2">Whatsapp video...</span>
          </div>
        </div>
        {/* Call Actions */}
        <ul className="flex items-center gap-x-3 ">
          <li
            onClick={() =>
              setCall((prev) => ({ ...prev, ringingMuted: !prev.ringingMuted }))
            }
          >
            <button className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500">
              {call.ringingMuted ? (
                <BiSolidVolumeMute size={25} color="white" />
              ) : (
                <GoUnmute size={25} color="white" />
              )}
            </button>
          </li>

          <li onClick={handleEndCall}>
            <button className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500">
              <TiCancel size={25} color="white" />
            </button>
          </li>
          <li>
            <button className="w-8 h-8 rounded-full flex items-center justify-center bg-green_1">
              <ValidIcon className="w-7 fill-white mt-2" />
            </button>
          </li>
        </ul>
      </div>
      {/* Ring Voice */}
      <audio
        src={sendCall}
        autoPlay
        muted={call.ringingMuted ? true : false}
        loop
      ></audio>
    </div>
  );
};

export default Ringing;
