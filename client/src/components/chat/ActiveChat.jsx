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

const ActiveChat = ({ startVideoCall, setShowGroupInfo }) => {
  const dispatch = useDispatch();
  const { activeConversation, files } = useSelector((store) => store.messages);
  const [showMessageActions, setShowMessageActions] = useState(false);
  const [clickedCount, setClickedCount] = useState(0);
  const [replyMessage, setReplyMessage] = useState(false);
  const [replyMessageId, setReplyMessageId] = useState("");
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
  return (
    <div className="relative w-full h-full  ">
      {showMessageActions && clickedCount > 0 ? (
        <ActionHeader
          setShowMessageActions={setShowMessageActions}
          clickedCount={clickedCount}
          setClickedCount={setClickedCount}
          setReplyMessage={setReplyMessage}
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
            setReplyMessageId={setReplyMessageId}
          />
          <ChatActions
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
            replyMessageId={replyMessageId}
            setReplyMessageId={setReplyMessageId}
          />
        </>
      )}
    </div>
  );
};

export default ActiveChat;
