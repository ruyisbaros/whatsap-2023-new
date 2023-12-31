import moment from "moment/moment";
import React, { useState, useEffect, useRef } from "react";
import { TriangleIcon } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { makeCapital } from "./../../utils/helpers";
import angry from "../../assets/emojies/angry.png";
import dede from "../../assets/emojies/dede.png";
import eyeHeart from "../../assets/emojies/eyeHeart.png";
import haha from "../../assets/emojies/haha.png";
import heart from "../../assets/emojies/heart.png";
import shy from "../../assets/emojies/shy.png";
import simarik from "../../assets/emojies/simarik.png";
import { toast } from "react-toastify";
import axios from "../../axios";
import { BsStarFill } from "react-icons/bs";
import { MdNotInterested } from "react-icons/md";
import { reduxAddUpdateMessage } from "../../redux/chatSlice";
import {
  groupAddMessageEmoji,
  userAddMessageEmoji,
} from "../../SocketIOConnection";

let emojies = [
  {
    id: "1",
    image: haha,
  },
  {
    id: "2",
    image: shy,
  },
  {
    id: "3",
    image: simarik,
  },
  {
    id: "4",
    image: eyeHeart,
  },
  {
    id: "5",
    image: dede,
  },
  {
    id: "6",
    image: heart,
  },
  {
    id: "7",
    image: angry,
  },
];
/* Image of sender missing */
const SingleMessage = ({
  msg,
  me,
  sameUser,
  setShowMessageActions,
  index,
  clickedCount,
  setClickedCount,
  setShowEmoji,
  showEmoji,
  getRepliedMessageInfo,
  replyTriggered,
}) => {
  const dispatch = useDispatch();
  const msgRef = useRef(null);
  const { activeConversation, chattedUser, grpChatUsers } = useSelector(
    (store) => store.messages
  );
  const { loggedUser } = useSelector((store) => store.currentUser);
  //console.log(typer);
  const [changeBg, setChangeBg] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [animTrigger, setAnimTrigger] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(false);
  const handleActions = (e) => {
    if (clickedIndex === index) {
      setChangeBg(false);
      setClickedIndex(null);
      setClickedCount((prev) => prev - 1);
    } else {
      setShowMessageActions(true);
      setChangeBg(true);
      setClickedIndex(index);
      setClickedCount(clickedCount + 1);
      setShowEmoji(true);
    }
  };
  useEffect(() => {
    if (replyTriggered) {
      setChangeBg(false);
      setClickedIndex(null);
    }
  }, [replyTriggered]);
  //console.log(replyTriggered);
  const handleAddEmoji = async (id) => {
    try {
      const { data } = await axios.get(
        `/message/add_emoji?message=${msg._id}&&emoji=${id}`
      );
      console.log(data);
      dispatch(reduxAddUpdateMessage({ data, msgId: msg._id }));

      //Socket emit
      if (activeConversation.isGroup) {
        groupAddMessageEmoji(grpChatUsers, msg._id, data);
      } else {
        userAddMessageEmoji(chattedUser._id, msg._id, data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <div
        ref={msgRef}
        className={`relative w-full flex mt-2 mb-3 space-x-3  ${
          me || msg.isReplied ? "ml-auto justify-end" : ""
        } ${changeBg && clickedCount > 0 ? "newBg" : ""}`}
        onClick={() => {
          handleActions();
          getRepliedMessageInfo(msg);
        }}
      >
        {activeConversation.isGroup &&
        !msg.deleteForAll &&
        !me &&
        !msg.isReplied &&
        !sameUser ? (
          <div>
            <img
              src={msg?.sender?.picture}
              alt=""
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
          </div>
        ) : (
          <div>
            <span className="w-[40px] h-[40px] rounded-full object-cover ml-10 "></span>
          </div>
        )}
        <div
          className={`relative  p-2 rounded-lg
      ${
        me || msg.isReplied
          ? "bg-green_5 text-black"
          : "dark:bg-dark_bg_5 text-dark_text_1"
      }`}
        >
          {!msg.isReplied ? (
            <div className="float-left h-full text-sm pb-4 pr-8">
              {activeConversation.isGroup &&
                !me &&
                !sameUser &&
                !msg.deleteForAll && (
                  <span className="flex text-red-700 font-bold">
                    {makeCapital(msg?.sender?.name)}
                  </span>
                )}
              {msg.deleteForAll ? (
                <span className="flex items-center gap-1 text-gray-400">
                  <MdNotInterested /> {msg.message}
                </span>
              ) : msg.replyFile && JSON.stringify(msg.replyFile) !== "{}" ? (
                <div>
                  <img
                    src={msg.replyFile?.url}
                    alt=""
                    className="w-full h-[100px] object-cover"
                  />
                  <span>{msg.message}</span>
                </div>
              ) : (
                <span>{msg.message}</span>
              )}
            </div>
          ) : (
            <div className="float-left h-full text-sm pb-4 pr-8">
              <div
                className="inside_replied"
                style={{
                  borderLeftColor:
                    msg?.repliedMessage?.sender?._id === loggedUser.id
                      ? "#00A884"
                      : "rgba(255, 0, 0, 0.79)",
                }}
              >
                <span
                  className="flex text-red-700 font-bold"
                  style={{
                    color:
                      msg?.repliedMessage?.sender?._id === loggedUser.id
                        ? "#00A884"
                        : "rgba(255, 0, 0, 0.79)",
                  }}
                >
                  {msg?.repliedMessage?.sender?._id === loggedUser.id
                    ? "You"
                    : makeCapital(msg?.repliedMessage?.sender?.name)}
                </span>
                {msg?.repliedMessage?.message}
              </div>
              <div className="inside_reply">
                {activeConversation.isGroup && (
                  <span
                    className="flex text-pink-950 font-bold"
                    style={{ color: me ? "#00A884" : "rgba(255, 0, 0, 0.79)" }}
                  >
                    {me ? "You" : makeCapital(msg?.sender.name)}
                  </span>
                )}
                {msg.deleteForAll ? (
                  <span className="flex items-center gap-1 text-gray-400">
                    <MdNotInterested /> {msg.message}
                  </span>
                ) : (
                  <span>{msg.message}</span>
                )}
              </div>
            </div>
          )}

          {msg.message !== "" && (
            <div className="absolute right-1.5 bottom-1.5 text-xs text-dark_text_3 leading-none flex items-center gap-1">
              {msg.haveStar && (
                <span className="star-anim">
                  <BsStarFill color="#8696a0" size={10} />
                </span>
              )}
              <span>{moment(msg.createdAt).format("HH:mm")}</span>
            </div>
          )}
          {/* Triangle */}
          <span className="">
            <TriangleIcon
              className={
                me || msg.isReplied
                  ? "fill-dark_bg_7 rotate-[60deg] absolute top-[-4.5px] -right-1.5"
                  : "dark:fill-dark_bg_5 rotate-[60deg] absolute top-[-5px] -left-1.5"
              }
            />
          </span>

          {msg.emojiBox.length > 0 &&
            msg.emojiBox.map((emj) => (
              <div key={emj.id} className="emoji-content">
                <img src={emojies.find((e) => e.id === emj).image} alt="" />
              </div>
            ))}
        </div>

        {clickedIndex === index && clickedCount === 1 && showEmoji && (
          <div className={`emoji-box `}>
            {emojies.map((em, idx) => (
              <button
                key={em.id}
                className="emoji-item"
                onClick={() => handleAddEmoji(em.id)}
              >
                <img
                  onMouseOver={() => {
                    setAnimTrigger(true);
                    setHoveredIndex(idx);
                  }}
                  onMouseLeave={() => {
                    setAnimTrigger(false);
                    setHoveredIndex(null);
                  }}
                  src={em.image}
                  alt=""
                  className={`emoji-img ${
                    animTrigger && hoveredIndex === idx ? "emojiAnim" : ""
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleMessage;
