import React from "react";
import { useDispatch, useSelector } from "react-redux";

const PreviewBody = ({ activeIndex }) => {
  const dispatch = useDispatch();
  const { files } = useSelector((store) => store.messages);
  return (
    <div className="w-full max-w-[60%]">
      <div className="flex items-center justify-center">
        {files[activeIndex]?.type === "IMAGE" ? (
          <img
            src={files[activeIndex]?.data}
            alt={files[activeIndex]?.type}
            className="max-w-[80%] object-contain hView mb-3"
          />
        ) : files[activeIndex]?.type === "VIDEO" ? (
          <video
            src={files[activeIndex]?.data}
            controls
            className="max-w-[80%] object-contain hView mb-3"
          ></video>
        ) : (
          <div className="hView min-w-full flex flex-col items-center justify-center">
            <img
              src={`/file/${files[activeIndex]?.type}.png`}
              alt={files[activeIndex]?.type}
              className="w-[20%] object-contain"
            />
            <h1 className="dark:text-dark_text_2 text-2xl">
              No preview available!
            </h1>
            <span className="dark:text-dark_text_2">
              {Math.floor(files[activeIndex]?.file?.size / 1000)} KB -{" "}
              {files[activeIndex]?.type}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewBody;
