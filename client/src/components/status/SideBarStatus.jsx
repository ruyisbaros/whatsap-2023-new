import React, { useCallback, useEffect, useState } from "react";
import { ReturnIcon } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "../../axios";
import { reduxSetMyStatus } from "../../redux/statusSlicer";
import { toast } from "react-toastify";

const SideBarStatus = ({ setShowStatusInfo, setShowCreateStatus }) => {
  const dispatch = useDispatch();
  const { loggedUser } = useSelector((store) => store.currentUser);
  const [showAddIcon, setShowAddIcon] = useState(false);

  const fetchMyStatus = useCallback(async () => {
    try {
      const { data } = await axios.get("/status/my_status");

      console.log(data);
      dispatch(reduxSetMyStatus(data));
    } catch (error) {
      toast.error(error.response.data?.message);
    }
  }, [dispatch]);
  useEffect(() => {
    fetchMyStatus();
  }, [fetchMyStatus]);
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
        <div
          className="status_currentUser-child flex gap-4 relative"
          onMouseOver={() => setShowAddIcon(true)}
          onMouseLeave={() => setShowAddIcon(false)}
        >
          <img
            src={loggedUser.picture}
            alt=""
            className={`w-[40px] h-[40px] rounded-full cursor-pointer transition-all duration-200 ${
              showAddIcon ? "border-[2px] border-[#008069]" : ""
            }`}
            onClick={() => setShowCreateStatus(true)}
          />
          <span className="text-gray-400">My Status</span>
          {showAddIcon && (
            <span className="addIcon text-[25px] font-bold">
              <AiOutlinePlus color="#008069" />
            </span>
          )}
        </div>
        <div className="uppercase text-[#008069] ml-8">Viewed</div>
      </div>
      <hr className="hr_status" />
      <div className="status_actives"></div>
    </div>
  );
};

export default SideBarStatus;
