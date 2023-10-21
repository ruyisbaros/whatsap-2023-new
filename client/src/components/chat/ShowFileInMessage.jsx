import React from "react";
import { TriangleIcon } from "../../assets/svg";
import moment from "moment";
import DownloadIcon from "../../assets/svg/Download";

const ShowFileInMessage = ({ file, me, msg }) => {
  return (
    <div
      className={`w-full flex mt-2 mb-2 space-x-3 max-w-lg p-1 ${
        me ? "ml-auto justify-end" : ""
      }`}
    >
      <div
        className={`relative rounded-lg
      ${me ? "bg-white border-[3px] border-green_3" : " text-dark_text_1"}`}
      >
        <div className=" h-full text-sm">
          {file.type === "IMAGE" ? (
            <img
              src={file.url}
              alt=""
              className={`rounded-lg cursor-pointer imgMessage`}
            />
          ) : file.type === "VIDEO" ? (
            <video
              src={file.url}
              controls
              className="rounded-lg cursor-pointer videoMessage"
            ></video>
          ) : (
            <div className="bg-green_4 p-2 ">
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-2">
                  <img
                    src={`/file/${file.type}.png`}
                    alt=""
                    className="w-8 object-contain"
                  />
                  <div className="flex flex-col gap-2">
                    <h1 className="text-white">
                      {file.public_id.split("/")[1]}
                    </h1>
                    <span className="text-white">
                      .{file.type} type of file
                    </span>
                  </div>
                  {/* Download */}
                  <a
                    href={file.url}
                    rel="noreferrer"
                    download
                    className="mb-4 ml-2"
                  >
                    <DownloadIcon />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        <span className="absolute right-1.5 bottom-1.5 text-xs text-dark_text_3 leading-none">
          {moment(msg.createdAt).format("HH:mm")}
        </span>
      </div>
    </div>
  );
};

export default ShowFileInMessage;
