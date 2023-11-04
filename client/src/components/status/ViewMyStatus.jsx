import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { AiOutlineCloseCircle } from "react-icons/ai";

const ViewMyStatus = ({ setShowMyStatus }) => {
  return (
    <div className="my-status w-[70%] h-full dark:bg-dark_bg_1 overflow-hidden">
      <div className="close_status h-[60px]">
        <button
          className="btn w-6 h-6 ml-5"
          onClick={() => setShowMyStatus(false)}
        >
          <AiOutlineCloseCircle color="red" size={25} />
        </button>
        <span className="text-white font-bold text-[20px]">Your Status</span>
      </div>
      <div className="w-full h-full  flex items-center justify-center">
        <div className="relative w-[70%] h-[60%] ">
          <button className="myStatus-left">
            <FaChevronLeft color="#222" size={35} />
          </button>
          <div className="w-full h-full bg-red-700">hello</div>
          <button className="myStatus-right">
            <FaChevronRight color="#222" size={35} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMyStatus;
