import React from "react";
import { ReturnIcon } from "../../assets/svg";

const CreateStatus = ({ setShowCreateStatus }) => {
  return (
    <div className="status-full w-full h-screen dark:bg-dark_bg_1 overflow-hidden">
      <div className="close_status">
        <button
          className="btn w-6 h-6"
          onClick={() => setShowCreateStatus(false)}
        >
          <ReturnIcon className="fill-white " />
        </button>
      </div>
    </div>
  );
};

export default CreateStatus;
