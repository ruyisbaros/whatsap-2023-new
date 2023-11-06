import React, { useCallback, useEffect, useState } from "react";
import { ReturnIcon } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  reduxRESetViewedStatus,
  reduxSetViewedStatus,
  reduxUpdateActiveStatuses,
} from "../../redux/statusSlicer";
import { makeStatusSeen } from "../../SocketIOConnection";
import { dateHandler2 } from "../../utils/momentHandler";

const SideBarStatus = ({
  setShowStatusInfo,
  setShowCreateStatus,
  setShowMyStatus,
  setShowViewStatus,
}) => {
  const dispatch = useDispatch();
  const { loggedUser, onLineUsers } = useSelector((store) => store.currentUser);
  //const { targets } = useSelector((store) => store.messages);
  const { myStatus, activeStatuses } = useSelector((store) => store.statuses);
  const [seenStatuses, setSeenStatuses] = useState([]);
  const [notSeenStatuses, setNotSeenStatuses] = useState([]);

  useEffect(() => {
    dispatch(reduxRESetViewedStatus());
  }, [dispatch]);

  useEffect(() => {
    activeStatuses.forEach((sts) => {
      if (sts.seenBy.length > 0) {
        let temp = sts.seenBy.find((sn) => sn._id === loggedUser.id);
        if (!temp) {
          setNotSeenStatuses([...notSeenStatuses, sts]);
        } else {
          setSeenStatuses([...seenStatuses, sts]);
        }
      } else {
        setNotSeenStatuses([...notSeenStatuses, sts]);
      }
    });
  }, [activeStatuses, loggedUser]);

  useEffect(() => {
    if (notSeenStatuses.length > 0) {
      let tempNSeen = [...notSeenStatuses];
      tempNSeen = tempNSeen.filter((el, i) => tempNSeen.indexOf(el) === i);
      setNotSeenStatuses(tempNSeen);
    }
    if (seenStatuses.length > 0) {
      let tempSeen = [...seenStatuses];
      tempSeen = tempSeen.filter((el, i) => tempSeen.indexOf(el) === i);
      setSeenStatuses(tempSeen);
    }
  }, [notSeenStatuses, seenStatuses]);

  const handleView = (id) => {
    setShowViewStatus(true);
    dispatch(reduxSetViewedStatus(id));
  };
  const handleViewAndSee = async (id) => {
    setShowViewStatus(true);
    dispatch(reduxSetViewedStatus(id));
    const { data } = await axios.get(`/status/see/${id}`);
    dispatch(reduxUpdateActiveStatuses(data));

    makeStatusSeen(data.owner._id, loggedUser);
  };
  console.log(notSeenStatuses);
  // console.log(seenStatuses);
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
          {seenStatuses.length > 0 && (
            <div>
              <div className="uppercase text-[#008069] ml-8 mb-4">Viewed</div>
              <hr className="hr_status" />
              {seenStatuses.map((sts) => (
                <div key={sts._id} className="w-full pt-6 pl-4 flex gap-4">
                  <div className="w-[40px] h-[40px] relative">
                    <img
                      src={sts.owner.picture}
                      alt=""
                      className="w-[40px] h-[40px] rounded-full cursor-pointer transition-all duration-200 "
                      onClick={() => handleViewAndSee(sts._id)}
                    />
                  </div>
                  <div>
                    <h1 className="dark:text-white capitalize text-sm font-bold">
                      {sts.owner.name}
                    </h1>
                    <span className="text-xs dark:text-dark_svg_2">
                      {onLineUsers.find((usr) => usr.id === sts.owner?._id)
                        ? "online"
                        : "Last online " + dateHandler2(sts.owner?.lastSeen)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {notSeenStatuses.length > 0 && (
            <div>
              <div className="uppercase text-[#008069] ml-8 mb-4">Recent</div>
              <hr className="hr_status" />
              {notSeenStatuses.map((sts) => (
                <div key={sts._id} className="w-full pt-6 pl-4 flex gap-4">
                  <div className="w-[40px] h-[40px] relative">
                    <img
                      src={sts.owner.picture}
                      alt=""
                      className="w-[40px] h-[40px] rounded-full cursor-pointer transition-all duration-200 "
                      onClick={() => handleViewAndSee(sts._id)}
                    />
                  </div>
                  <div>
                    <h1 className="dark:text-white capitalize text-sm font-bold">
                      {sts.owner.name}
                    </h1>
                    <span className="text-xs dark:text-dark_svg_2">
                      {onLineUsers.find((usr) => usr.id === sts.owner?._id)
                        ? "online"
                        : "Last online " + dateHandler2(sts.owner?.lastSeen)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SideBarStatus;

/* 

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



*/
