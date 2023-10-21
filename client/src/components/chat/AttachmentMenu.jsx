import React from "react";
import {
  CameraIcon,
  ContactIcon,
  PollIcon,
  StickerIcon,
} from "../../assets/svg";
import DocumentIcon from "../../assets/svg/Document";
import PhotoAttachment from "../attachments/PhotoAttachment";
import DocumentAttachment from "../attachments/DocumentAttachment";

const AttachmentMenu = () => {
  return (
    <ul className="absolute openEmojiAnimation bottom-14">
      <li>
        <button type="button" className="rounded-full">
          <PollIcon />
        </button>
      </li>
      <li>
        <button type="button" className="bg-[#0eabf4] rounded-full">
          <ContactIcon />
        </button>
      </li>
      <li>
        <DocumentAttachment />
      </li>
      <li>
        <button type="button" className="bg-[#d3396d] rounded-full">
          <CameraIcon />
        </button>
      </li>
      <li>
        <button type="button" className="rounded-full">
          <StickerIcon />
        </button>
      </li>
      <li>
        <PhotoAttachment />
      </li>
    </ul>
  );
};

export default AttachmentMenu;
