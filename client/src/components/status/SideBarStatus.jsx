import React, { useCallback, useEffect, useState } from "react";
import { ReturnIcon } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import {
  reduxSetMyStatus,
  reduxSetViewedStatus,
} from "../../redux/statusSlicer";
import { toast } from "react-toastify";
import { makeStatusSeen } from "../../SocketIOConnection";

const SideBarStatus = ({
  setShowStatusInfo,
  setShowCreateStatus,
  setShowMyStatus,
  setShowViewStatus,
}) => {
  const dispatch = useDispatch();
  const { loggedUser } = useSelector((store) => store.currentUser);
  const { myStatus, activeStatuses, viewedStatus } = useSelector(
    (store) => store.statuses
  );

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

  const handleView = (id) => {
    setShowViewStatus(true);
    dispatch(reduxSetViewedStatus(id));
  };
  const handleViewAndSee = async (id) => {
    setShowViewStatus(true);
    dispatch(reduxSetViewedStatus(id));
    const { data } = await axios.get(`/status/seen/${id}`);
    //Emit view status
    let timer = setTimeout(() => {
      makeStatusSeen(viewedStatus?.targets, id, loggedUser);
    }, 1000);

    return () => clearTimeout(timer);
  };

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
        activeStatuses.filter((st) => st.isSeen === false).length > 0 ? (
          <div>
            <div className="uppercase text-[#008069] ml-8 mb-4">Recent</div>
            <hr className="hr_status" />
            {activeStatuses
              .filter((st) => st.isSeen === false)
              .map((sts, idx) => (
                <div key={sts._id} className="w-full pt-6 pl-4 flex gap-4">
                  <img
                    src={sts.owner.picture}
                    alt=""
                    className="w-[40px] h-[40px] rounded-full cursor-pointer transition-all duration-200"
                    onClick={() => handleViewAndSee(sts._id)}
                  />
                  <span className="text-gray-400">{sts.text}</span>
                </div>
              ))}
          </div>
        ) : activeStatuses.filter((st) => st.isSeen === true).length > 0 ? (
          <div>
            <div className="uppercase text-[#008069] ml-8 mb-4">Viewed</div>
            <hr className="hr_status" />
            {activeStatuses
              .filter((st) => st.isSeen === true)
              .map((sts, idx) => (
                <div key={sts._id} className="w-full pt-6 pl-4 flex gap-4">
                  <img
                    src={sts.owner.picture}
                    alt=""
                    className="w-[40px] h-[40px] rounded-full cursor-pointer transition-all duration-200"
                    onClick={() => handleView(sts._id)}
                  />
                  <span className="text-gray-400">{sts.text}</span>
                </div>
              ))}
          </div>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default SideBarStatus;
