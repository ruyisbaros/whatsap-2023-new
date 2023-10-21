import moment from "moment/moment";
import React from "react";
import { TriangleIcon } from "../../assets/svg";
/* Image of sender missing */
const SingleMessage = ({ msg, me }) => {
  return (
    <div
      className={`w-full flex mt-2 mb-2 space-x-3 max-w-lg ${
        me ? "ml-auto justify-end" : ""
      }`}
    >
      <div
        className={`relative  p-2 rounded-lg
      ${me ? "bg-green_5 text-black" : "dark:bg-dark_bg_5 text-dark_text_1"}`}
      >
        <p className="float-left h-full text-sm pb-4 pr-8">{msg.message}</p>
        <span className="absolute right-1.5 bottom-1.5 text-xs text-dark_text_3 leading-none">
          {moment(msg.createdAt).format("HH:mm")}
        </span>
        {/* Triangle */}
        <span className="">
          <TriangleIcon
            className={
              me
                ? "fill-dark_bg_7 rotate-[60deg] absolute top-[-5px] -right-1.5"
                : "dark:fill-dark_bg_5 rotate-[60deg] absolute top-[-5px] -left-1.5"
            }
          />
        </span>
      </div>
    </div>
  );
};

export default SingleMessage;
