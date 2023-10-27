import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import SingleMessage from "./SingleMessage";
import Typing from "./Typing";
import ShowFileInMessage from "./ShowFileInMessage";
/* setShowMessageActions={setShowMessageActions}
            setClickedCount={setClickedCount}
            clickedCount={clickedCount}
            setShowEmoji={setShowEmoji}
            showEmoji={showEmoji}
            replyMessage={replyMessage}
            getRepliedMessageInfo={getRepliedMessageInfo}
            replyMessageContent={replyMessageContent}
            setReplyTriggered={setReplyTriggered}
            replyTriggered={replyTriggered} */
const ChatMessages = ({
  setShowMessageActions,
  setClickedCount,
  clickedCount,
  setShowEmoji,
  showEmoji,
  replyMessage,
  getRepliedMessageInfo,
  replyTriggered,
}) => {
  const endRef = useRef();

  const {
    messages,
    chattedUser,
    isTyping,
    typeTo,
    grpChatUsers,
    typedConversation,
    activeConversation,
  } = useSelector((store) => store.messages);
  const { loggedUser } = useSelector((store) => store.currentUser);

  const [filteredMessages, setFilteredMessages] = useState([]);

  useEffect(() => {
    setFilteredMessages(
      messages.filter(
        (message) => message.conversation._id === activeConversation._id
      )
    );
  }, [messages, activeConversation]);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, filteredMessages, replyMessage]);

  return (
    <div className=" mb-[60px] bg-[url('https://res.cloudinary.com/ruyisbaros/image/upload/v1694785109/whatsapp_api/xkiiml6mmcz5xyqkdm42.jpg')] bg-cover bg-no-repeat ">
      <div className="scrollBar overflow-scrollbar overflow-auto py-2 px-[5%]">
        {/* Messages */}
        {filteredMessages.length > 0 &&
          filteredMessages.map((message, index) => (
            <div key={message?.createdAt}>
              {message?.files?.length > 0
                ? message?.files?.map((f, i) => (
                    <ShowFileInMessage
                      key={f.public_id}
                      file={f}
                      me={loggedUser.id === message?.sender?._id}
                      msg={message}
                      /* sameUser={
                          message[index].sender._id ===
                          message[index - 1].sender._id
                        } */
                    />
                  ))
                : null}
              <SingleMessage
                msg={message}
                me={loggedUser.id === message?.sender?._id}
                sameUser={
                  messages[index]?.sender._id ===
                  messages[index - 1]?.sender._id
                }
                setShowMessageActions={setShowMessageActions}
                index={index}
                setClickedCount={setClickedCount}
                clickedCount={clickedCount}
                setShowEmoji={setShowEmoji}
                showEmoji={showEmoji}
                getRepliedMessageInfo={getRepliedMessageInfo}
                replyTriggered={replyTriggered}
              />
            </div>
          ))}
        {isTyping &&
        (typeTo === chattedUser?._id ||
          grpChatUsers.find((gu) => gu._id === typeTo)) &&
        typedConversation._id === activeConversation._id ? (
          <Typing />
        ) : (
          ""
        )}
        <div ref={endRef} className="h-[40px]"></div>
      </div>
    </div>
  );
};

export default ChatMessages;
