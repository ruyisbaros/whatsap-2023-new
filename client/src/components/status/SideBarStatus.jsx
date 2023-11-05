import React, { useCallback, useEffect, useState } from "react";
import { ReturnIcon } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "../../axios";
import { reduxSetMyStatus } from "../../redux/statusSlicer";
import { toast } from "react-toastify";

const SideBarStatus = ({
  setShowStatusInfo,
  setShowCreateStatus,
  setShowMyStatus,
  statusCondition,
  setStatusCondition,
  setViewedStatusId,
}) => {
  const dispatch = useDispatch();
  const { loggedUser } = useSelector((store) => store.currentUser);
  const { myStatus, activeStatuses } = useSelector((store) => store.statuses);
  const [statusesSeen, setStatusesSeen] = useState([]);
  const [statusesNotSeen, setStatusesNotSeen] = useState([]);
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

  useEffect(() => {
    activeStatuses.forEach((sts) => {
      if (sts.seenBy.length > 0) {
        sts.seenBy.forEach((snB) => {
          if (snB._id === loggedUser.id) {
            setStatusesSeen((prev) => [...prev, snB]);
          }
        });
      }
    });
  }, [activeStatuses, loggedUser]);

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
      <div className="status_currentUser w-full h-[15%] pl-4 pt-6">
        <div className="status_currentUser-child flex items-center gap-4 relative">
          <img
            src={loggedUser.picture}
            alt=""
            className="w-[40px] h-[40px] rounded-full cursor-pointer transition-all duration-200"
          />
          {myStatus ? (
            <span
              className="text-gray-400 cursor-pointer relative z-40"
              onClick={() => setShowMyStatus(true)}
            >
              View Your Status
            </span>
          ) : (
            <span
              className="text-gray-400 cursor-pointer relative z-40"
              onClick={() => setShowCreateStatus(true)}
            >
              Create a Story!
            </span>
          )}
        </div>
      </div>
      {activeStatuses.length ? (
        <div>
          {activeStatuses.map((sts, idx) => (
            <div key={sts._id}>
              <div className="uppercase text-[#008069] ml-8 mb-4">Viewed</div>
              <hr className="hr_status" />
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SideBarStatus;
