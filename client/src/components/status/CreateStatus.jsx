import React, { useState } from "react";
import { ReturnIcon } from "../../assets/svg";
import CreateStatusBody from "./CreateStatusBody";
import CreateStatusText from "./CreateStatusText";
import CreateStatusFooter from "./CreateStatusFooter";

const CreateStatus = ({ setShowCreateStatus }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [statusText, setStatusText] = useState("");
  return (
    <div className="status-full w-full h-screen dark:bg-dark_bg_1 overflow-hidden">
      <div className="close_status">
        <button
          className="btn w-6 h-6"
          onClick={() => setShowCreateStatus(false)}
        >
          <ReturnIcon className="fill-white " />
        </button>
        <span className="text-white font-bold text-[20px]">
          Create Your Status
        </span>
      </div>
      <div className="w-full h-full mt-[60px] flex flex-col gap-1 items-center">
        <CreateStatusBody activeIndex={activeIndex} />
        <CreateStatusText
          setStatusText={setStatusText}
          statusText={statusText}
        />
        <CreateStatusFooter
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setStatusText={setStatusText}
          statusText={statusText}
          setShowCreateStatus={setShowCreateStatus}
        />
      </div>
    </div>
  );
};

export default CreateStatus;
