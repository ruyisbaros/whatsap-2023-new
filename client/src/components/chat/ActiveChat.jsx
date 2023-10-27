import React, { useCallback, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import {
  reduxGetMyMessages,
  reduxMakeMessagesSeen,
} from "../../redux/chatSlice";
import ChatActions from "./ChatActions";
import FilePreview from "../previews/file/FilePreview";
import ActionHeader from "./ActionHeader";
import ChatReply from "./ChatReply";
import DeleteBox from "./DeleteBox";

const ActiveChat = ({ startVideoCall, setShowGroupInfo }) => {
  const dispatch = useDispatch();
  const { activeConversation, files } = useSelector((store) => store.messages);
  const [showMessageActions, setShowMessageActions] = useState(false);
  const [clickedCount, setClickedCount] = useState(0);
  const [replyMessage, setReplyMessage] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [replyTriggered, setReplyTriggered] = useState(false);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [replyMessageId, setReplyMessageId] = useState([]);
  const [replyMessageContent, setReplyMessageContent] = useState([]);
  //const { loggedUser } = useSelector((store) => store.currentUser);

  const fetchRelevantMessages = useCallback(async () => {
    if (activeConversation.latestMessage) {
      try {
        const { data } = await axios.get(
          `/message/get_messages/${activeConversation._id}`
        );
        console.log(data);
        dispatch(reduxGetMyMessages(data));
        setShowMessageActions(false);
        setClickedCount(0);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      dispatch(reduxGetMyMessages([]));
    }
  }, [activeConversation, dispatch]);

  useEffect(() => {
    fetchRelevantMessages();
  }, [fetchRelevantMessages]);
  console.log(replyMessageId);
  console.log(replyMessageContent);

  const getRepliedMessageInfo = (msg) => {
    if (replyMessageId.length <= 0) {
      setReplyMessageId((prev) => [...prev, msg._id]);
      setReplyMessageContent((prev) => [...prev, msg]);
      setReplyTriggered(false);
    } else {
      setReplyMessageId(replyMessageId.filter((flt) => flt !== msg._id));
      setReplyMessageContent(
        replyMessageContent.filter((flt) => flt._id !== msg._id)
      );
      setReplyTriggered(false);
    }
  };
  useEffect(() => {
    if (replyTriggered) {
      setReplyMessageId([]);
      setReplyMessageContent([]);
    }
  }, [replyTriggered]);
  return (
    <div className="relative w-full h-full  ">
      {showMessageActions && clickedCount > 0 ? (
        <ActionHeader
          setShowMessageActions={setShowMessageActions}
          clickedCount={clickedCount}
          replyMessageId={replyMessageId}
          setReplyMessage={setReplyMessage}
          setShowEmoji={setShowEmoji}
          setShowDeleteBox={setShowDeleteBox}
        />
      ) : (
        <ChatHeader
          startVideoCall={startVideoCall}
          setShowGroupInfo={setShowGroupInfo}
        />
      )}
      {files.length > 0 ? (
        <FilePreview />
      ) : (
        <>
          <ChatMessages
            setShowMessageActions={setShowMessageActions}
            setClickedCount={setClickedCount}
            clickedCount={clickedCount}
            setShowEmoji={setShowEmoji}
            showEmoji={showEmoji}
            replyMessage={replyMessage}
            getRepliedMessageInfo={getRepliedMessageInfo}
            replyTriggered={replyTriggered}
          />
          {replyMessage && (
            <ChatReply
              replyMessageContent={replyMessageContent}
              setReplyMessage={setReplyMessage}
              setClickedCount={setClickedCount}
              setReplyTriggered={setReplyTriggered}
            />
          )}
          <ChatActions
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
            replyMessageId={replyMessageId}
            setReplyMessageId={setReplyMessageId}
            setClickedCount={setClickedCount}
          />

          {showDeleteBox && (
            <DeleteBox
              replyMessageId={replyMessageId}
              setShowDeleteBox={setShowDeleteBox}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ActiveChat;
