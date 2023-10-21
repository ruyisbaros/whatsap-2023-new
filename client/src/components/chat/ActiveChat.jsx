import React, { useCallback, useEffect } from "react";
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

const ActiveChat = ({ callUser }) => {
  const dispatch = useDispatch();
  const { activeConversation, files } = useSelector((store) => store.messages);
  const { loggedUser } = useSelector((store) => store.currentUser);

  const fetchRelevantMessages = useCallback(async () => {
    if (activeConversation.latestMessage) {
      try {
        const { data } = await axios.get(
          `/message/get_messages/${activeConversation.latestMessage.conversation}`
        );
        console.log(data);
        dispatch(reduxGetMyMessages(data));
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

  const makeMessagesSeen = useCallback(async () => {
    if (activeConversation.latestMessage) {
      try {
        const { data } = await axios.get(
          `/message/make_seen/${activeConversation.latestMessage.conversation}`
        );
        //console.log(data);
        dispatch(
          reduxMakeMessagesSeen({
            logId: loggedUser.id,
            convoId: activeConversation.latestMessage.conversation,
          })
        );
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }, [activeConversation, dispatch, loggedUser]);

  useEffect(() => {
    makeMessagesSeen();
  }, [makeMessagesSeen]);

  return (
    <div className="relative w-full h-full  ">
      <ChatHeader callUser={callUser} />
      {files.length > 0 ? (
        <FilePreview />
      ) : (
        <>
          <ChatMessages />
          <ChatActions />
        </>
      )}
    </div>
  );
};

export default ActiveChat;
