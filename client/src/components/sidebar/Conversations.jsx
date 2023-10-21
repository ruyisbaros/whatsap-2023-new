import React from "react";
import { useSelector } from "react-redux";
import SingleConversation from "./SingleConversation";

const Conversations = () => {
  const { conversations } = useSelector((store) => store.messages);

  return (
    <div className="conversations scrollBar !pb-14">
      <ul>
        {conversations.length > 0 &&
          conversations.map((c, _) => (
            <SingleConversation key={c._id} convo={c} />
          ))}
      </ul>
    </div>
  );
};

export default Conversations;
