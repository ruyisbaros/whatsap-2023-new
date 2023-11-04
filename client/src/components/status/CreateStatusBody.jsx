import React from "react";
import { useSelector } from "react-redux";
import MediaAttach from "./MediaAttach";

const CreateStatusBody = ({ activeIndex }) => {
  const { statusFiles } = useSelector((store) => store.statuses);
  return (
    <div className="w-[90%] mx-auto h-[50%] flex flex-col items-center gap-2">
      {/* view body */}
      <div className="flex items-center justify-center h-[85%]">
        {statusFiles[activeIndex]?.type === "IMAGE" ? (
          <img
            src={statusFiles[activeIndex]?.data}
            alt={statusFiles[activeIndex]?.type}
            className="w-full h-full object-contain hView mt-12"
          />
        ) : statusFiles[activeIndex]?.type === "VIDEO" ? (
          <video
            src={statusFiles[activeIndex]?.data}
            controls
            className="w-full h-full object-contain hView mt-12"
          ></video>
        ) : (
          <></>
        )}
      </div>
      {/* add icon */}
      {statusFiles.length === 0 && (
        <div className="flex items-center justify-center">
          <MediaAttach />
        </div>
      )}
    </div>
  );
};

export default CreateStatusBody;
