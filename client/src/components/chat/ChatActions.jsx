import React, { useEffect, useRef, useState } from "react";
import {
  AttachmentIcon,
  CloseIcon,
  EmojiIcon,
  SendIcon,
} from "../../assets/svg";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { ClipLoader } from "react-spinners";
import {
  reduxAddMyMessages,
  reduxGetMyConversations,
  reduxSetChattedUser,
} from "../../redux/chatSlice";
import EmojiPicker from "emoji-picker-react";
import AttachmentMenu from "./AttachmentMenu";
import {
  createNewConversation,
  sendNewMessage,
  userStartMessageTyping,
  userStopMessageTyping,
} from "../../SocketIOConnection";

const ChatActions = () => {
  const dispatch = useDispatch();
  const messageRef = useRef(null);

  const { activeConversation, chattedUser, isTyping } = useSelector(
    (store) => store.messages
  );
  const { loggedUser } = useSelector((store) => store.currentUser);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);

  useEffect(() => {
    const usr = activeConversation.users.find(
      (usr) => usr._id !== loggedUser.id
    );
    dispatch(reduxSetChattedUser(usr));
  }, [activeConversation, loggedUser, dispatch]);
  //console.log(chattedUser);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message) {
      try {
        setStatus(true);
        const { data } = await axios.post("/message/send", {
          message,
          convo_id: activeConversation._id,
          recipient: chattedUser._id,
        });
        console.log(data);
        //Means first time chat
        if (data.conversations) {
          dispatch(
            reduxGetMyConversations(
              data.conversations.filter((dt) => dt.latestMessage)
            )
          );
          //socket create conversation for fresh chatters
          const convo = data.conversations.find(
            (cnv) => cnv._id === activeConversation._id
          );
          createNewConversation(convo, chattedUser._id);
        }

        dispatch(reduxAddMyMessages(data.populatedMessage));

        //Socket send message convo,message
        sendNewMessage(data.populatedMessage, chattedUser._id);
        userStopMessageTyping(chattedUser._id, null, data.populatedMessage);

        setMessage("");
        setStatus(false);
      } catch (error) {
        setStatus(false);
        toast.error(error.response.data.message);
      }
    }
  };
  const handleMessageType = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      userStartMessageTyping(
        chattedUser._id,
        loggedUser.id,
        activeConversation
      );
    }
    let lastTypeTime = new Date().getTime();
    let timer = 1000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let tDifference = timeNow - lastTypeTime;
      if (tDifference >= timer && isTyping) {
        userStopMessageTyping(chattedUser._id, activeConversation, null);
      }
    }, timer);
  };
  const handleEmoji = (data) => {
    //console.log(emojiData);
    const { emoji } = data;
    const ref = messageRef.current;
    ref.focus();
    setMessage((prev) => prev + emoji);
  };

  return (
    <form
      className="dark:bg-dark_bg_2 h-[60px] w-full flex items-center absolute bottom-0
  py-2 px-4 formBorder"
      onSubmit={handleSendMessage}
    >
      <div className="w-full flex items-center gap-x-2 ">
        {/* Icons */}
        <ul className="flex gap-x-2 ">
          <li className="list-none">
            <button
              className="btn"
              type="button"
              onClick={() => {
                setShowEmoji((prev) => !prev);
                setShowAttachment(false);
              }}
            >
              {showEmoji ? (
                <CloseIcon className="turnIcon dark:fill-dark_svg_1" />
              ) : (
                <EmojiIcon className="dark:fill-dark_svg_1" />
              )}
            </button>
            {showEmoji && (
              <div className="openEmojiAnimation epr-dark-theme absolute bottom-[60px] left-[-0.5px]">
                <EmojiPicker theme="dark" onEmojiClick={handleEmoji} />
              </div>
            )}
          </li>
          <li className="list-none relative">
            <button
              className="btn"
              type="button"
              onClick={() => {
                setShowAttachment((prev) => !prev);
                setShowEmoji(false);
              }}
            >
              {/* <span className="rotate-45">
              <CloseIcon />
            </span> */}
              {showAttachment ? (
                <CloseIcon className="turnIcon dark:fill-dark_svg_1" />
              ) : (
                <span className="rotate-45">
                  <CloseIcon className="dark:fill-dark_svg_1" />
                </span>
              )}
            </button>
            {showAttachment && <AttachmentMenu />}
          </li>
        </ul>
        {/* message input */}
        <div className="w-full ">
          <input
            type="text"
            placeholder="Type a Message"
            className="w-full dark:bg-dark_hover_1 dark:text-dark_text_1 outline-none
              h-[45px] flex-1 rounded-lg pl-4"
            value={message}
            onChange={handleMessageType}
            ref={messageRef}
            onBlur={() =>
              userStopMessageTyping(chattedUser._id, activeConversation, null)
            }
          />
        </div>
        {/* Send */}
        <button className="btn" type="submit">
          {status ? (
            <ClipLoader color="#e9edef" size={25} />
          ) : (
            <SendIcon className="dark:fill-dark_svg_1" />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatActions;
