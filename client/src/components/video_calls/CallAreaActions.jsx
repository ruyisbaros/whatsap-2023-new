import React from "react";
import { ArrowIcon, MuteIcon } from "../../assets/svg";
import { SpeakerIcon } from "./../../assets/svg/SpeakerIcon";
import { VideoDialIcon } from "./../../assets/svg/VideoDeal";
import { DialIcon } from "./../../assets/svg/Dial";
import { useDispatch, useSelector } from "react-redux";

const CallAreaActions = () => {
  const dispatch = useDispatch();
  const { chattedUser } = useSelector((store) => store.messages);
  const handleEndCall = () => {
    //endCallUserSocket(chattedUser._id);
    //dispatch(reduxShowVideoFalse());
  };
  return (
    <div className="absolute bottom-0 h-22 w-full z40 px-1">
      <div className="relative bg-[#222] px-4 pt-6 pb-12 rounded-xl">
        <button className="-rotate-90 scale-y-[300%] absolute top-1 left-1/2">
          <ArrowIcon className="fill-dark_svg_2" />
        </button>
        <ul className="flex items-center justify-between">
          <li>
            <button className="btn_secondary">
              <SpeakerIcon className="fill-white w-6" />
            </button>
          </li>
          <li>
            <button className="btn_secondary bg-green_1">
              <VideoDialIcon className="fill-white w-14 mt-2.5" />
            </button>
          </li>
          <li>
            <button className="btn_secondary">
              <MuteIcon className="fill-white w-5" />
            </button>
          </li>
          <li onClick={handleEndCall}>
            <button className="btn_secondary bg-red-600 rotate-[135deg]">
              <DialIcon className="fill-white w-6" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CallAreaActions;
