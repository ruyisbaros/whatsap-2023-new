import React, { useEffect, useRef, useState } from "react";
import { CloseIcon, EmojiIcon, SendIcon } from "../../assets/svg";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { ClipLoader } from "react-spinners";
import {
  reduxAddMyMessages,
  reduxGetMyConversations,
  reduxSetChattedUser,
  reduxSetGroupChatUsers,
} from "../../redux/chatSlice";
import EmojiPicker from "emoji-picker-react";
import AttachmentMenu from "./AttachmentMenu";
import {
  createNewConversation,
  groupStartMessageTyping,
  groupStopMessageTyping,
  groupUpdateLatestMessage,
  sendNewMessage,
  sendNewMessageToGroup,
  userStartMessageTyping,
  userStopMessageTyping,
  userUpdateLatestMessage,
} from "../../SocketIOConnection";

const ChatActions = ({
  replyMessage,
  setReplyMessage,
  replyMessageId,
  setReplyMessageId,
  setClickedCount,
  setReplyTriggered,
}) => {
  const dispatch = useDispatch();
  const messageRef = useRef(null);

  const { activeConversation, chattedUser, isTyping, grpChatUsers } =
    useSelector((store) => store.messages);
  const { loggedUser } = useSelector((store) => store.currentUser);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);
  const [msgSended, setMsgSended] = useState(false);
  console.log(replyMessage);
  useEffect(() => {
    if (!activeConversation.isGroup) {
      const usr = activeConversation.users.find(
        (usr) => usr._id !== loggedUser.id
      );
      dispatch(reduxSetChattedUser(usr));
      dispatch(reduxSetGroupChatUsers([]));
    } else {
      dispatch(reduxSetChattedUser(null));
      dispatch(
        reduxSetGroupChatUsers(
          activeConversation.users.filter((usr) => usr._id !== loggedUser.id)
        )
      );
    }
  }, [activeConversation, loggedUser, dispatch]);
  //console.log(chattedUser);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message) {
      if (!activeConversation.isGroup) {
        try {
          setStatus(true);
          const { data } = await axios.post("/message/send", {
            message,
            convo_id: activeConversation._id,
            recipient: chattedUser._id,
          });
          console.log(data);
          setMsgSended(true);
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
          userUpdateLatestMessage(chattedUser._id, data.populatedMessage);

          setMessage("");
          setStatus(false);
        } catch (error) {
          setStatus(false);
          toast.error(error.response.data.message);
        }
      } else {
        try {
          setStatus(true);
          const { data } = await axios.post("/message/send_group", {
            message,
            convo_id: activeConversation._id,
            recipients: grpChatUsers,
          });
          console.log(data);
          setMsgSended(true);
          dispatch(reduxAddMyMessages(data.populatedMessage));

          //Socket send message convo,message
          sendNewMessageToGroup(data.populatedMessage, grpChatUsers);
          groupUpdateLatestMessage(grpChatUsers, data.populatedMessage);

          setMessage("");
          setStatus(false);
        } catch (error) {
          setStatus(false);
          toast.error(error.response.data.message);
        }
      }
    }
  };
  const handleSendReplyMessage = async (e) => {
    e.preventDefault();
    if (message) {
      if (!activeConversation.isGroup) {
        try {
          setStatus(true);
          const { data } = await axios.post("/message/send_reply", {
            message,
            convo_id: activeConversation._id,
            recipient: chattedUser._id,
            messageId: replyMessageId[0],
          });
          console.log(data);
          setMsgSended(true);
          //setClickedCount(0);
          dispatch(reduxAddMyMessages(data.populatedMessage));

          //Socket send message convo,message
          sendNewMessage(data.populatedMessage, chattedUser._id);
          userUpdateLatestMessage(chattedUser._id, data.populatedMessage);
          setMessage("");
          setStatus(false);
          setReplyMessage(false);
          setReplyMessageId([]);
          setReplyTriggered(true);
        } catch (error) {
          setStatus(false);
          toast.error(error.response.data.message);
        }
      } else {
        try {
          setStatus(true);
          const { data } = await axios.post("/message/send_group_reply", {
            message,
            convo_id: activeConversation._id,
            recipients: grpChatUsers,
            messageId: replyMessageId[0],
          });
          console.log(data);
          setMsgSended(true);
          //setClickedCount(0);
          dispatch(reduxAddMyMessages(data.populatedMessage));

          //Socket send message convo,message
          sendNewMessageToGroup(data.populatedMessage, grpChatUsers);
          groupUpdateLatestMessage(grpChatUsers, data.populatedMessage);

          setMessage("");
          setStatus(false);
          setReplyMessage(false);
          setReplyMessageId([]);
          setReplyTriggered(true);
        } catch (error) {
          setStatus(false);
          toast.error(error.response.data.message);
        }
      }
    }
  };
  const handleMessageType = (e) => {
    setMessage(e.target.value);
    if (!isTyping && activeConversation.isGroup) {
      groupStartMessageTyping(grpChatUsers, loggedUser.id, activeConversation);
      console.log("group typing triggered");
    } else if (!isTyping && !activeConversation.isGroup) {
      userStartMessageTyping(
        chattedUser._id,
        loggedUser.id,
        activeConversation
      );
    }

    let lastTypeTime = new Date().getTime();
    let timer = 2000;
    let timers = setTimeout(() => {
      let timeNow = new Date().getTime();
      let tDifference = timeNow - lastTypeTime;

      if (tDifference >= timer && !msgSended) {
        !activeConversation.isGroup
          ? userStopMessageTyping(chattedUser._id, activeConversation)
          : groupStopMessageTyping(grpChatUsers, activeConversation);
      }
    }, timer);
    return () => clearTimeout(timers);
  };
  const handleEmoji = (data) => {
    //console.log(emojiData);
    const { emoji } = data;
    const ref = messageRef.current;
    ref.focus();
    setMessage((prev) => prev + emoji);
  };

  useEffect(() => {
    if (replyMessage) {
      messageRef.current.focus();
    }
  }, [replyMessage]);
  return (
    <form
      className="dark:bg-dark_bg_2 h-[60px] w-full flex items-center absolute bottom-0
  py-2 px-4 formBorder"
      onSubmit={replyMessage ? handleSendReplyMessage : handleSendMessage}
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
