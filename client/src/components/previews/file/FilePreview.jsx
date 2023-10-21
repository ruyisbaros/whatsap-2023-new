import React, { useState } from "react";
import { useSelector } from "react-redux";
import PreviewHeader from "./PreviewHeader";
import PreviewBody from "./PreviewBody";
import PreviewFooter from "./PreviewFooter";

const FilePreview = () => {
  const { activeConversation, chattedUser, files } = useSelector(
    (store) => store.messages
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState("");
  return (
    <div className="relative py-2 w-full flex items-center justify-center">
      <div className="w-full flex flex-col items-center">
        {/* Header */}
        <PreviewHeader activeIndex={activeIndex} />
        {/* Body */}
        <PreviewBody activeIndex={activeIndex} />
        {/* Footer */}
        <PreviewFooter
          message={message}
          setMessage={setMessage}
          setActiveIndex={setActiveIndex}
          activeIndex={activeIndex}
        />
      </div>
    </div>
  );
};

export default FilePreview;
