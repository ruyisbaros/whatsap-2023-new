import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SearchLargeIcon from "../../assets/svg/SearchLarge";
import DotsIcon from "../../assets/svg/Dots";
import { dateHandler2 } from "../../utils/momentHandler";
import { VideoCallIcon } from "../../assets/svg/VideoCall";
import { DialIcon } from "../../assets/svg/Dial";

const ChatHeader = ({ startVideoCall, setShowGroupInfo }) => {
  const { activeConversation, chattedUser } = useSelector(
    (store) => store.messages
  );
  const { loggedUser, onLineUsers } = useSelector((store) => store.currentUser);

  const [ME, setME] = useState("");
  const [YOU, setYOU] = useState("");

  const findMeAndYou = useCallback(() => {
    const me = activeConversation.users.find(
      (usr) => usr._id === loggedUser?.id
    );
    setME(me);
    const you = activeConversation.users.find(
      (usr) => usr._id !== loggedUser?.id
    );
    setYOU(you);
  }, [loggedUser, activeConversation]);
  useEffect(() => {
    if (!activeConversation.isGroup) {
      findMeAndYou();
    }
  }, [findMeAndYou, activeConversation]);
  return (
    <div className="createGroupAnimation h-[59px] dark:bg-dark_bg_2 p16 py-3">
      <div className="w-full h-full flex justify-between items-center">
        {/* Left site foto */}
        <div className="flex items-center gap-x-4">
          <button className="btn">
            <img
              src={
                activeConversation.isGroup
                  ? activeConversation.picture
                  : YOU.picture
              }
              alt="active user"
              className="w-full h-full rounded-full object-cover"
            />
          </button>
          <div className="flex flex-col">
            <h1 className="dark:text-white capitalize text-sm font-bold">
              {activeConversation.isGroup ? activeConversation.name : YOU.name}
            </h1>
            {!activeConversation.isGroup ? (
              <span className="text-xs dark:text-dark_svg_2">
                {onLineUsers.find((usr) => usr.id === chattedUser?._id)
                  ? "online"
                  : "Last online " + dateHandler2(chattedUser?.lastSeen)}
              </span>
            ) : (
              <div
                className="flex grpInfo"
                data-info="Tab here for group info"
                onClick={() => setShowGroupInfo(true)}
              >
                {activeConversation.users.map((usr, i) => (
                  <span
                    key={usr._id}
                    className="flex capitalize  text-xs dark:text-dark_svg_2 pr-1 cursor-pointer "
                  >
                    {usr.name === loggedUser.name ? "You" : usr.name}
                    {i < activeConversation.users.length - 1 ? `,  ` : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Right side icons */}
        <ul className="flex items-center gap-x-2.5">
          {onLineUsers.find((usr) => usr.id === chattedUser?._id) ? (
            <li>
              <button className="btn" onClick={startVideoCall}>
                <VideoCallIcon />
              </button>
            </li>
          ) : null}
          {onLineUsers.find((usr) => usr.id === chattedUser?._id) ? (
            <li>
              <button className="btn rotate-[135deg]">
                <DialIcon className="fill-blue-500 scale-[80%] w-6" />
              </button>
            </li>
          ) : null}
          <li>
            <button className="btn">
              <SearchLargeIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
          <li>
            <button className="btn">
              <DotsIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatHeader;
