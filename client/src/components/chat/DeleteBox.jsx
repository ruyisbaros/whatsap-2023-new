import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "../../axios";
import { reduxAddUpdateMessage } from "../../redux/chatSlice";
import { deleteForAllGroup, deleteForAllUser } from "../../SocketIOConnection";

const DeleteBox = ({ replyMessageId, setShowDeleteBox, setReplyTriggered }) => {
  const dispatch = useDispatch();

  const { activeConversation, chattedUser, grpChatUsers, messages } =
    useSelector((store) => store.messages);
  const { loggedUser } = useSelector((store) => store.currentUser);
  const [relevantMessage, setRelevantMessage] = useState(null);

  useEffect(() => {
    setRelevantMessage(messages.find((msg) => msg._id === replyMessageId[0]));
  }, [messages, replyMessageId]);
  console.log(relevantMessage);

  const deleteForMe = async () => {
    try {
      const { data } = await axios.get(
        `/message/delete_for_me/${replyMessageId[0]}`
      );
      console.log(data);
      dispatch(reduxAddUpdateMessage({ data, msgId: replyMessageId[0] }));
      setShowDeleteBox(false);
      setReplyTriggered(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const deleteForAll = async () => {
    try {
      const { data } = await axios.post(`/message/delete_for_all`, {
        id: replyMessageId[0],
        name: loggedUser.name,
      });
      console.log(data);
      dispatch(reduxAddUpdateMessage({ data, msgId: replyMessageId[0] }));
      //Socket emits
      if (activeConversation.isGroup) {
        deleteForAllGroup(grpChatUsers, replyMessageId[0], data);
      } else {
        deleteForAllUser(chattedUser._id, replyMessageId[0], data);
      }
      setShowDeleteBox(false);
      setReplyTriggered(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="delete_box_main">
      <div className="delete_box_content">
        <p className="del-msg">Delete message?</p>
        <div className="del_btn">
          <button onClick={deleteForMe}>Delete for me</button>
          {loggedUser.id === relevantMessage?.sender._id && (
            <button onClick={deleteForAll}>Delete for everyone</button>
          )}
          <button onClick={() => setShowDeleteBox(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBox;
