import React, { useEffect, useState } from "react";
import { CloseIcon } from "../../assets/svg";
import { makeCapital } from "../../utils/helpers";
import { useSelector } from "react-redux";

const ChatReply = ({
  replyMessageContent,
  setReplyMessage,
  setClickedCount,
  setReplyTriggered,
}) => {
  const { loggedUser } = useSelector((store) => store.currentUser);
  const [me, setMe] = useState(false);
  useEffect(() => {
    setMe(replyMessageContent[0]?.sender?._id === loggedUser.id);
  }, [replyMessageContent, loggedUser]);
  return (
    <div
      className="dark:bg-dark_bg_2 h-[70px] w-full flex items-center absolute bottom-[60px]
   reply-main"
    >
      <div className="w-full flex items-center gap-x-2 reply-content">
        {/* Icons */}
        <ul className="reply-list">
          <li className="list-none"></li>
        </ul>

        <div
          className={`w-full h-[65px] reply-box ${
            me ? "reply-box_me" : "reply-box_you"
          }`}
        >
          <p
            className={`reply-name ${me ? "reply-name_me" : "reply-name_you"}`}
          >
            {me ? "You" : makeCapital(replyMessageContent[0]?.sender?.name)}
          </p>
          <p className="reply-message">{replyMessageContent[0]?.message}</p>
        </div>
        {/* Send */}
        <div className="reply-btn">
          <button
            className="btn "
            type="submit"
            onClick={() => {
              setReplyMessage(false);
              setReplyTriggered(true);
              setClickedCount(0);
            }}
          >
            <CloseIcon className="dark:fill-dark_svg_1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatReply;
