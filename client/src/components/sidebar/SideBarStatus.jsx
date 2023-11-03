import React from "react";
import { ReturnIcon } from "../../assets/svg";
import { useSelector } from "react-redux";

const SideBarStatus = ({ setShowStatusInfo }) => {
  const { loggedUser } = useSelector((store) => store.currentUser);
  return (
    <div className="flex0030 w-[30%] h-full overflow-hidden select-none borderC">
      <div className="status_banner">
        <button
          className="btn w-6 h-6"
          onClick={() => setShowStatusInfo(false)}
        >
          <ReturnIcon className="fill-white " />
        </button>
        <span className="text-white font-bold text-[20px] ml-[2rem]">
          Status
        </span>
      </div>
      <div className="status_currentUser w-full h-[25%] flex flex-col justify-around pl-4">
        <div className="flex gap-4">
          <img
            src={loggedUser.picture}
            alt=""
            className="w-[40px] h-[40px] rounded-full cursor-pointer"
          />
          <span className="text-gray-400">My Status</span>
        </div>
        <div className="uppercase text-[#008069] ml-8">Viewed</div>
      </div>
      <hr className="hr_status" />
      <div className="status_actives"></div>
    </div>
  );
};

export default SideBarStatus;
