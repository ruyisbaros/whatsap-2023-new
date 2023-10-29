import React from "react";
import { BeatLoader } from "react-spinners";

const Typing = ({ typeRef }) => {
  return (
    <div ref={typeRef} className={`w-full flex mt-2 mb-1 space-x-3  `}>
      <div
        className={`relative rounded-lg p-2 dark:bg-dark_bg_5
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
