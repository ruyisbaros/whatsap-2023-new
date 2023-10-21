import React from "react";
import { useSelector } from "react-redux";

const CallAreaInfo = ({ name }) => {
  const { callAccepted } = useSelector((store) => store.callStatuses);
  return (
    <div className="absolute top-12 z40 w-full p-1">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-y-1">
          <h1 className="text-white text-lg capitalize">
            <b>{name}</b>
          </h1>
          {!callAccepted && (
            <span className="text-dark_text_1 text-xs ringAnim">
              Ringing...
            </span>
          )}
          {/*  <span className="text-dark_text_2 text-xs ">20:25</span> */}
        </div>
      </div>
    </div>
  );
};

export default CallAreaInfo;
