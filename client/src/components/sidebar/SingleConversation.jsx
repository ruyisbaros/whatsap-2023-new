import React, { useCallback, useEffect, useState } from "react";
import { dateHandler } from "../../utils/momentHandler";
import axios from "../../axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { reduxSetActiveConversation } from "../../redux/chatSlice";
import { joinAConversation } from "../../SocketIOConnection";
import { MdPermMedia } from "react-icons/md";
const SingleConversation = ({ convo }) => {
  const dispatch = useDispatch();
  const { loggedUser } = useSelector((store) => store.currentUser);
  const {
    activeConversation,
    messages,
    isTyping,
    typeTo,
    grpChatUsers,
    typedConversation,
  } = useSelector((store) => store.messages);

  const [YOU, setYOU] = useState("");
  const [typer, setTyper] = useState("");

  const findMeAndYou = useCallback(() => {
    if (!convo.isGroup) {
      const you = convo.users.find((usr) => usr._id !== loggedUser.id);
      setYOU(you);
    } else {
      const you = grpChatUsers.find((usr) => usr._id === typeTo);
      setTyper(you);
    }
  }, [loggedUser, convo, grpChatUsers, typeTo]);

  useEffect(() => {
    findMeAndYou();
  }, [findMeAndYou]);
  //console.log(ME, YOU);
  //console.log(convo.users.map((usr) => usr._id));
  const open_create_conversation = async () => {
    try {
      const { data } = await axios.post("/conversation/open_create", {
        receiver_id: YOU._id,
        isGroup: convo.isGroup ? convo._id : false,
      });
      console.log(data);
      await dispatch(reduxSetActiveConversation(data));
      //socket
      joinAConversation(data._id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //console.log(countOfNotReadMessage);
  return (
    <li
      className={`list-none h-[72px] w-full dark:bg-dark_bg_1 hover:dark:bg-dark_bg_2 cursor-pointer dark:text-dark_text_1 px-[10px] rounded-lg mb-1 ${
        activeConversation?._id === convo._id ? "dark:bg-dark_bg_2" : ""
      }`}
      onClick={open_create_conversation}
    >
      <div className="relative w-full flex items-center justify-between py-[10px]">
        {/* Left side (photo latest message etc) */}
        <div className="flex items-center gap-x-3">
          <div
            className={`relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden`}
          >
            <img
              src={convo.isGroup ? convo.picture : YOU.picture}
              alt=""
              className={`w-full h-full object-cover `}
            />
          </div>
          <div className="w-full flex flex-col">
            <h1 className="font-bold capitalize flex items-center gap-x-2">
              {convo.isGroup ? convo.name : YOU.name}
            </h1>
            <div>
              <div className="flex items-center gap-x-1 dark:text-dark_text_2">
                <div className="flex-1 items-center gap-x-1">
                  <div
                    className={`w-full ${
                      isTyping && typedConversation?._id === convo._id
                        ? "text-green-300"
                        : ""
                    }`}
                  >
                    {convo.latestMessage &&
                    convo.latestMessage?.message &&
                    convo.latestMessage?.files <= 0 ? (
                      convo.latestMessage.message.length > 20 ? (
                        <span>
                          {convo.latestMessage.message.slice(0, 20) + "..."}
                        </span>
                      ) : (
                        <span>{convo.latestMessage.message}</span>
                      )
                    ) : convo.latestMessage &&
                      convo.latestMessage?.message &&
                      convo.latestMessage?.files.length > 0 ? (
                      convo.latestMessage.message.length > 20 ? (
                        <p className="w-full flex items-center justify-between">
                          <span>
                            {convo.latestMessage.message.slice(0, 20) + "..."}
                          </span>
                          <span className="ml-8">
                            <MdPermMedia color="#00a884" />
                          </span>
                        </p>
                      ) : (
                        <p className="w-full flex items-center justify-between">
                          <span>{convo.latestMessage.message}</span>
                          <span className="ml-8">
                            <MdPermMedia color="#00a884" />
                          </span>
                        </p>
                      )
                    ) : (
                      convo.latestMessage &&
                      !convo.latestMessage?.message &&
                      convo.latestMessage?.files?.length > 0 && (
                        <p className="mt-2">
                          <span>
                            <MdPermMedia color="#00a884" />
                          </span>
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-col items-end gap-y-4 text-xs">
          <span className="dark:text-dark_text_2">
            {convo.latestMessage
              ? dateHandler(convo.latestMessage.createdAt)
              : ""}
          </span>
        </div>
      </div>
      {/* Bottom line */}
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
};

export default SingleConversation;
