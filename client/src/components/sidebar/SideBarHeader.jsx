import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CommunityIcon from "../../assets/svg/Community";
import StoryIcon from "../../assets/svg/Story";
import ChatIcon from "../../assets/svg/Chat";
import DotsIcon from "../../assets/svg/Dots";
import { LuDot } from "react-icons/lu";
import Menu from "./Menu";
import { useOutsideClick } from "../../utils/helpers";
import CreateGroup from "../groupChat/CreateGroup";

const SideBarHeader = ({
  setShowStatusInfo,
  statusCondition,
  setStatusCondition,
}) => {
  const menuRef = useRef(null);
  const { loggedUser } = useSelector((store) => store.currentUser);
  const { activeStatuses } = useSelector((store) => store.statuses);
  const [showMenu, setShowMenu] = useState(false);
  const [showGroupMenu, setShowGroupMenu] = useState(false);

  useOutsideClick(menuRef, () => {
    setShowMenu(false);
  });

  useEffect(() => {
    if (activeStatuses.length > 0) {
      activeStatuses.forEach((st) => {
        st.targets.forEach((trg) => {
          if (trg._id === loggedUser.id) {
            setStatusCondition((prev) => ({ ...prev, available: true }));
          }
        });
        if (st.seenBy.length > 0) {
          st.seenBy.forEach((seen) => {
            if (seen._id === loggedUser.id) {
              setStatusCondition((prev) => ({ ...prev, seen: true }));
            }
          });
        }
      });
    }
  }, [activeStatuses, loggedUser]);
  //console.log(isForMeStatusAvailable, isStatusSeenByMe);
  return (
    <>
      <div className="h-[59px] dark:bg-dark_bg_2 flex items-center p16">
        <div className="w-full flex items-center justify-between ">
          <button className="btn">
            <img
              className="rounded-full w-full h-full object-cover"
              src={loggedUser?.picture}
              alt="user profile"
            />
          </button>
          <ul className="flex items-center gap-x-2 ">
            <li>
              <button className="btn" onClick={() => setShowGroupMenu(true)}>
                <CommunityIcon className="dark:fill-dark_svg_1" />
              </button>
            </li>
            <li className="story-icon">
              <button
                className="btn relative"
                onClick={() => setShowStatusInfo(true)}
              >
                <StoryIcon className="dark:fill-dark_svg_1" />
                {statusCondition.available && !statusCondition.seen && (
                  <span>
                    <LuDot color="#008069" size={50} />
                  </span>
                )}
              </button>
            </li>
            <li>
              <button className="btn">
                <ChatIcon className="dark:fill-dark_svg_1" />
              </button>
            </li>
            <li className="relative">
              <button
                className={`btn ${showMenu ? "bg-dark_hover_1" : ""}`}
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <DotsIcon className="dark:fill-dark_svg_1" />
              </button>
              {showMenu && (
                <Menu
                  menuRef={menuRef}
                  setShowGroupMenu={setShowGroupMenu}
                  setShowMenu={setShowMenu}
                />
              )}
            </li>
          </ul>
        </div>
      </div>

      {showGroupMenu && <CreateGroup setShowGroupMenu={setShowGroupMenu} />}
    </>
  );
};

export default SideBarHeader;
