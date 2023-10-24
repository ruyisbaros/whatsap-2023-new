import React from "react";
import CloseIcon from "./../../assets/svg/Close";

const GroupInfo = ({ setShowGroupInfo }) => {
  return (
    <div className="group-info h-[95%] pt-[19px] flex dark:bg-dark_bg_1">
      <div className="relative w-full h-full">
        <span
          className="absolute right-1 -top-4 z-40 cursor-pointer "
          onClick={() => setShowGroupInfo(false)}
        >
          <CloseIcon className="dark:fill-red-600" />
        </span>
      </div>
    </div>
  );
};

export default GroupInfo;
