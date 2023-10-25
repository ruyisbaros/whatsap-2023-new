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
import { reduxAddEmojiToMessage } from "../../redux/chatSlice";
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
  const [showEmoji, setShowEmoji] = useState(false);
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
      setClickedCount((prev) => prev + 1);
      setShowEmoji(true);
    }
  };

  const handleAddEmoji = async (id) => {
    try {
      const { data } = await axios.get(
        `/message/add_emoji?message=${msg._id}&&emoji=${id}`
      );
      console.log(data);
      dispatch(reduxAddEmojiToMessage({ data, msgId: msg._id }));

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
    <>
      <div
        ref={msgRef}
        className={`relative w-full flex mt-2 mb-3 space-x-3  ${
          me ? "ml-auto justify-end" : ""
        } ${changeBg ? "newBg" : ""}`}
        onClick={(e) => handleActions(e)}
      >
        {activeConversation.isGroup && !me && !sameUser ? (
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
      ${me ? "bg-green_5 text-black" : "dark:bg-dark_bg_5 text-dark_text_1"}`}
        >
          <p className="float-left h-full text-sm pb-4 pr-8">
            {activeConversation.isGroup && !me && !sameUser && (
              <span className="flex text-red-600">
                {makeCapital(msg?.sender.name)}
              </span>
            )}
            {msg.message}
          </p>

          <span className="absolute right-1.5 bottom-1.5 text-xs text-dark_text_3 leading-none">
            {moment(msg.createdAt).format("HH:mm")}
          </span>
          {/* Triangle */}
          <span className="">
            <TriangleIcon
              className={
                me
                  ? "fill-dark_bg_7 rotate-[60deg] absolute top-[-5px] -right-1.5"
                  : "dark:fill-dark_bg_5 rotate-[60deg] absolute top-[-5px] -left-1.5"
              }
            />
          </span>

          {msg.emojiBox.length > 0 &&
            msg.emojiBox.map((emj) => (
              <div key={emj} className="emoji-content">
                <img src={emojies.find((e) => e.id === emj).image} alt="" />
              </div>
            ))}
        </div>

        {clickedIndex === index && clickedCount === 1 && (
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
    </>
  );
};

export default SingleMessage;
