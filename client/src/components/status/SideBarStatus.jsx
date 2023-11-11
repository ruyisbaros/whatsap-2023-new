import React, { useEffect, useRef, useState } from "react";
import { ReturnIcon } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  reduxDeleteMyStatus,
  reduxRESetViewedStatus,
  reduxSetViewedStatus,
  reduxUpdateActiveStatuses,
} from "../../redux/statusSlicer";
import { deleteStatus, makeStatusSeen } from "../../SocketIOConnection";
import { dateHandler2 } from "../../utils/momentHandler";
import SeenBy from "./SeenBy";
import StatusCtrlBox from "./StatusCtrlBox";
import { useOutsideClick } from "../../utils/helpers";

const SideBarStatus = ({
  setShowStatusInfo,
  setShowCreateStatus,
  setShowMyStatus,
  setShowViewStatus,
}) => {
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const { loggedUser, onLineUsers } = useSelector((store) => store.currentUser);
  //const { targets } = useSelector((store) => store.messages);
  const { myStatus, activeStatuses } = useSelector((store) => store.statuses);
  const [seenStatuses, setSeenStatuses] = useState([]);
  const [notSeenStatuses, setNotSeenStatuses] = useState([]);
  const [showSeeUsers, setShowSeeUsers] = useState(false);
  const [showStatusCtrlBox, setShowStatusCtrlBox] = useState(false);

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
      let tempNSeen = [
        ...notSeenStatuses
          .reduce((ac, val) => ac.set(val._id, val), new Map())
          .values(),
      ];
      setNotSeenStatuses(tempNSeen);
    }
    if (seenStatuses.length > 0) {
      let tempSeen = [
        ...seenStatuses
          .reduce((ac, val) => ac.set(val._id, val), new Map())
          .values(),
      ];
      console.log(tempSeen);
      setSeenStatuses(tempSeen);
    }
  }, []);

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

  useOutsideClick(menuRef, () => {
    setShowStatusCtrlBox(false);
  });

  const handleDeleteStory = async () => {
    const { data } = await axios.get(`/status/delete/${myStatus._id}`);
    if (data === "deleted") {
      dispatch(reduxDeleteMyStatus());

      //Emit deleted status
      deleteStatus(myStatus?.targets, myStatus?._id);
    }
  };

  return (
    <div className="flex0040 w-[40%] lg:flex0030 lg:w-[30%] h-full overflow-hidden select-none borderC relative">
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
      <div className="status_currentUser w-full h-[15%] pl-4 pt-6 pr-4">
        <div className="w-full flex items-center gap-4 relative">
          <div className="w-full flex items-center gap-4">
            <img
              src={loggedUser.picture}
              alt=""
              className="w-[40px] h-[40px] rounded-full cursor-pointer transition-all duration-200"
            />
            {myStatus ? (
              <>
                <span
                  className="text-gray-400 cursor-pointer relative z-40"
                  onClick={() => setShowMyStatus(true)}
                >
                  View Your Status
                </span>
              </>
            ) : (
              <span
                className="text-gray-400 cursor-pointer relative z-40"
                onClick={() => setShowCreateStatus(true)}
              >
                Create a Story!
              </span>
            )}
          </div>
          {myStatus && (
            <span
              className="cursor-pointer"
              onClick={() => setShowStatusCtrlBox((prev) => !prev)}
            >
              <BsThreeDotsVertical color="lightgray" size={20} />
            </span>
          )}
          {showStatusCtrlBox && (
            <StatusCtrlBox
              setShowStatusCtrlBox={setShowStatusCtrlBox}
              setShowSeeUsers={setShowSeeUsers}
              handleDeleteStory={handleDeleteStory}
              menuRef={menuRef}
            />
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
                  <div className="w-[40px] h-[40px] relative img-status-main">
                    <img
                      src={sts.owner.picture}
                      alt=""
                      className="w-full h-full rounded-full cursor-pointer"
                      onClick={() => handleView(sts._id)}
                      style={{ borderColor: "gray" }}
                    />
                    {/* <div className="status-img"></div> */}
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
                      className="w-full h-full rounded-full cursor-pointer status-img"
                      onClick={() => handleViewAndSee(sts._id)}
                      style={{ borderColor: "#008069" }}
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
      {showSeeUsers && (
        <div className="see-users-main">
          <header>
            <button
              className="btn w-6 h-6"
              onClick={() => setShowSeeUsers(false)}
            >
              <ReturnIcon className="fill-white " />
            </button>
            <span className="dark:text-white">Seen By</span>
          </header>
          <div className="see-users-content">
            {myStatus.seenBy.length > 0 ? (
              <ul>
                {myStatus.seenBy.map((res) => (
                  <SeenBy key={res._id} contact={res} />
                ))}
              </ul>
            ) : (
              <p className="w-full h-[40px] mt-4 dark:text-gray-300 flex items-center justify-center">
                Your story not seen by anybody yet!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBarStatus;
