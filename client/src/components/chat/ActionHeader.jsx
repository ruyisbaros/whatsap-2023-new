import React, { useEffect, useState } from "react";
import { TiArrowForward } from "react-icons/ti";
import { AiFillStar } from "react-icons/ai";
import { TbStarOff } from "react-icons/tb";
import { MdDelete, MdContentCopy } from "react-icons/md";
import { ReturnIcon } from "../../assets/svg";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { reduxAddUpdateMessage } from "../../redux/chatSlice";
import {
  groupCancelStar,
  groupGiveStar,
  userCancelStar,
  userGiveStar,
} from "../../SocketIOConnection";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ActionHeader = ({
  setShowMessageActions,
  clickedCount,
  setReplyMessage,
  setShowEmoji,
  replyMessageId,
  setShowDeleteBox,
  setReplyTriggered,
}) => {
  const dispatch = useDispatch();
  const { activeConversation, chattedUser, grpChatUsers, messages } =
    useSelector((store) => store.messages);
  const [relevantMessage, setRelevantMessage] = useState(null);

  useEffect(() => {
    setRelevantMessage(messages.find((msg) => msg._id === replyMessageId[0]));
  }, [messages, replyMessageId]);
  console.log(relevantMessage);
  const handleGiveStar = async () => {
    try {
      const { data } = await axios.get(
        `/message/give_star/${replyMessageId[0]}`
      );
      console.log(data);
      dispatch(reduxAddUpdateMessage({ data, msgId: replyMessageId[0] }));

      //Socket emits
      if (activeConversation.isGroup) {
        groupGiveStar(grpChatUsers, replyMessageId[0], data);
      } else {
        userGiveStar(chattedUser._id, replyMessageId[0], data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleCancelStar = async () => {
    try {
      const { data } = await axios.get(
        `/message/cancel_star/${replyMessageId[0]}`
      );
      console.log(data);
      dispatch(reduxAddUpdateMessage({ data, msgId: replyMessageId[0] }));
      //Socket emits
      if (activeConversation.isGroup) {
        groupCancelStar(grpChatUsers, replyMessageId[0], data);
      } else {
        userCancelStar(chattedUser._id, replyMessageId[0], data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="createGroupAnimation h-[59px] dark:bg-dark_bg_2 p16 py-3">
      <div className="w-full h-full flex justify-around items-center">
        <div>
          <button
            className="btn w-6 h-6 border"
            onClick={() => {
              setShowMessageActions(false);
              setReplyTriggered(true);
            }}
          >
            <ReturnIcon className="fill-white " />
          </button>
        </div>
        <div className="text-white font-weight-bold">{clickedCount}</div>
        <div>
          <button
            className="roo"
            onClick={() => {
              setReplyMessage(true);
              setShowMessageActions(false);
              setShowEmoji(false);
            }}
            disabled={clickedCount !== 1}
          >
            <TiArrowForward color="white" size={20} />
          </button>
        </div>
        <div>
          <button disabled={clickedCount !== 1}>
            {relevantMessage?.haveStar ? (
              <TbStarOff
                color="white"
                size={20}
                fill="white"
                onClick={handleCancelStar}
              />
            ) : (
              <AiFillStar color="white" size={20} onClick={handleGiveStar} />
            )}
          </button>
        </div>
        <div>
          <button
            onClick={() => setShowDeleteBox(true)}
            disabled={clickedCount !== 1}
          >
            <MdDelete color="white" size={20} />
          </button>
        </div>
        <div>
          <CopyToClipboard
            text={relevantMessage?.message}
            onCopy={() => setReplyTriggered(true)}
          >
            <button disabled={clickedCount !== 1} className="copy-text">
              <MdContentCopy color="white" size={20} />
            </button>
          </CopyToClipboard>
        </div>
        <div>
          <button>
            <TiArrowForward color="white" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionHeader;
