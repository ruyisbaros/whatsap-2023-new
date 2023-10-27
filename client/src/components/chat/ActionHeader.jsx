import React from "react";
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
const ActionHeader = ({
  setShowMessageActions,
  clickedCount,
  setReplyMessage,
  setShowEmoji,
  haveStar,
  setHaveStar,
  replyMessageId,
}) => {
  const dispatch = useDispatch();
  const { activeConversation, chattedUser, grpChatUsers } = useSelector(
    (store) => store.messages
  );

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
        userGiveStar(chattedUser, replyMessageId[0], data);
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
        userCancelStar(chattedUser, replyMessageId[0], data);
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
          <button
            onClick={() => setHaveStar((prev) => !prev)}
            disabled={clickedCount !== 1}
          >
            {haveStar ? (
              <TbStarOff
                color="white"
                size={20}
                fill="white"
                onClick={handleGiveStar}
              />
            ) : (
              <AiFillStar color="white" size={20} onClick={handleCancelStar} />
            )}
          </button>
        </div>
        <div>
          <button>
            <MdDelete color="white" size={20} />
          </button>
        </div>
        <div>
          <button>
            <MdContentCopy color="white" size={20} />
          </button>
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
