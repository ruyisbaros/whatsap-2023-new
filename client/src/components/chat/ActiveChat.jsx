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
  const [showMessageActions, setShowMessageActions] = useState(false);
  const [clickedCount, setClickedCount] = useState(0);
  const { activeConversation, files } = useSelector((store) => store.messages);
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

  return (
    <div className="relative w-full h-full  ">
      {showMessageActions && clickedCount > 0 ? (
        <ActionHeader
          setShowMessageActions={setShowMessageActions}
          clickedCount={clickedCount}
          setClickedCount={setClickedCount}
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
          />
          <ChatActions />
        </>
      )}
    </div>
  );
};

export default ActiveChat;
