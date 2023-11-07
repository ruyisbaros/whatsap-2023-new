import React, { useEffect, useState } from "react";
import { ReturnIcon, SendIcon } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
import angry from "../../assets/emojies/angry.png";
import dede from "../../assets/emojies/dede.png";
import eyeHeart from "../../assets/emojies/eyeHeart.png";
import haha from "../../assets/emojies/haha.png";
import heart from "../../assets/emojies/heart.png";
import shy from "../../assets/emojies/shy.png";
import simarik from "../../assets/emojies/simarik.png";
import { toast } from "react-toastify";
import axios from "../../axios";
import { reduxAddMyMessages } from "../../redux/chatSlice";
import {
  sendNewMessage,
  userUpdateLatestMessage,
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

const ViewStatus = ({ setShowViewStatus }) => {
  const dispatch = useDispatch();
  const { viewedStatus } = useSelector((store) => store.statuses);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [animTrigger, setAnimTrigger] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  //console.log(activeIndex);

  const handleIndexR = () => {
    if (viewedStatus?.files.length - 1 === activeIndex) {
      setActiveIndex(0);
    } else {
      setActiveIndex((prev) => prev + 1);
    }
  };
  const handleIndexL = () => {
    if (activeIndex === 0) {
      setActiveIndex(viewedStatus?.files.length - 1);
    } else {
      setActiveIndex((prev) => prev - 1);
    }
  };
  useEffect(() => {
    let timer = setTimeout(() => {
      if (viewedStatus?.files?.length - 1 !== activeIndex) {
        setActiveIndex(activeIndex + 1);
      } else if (viewedStatus?.files?.length - 1 >= activeIndex) {
        setShowViewStatus(false);
      }
    }, 15000);
    return () => clearTimeout(timer);
  }, [activeIndex, viewedStatus]);

  const AnimatedBar = () => {
    return (
      <div className="animated_line">
        <span></span>
      </div>
    );
  };
  useEffect(() => {
    AnimatedBar();
  }, [activeIndex]);
  //console.log(viewedStatus?.files[activeIndex]);
  const handleAddMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleReplyStory = async (e) => {
    console.log(viewedStatus);
    try {
      setStatus(true);
      const { data } = await axios.post("/message/send_status_reply", {
        message,
        recipient: viewedStatus.owner._id,
        file: viewedStatus.files[activeIndex],
      });
      console.log(data);
      dispatch(reduxAddMyMessages(data.populatedMessage));

      //Socket send message convo,message
      sendNewMessage(data.populatedMessage, viewedStatus.owner._id);
      userUpdateLatestMessage(viewedStatus.owner._id, data.populatedMessage);

      setMessage("");
      setStatus(false);
    } catch (error) {
      setStatus(false);
      console.log(error);
      //toast.error(error.response.data.message);
    }
  };
  return (
    <div className="status-full w-full h-screen dark:bg-dark_bg_1 overflow-hidden">
      <div className="close_status">
        <button
          className="btn w-6 h-6"
          onClick={() => setShowViewStatus(false)}
        >
          <ReturnIcon className="fill-white " />
        </button>
        <span className="text-white font-bold text-[20px]"></span>
      </div>
      <div className="w-full h-full  flex items-center justify-center relative">
        <div className="relative w-[70%] h-[60%] ">
          <button className="myStatus-left" onClick={handleIndexL}>
            <FaChevronLeft color="#222" size={35} />
          </button>
          <div className="w-full h-full flex overflow-hidden">
            {viewedStatus?.files.length > 0 && (
              <div className="w-full h-full">
                {viewedStatus?.files[activeIndex].type === "IMAGE" ? (
                  <>
                    <img
                      src={viewedStatus?.files[activeIndex].url}
                      alt=""
                      className="w-full h-[90%] object-cover"
                    />
                    <span className="w-full dark:text-dark_text_4 text-[18px] mt-2 text-center inline-block">
                      {viewedStatus?.text}
                    </span>
                  </>
                ) : (
                  <>
                    <video
                      src={viewedStatus?.files[activeIndex].url}
                      controls
                      className="w-full h-[90%] object-cover"
                    />
                    <span className="w-full dark:text-dark_text_4 text-[18px] mt-2 text-center inline-block">
                      {viewedStatus?.text}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="w-full mt-[3rem] relative">
            {showEmoji && (
              <div className="w-full h-[60px] flex items-center justify-center gap-[1rem] emoji-status">
                {emojies.map((em, idx) => (
                  <button key={em.id} className="emoji-item">
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
            <div className="type-comment-to-status w-full flex items-center gap-[1rem] mt-[10px]">
              <input
                type="text"
                placeholder="Type a Message"
                className="w-full dark:bg-dark_hover_1 dark:text-dark_text_1 outline-none
              h-[45px] flex-1 rounded-lg pl-4"
                value={message}
                onChange={handleAddMessage}
                onFocus={() => setShowEmoji(true)}
                onBlur={() => setShowEmoji(false)}
              />
              <button className="btn" type="submit" onClick={handleReplyStory}>
                {status ? (
                  <ClipLoader color="#e9edef" size={25} />
                ) : (
                  <SendIcon className="dark:fill-dark_svg_1" />
                )}
              </button>
            </div>
          </div>
          <button className="myStatus-right" onClick={handleIndexR}>
            <FaChevronRight color="#222" size={35} />
          </button>
          <div className="view-lines">
            {viewedStatus?.files.length > 0 &&
              Array.from({ length: viewedStatus?.files.length }).map(
                (el, idx) => (
                  <span
                    style={{
                      background: activeIndex === idx ? "#008069" : "#fff",
                    }}
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                  ></span>
                )
              )}
          </div>
          <AnimatedBar />
        </div>
      </div>
    </div>
  );
};

export default ViewStatus;
