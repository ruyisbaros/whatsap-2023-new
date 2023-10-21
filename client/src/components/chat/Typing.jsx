import React from "react";
import { TriangleIcon } from "../../assets/svg";
import { BeatLoader } from "react-spinners";

const Typing = () => {
  return (
    <div className={`w-full flex mt-2 mb-2 space-x-3  `}>
      <div
        className={`relative  rounded-lg p-2 dark:bg-dark_bg_5
      `}
      >
        <div className=" h-full text-sm p-1 flex items-center justify-center">
          <BeatLoader color="#fff" size={10} />
        </div>
      </div>
    </div>
  );
};

export default Typing;
