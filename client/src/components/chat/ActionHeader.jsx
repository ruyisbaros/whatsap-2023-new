import React, { useEffect } from "react";
import { TiArrowForward } from "react-icons/ti";
import { AiFillStar } from "react-icons/ai";
import { MdDelete, MdContentCopy } from "react-icons/md";
import { ReturnIcon } from "../../assets/svg";
const ActionHeader = ({
  setShowMessageActions,
  clickedCount,
  setClickedCount,
  setReplyMessage,
  setShowEmoji,
}) => {
  return (
    <div className="createGroupAnimation h-[59px] dark:bg-dark_bg_2 p16 py-3">
      <div className="w-full h-full flex justify-around items-center">
        <div>
          <button
            className="btn w-6 h-6 border"
            onClick={() => setShowMessageActions(false)}
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
          <button>
            <AiFillStar color="white" size={20} />
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
