import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SendIcon from "../../../assets/svg/Send";
import CloseIcon from "../../../assets/svg/Close";
import { getFileType } from "../../../utils/fileTypes";
import {
  reduxAddFile,
  reduxAddMyMessages,
  reduxGetMyConversations,
  reduxMakeFilesEmpty,
  reduxRemoveFile,
} from "../../../redux/chatSlice";
import { toast } from "react-toastify";
import axios from "../../../axios";
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
} from "../../../SocketIOConnection";
import { ClipLoader } from "react-spinners";

const PreviewFooter = ({
  message,
  setMessage,
  setActiveIndex,
  activeIndex,
}) => {
  const dispatch = useDispatch();
  const documentInputRef = useRef(null);
  const { files, activeConversation, chattedUser, isTyping, grpChatUsers } =
    useSelector((store) => store.messages);
  const { loggedUser } = useSelector((store) => store.currentUser);
  const [status, setStatus] = useState(false);
  const [msgSended, setMsgSended] = useState(false);

  const handleAddDocument = (e) => {
    let files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file) {
        if (
          file.type !== "application/pdf" &&
          file.type !== "text/plain" &&
          file.type !== "application/msword" &&
          file.type !== "application/vnd.ms-powerpoint" &&
          file.type !== "application/zip" &&
          file.type !== "image/jpeg" &&
          file.type !== "image/png" &&
          file.type !== "image/gif" &&
          file.type !== "image/webp" &&
          file.type !== "video/mp4" &&
          file.type !== "video/webm"
        ) {
          files = files.filter((item) => item.name !== file.name);
          toast.error(
            "You can upload pdf, text, doc, powerPoint, zip, jpeg, gif, png, webp, mp4 and webm types!"
          );
          return;
        } else if (file.size > 1024 * 1024 * 20) {
          files = files.filter((item) => item.name !== file.name);
          toast.error("Max 5mb size allowed!");
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          dispatch(
            reduxAddFile({
              file: file,
              data: e.target.result,
              type: getFileType(file.type),
            })
          );
        };
      }
    });
  };

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
            files,
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
          userStopMessageTyping(chattedUser._id, null, data.populatedMessage);
          setMessage("");
          setStatus(false);
          //Make files empty
          dispatch(reduxMakeFilesEmpty());
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
            files,
          });
          console.log(data);
          setMsgSended(true);
          dispatch(reduxAddMyMessages(data.populatedMessage));

          //Socket send message convo,message
          sendNewMessageToGroup(data.populatedMessage, grpChatUsers);
          groupUpdateLatestMessage(grpChatUsers, data.populatedMessage);
          groupStopMessageTyping(grpChatUsers, null, data.populatedMessage);
          setMessage("");
          setStatus(false);
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
  //console.log(message, files);
  const handleRemoveThumbnail = (index) => {
    dispatch(reduxRemoveFile(index));
  };
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full h-[40px] max-w-[60%] dark:bg-dark_hover_1 rounded-lg">
        <input
          className="w-full h-full bg-transparent border-none outline-none rounded-lg pl-2 dark:text-dark_text_1"
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={handleMessageType}
        />
      </div>
      {/* send/review images/add more file */}
      <div className="w-[97%] flex items-center justify-between mt-2 border-t dark:border-dark_border_2">
        <span></span>
        <div className="flex items-center gap-x-4 mt-2">
          {files.length > 0 &&
            files.map((file, i) => (
              <div
                key={i}
                className={`fileThumbnail w-14 h-14 border dark:border-white rounded-md cursor-pointer relative ${
                  activeIndex === i
                    ? "border-[3px] p-[1px] !border-green_1 transition-all duration-[0.3s]"
                    : ""
                }`}
                onClick={() => setActiveIndex(i)}
              >
                {file.type === "IMAGE" ? (
                  <img
                    src={file.data}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : file.type === "VIDEO" ? (
                  <video
                    src={file.data}
                    className="w-full h-full object-cover"
                  ></video>
                ) : (
                  <img
                    src={`/file/${file.type}.png`}
                    alt=""
                    className="w-8 h-10 mt-1.5 ml-2.5 object-contain"
                  />
                )}
                {/* Remove media */}
                <div
                  className="remove_media hidden"
                  onClick={() => handleRemoveThumbnail(i)}
                >
                  <CloseIcon className="dark:fill-red-600 w-4 h-4 absolute right-0 top-0 cursor-pointer" />
                </div>
              </div>
            ))}
          <div
            className="w-14 h-14 border dark:border-white rounded-md flex items-center 
            justify-center cursor-pointer"
          >
            <span
              className="rotate-45"
              onClick={() => documentInputRef.current.click()}
            >
              <CloseIcon className="dark:fill-dark_svg_1" />
            </span>
            <input
              type="file"
              hidden
              multiple
              ref={documentInputRef}
              accept="application/pdf,text/plain,application/msword,application/vnd.ms-powerpoint,application/zip,image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
              onChange={handleAddDocument}
            />
          </div>
        </div>
        <div
          className="bg-green_1 w-14 h-14 mt-2 rounded-full flex items-center justify-center
        cursor-pointer"
          onClick={handleSendMessage}
        >
          {status ? (
            <ClipLoader color="#e9edef" size={25} />
          ) : (
            <SendIcon className="dark:fill-white" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewFooter;
