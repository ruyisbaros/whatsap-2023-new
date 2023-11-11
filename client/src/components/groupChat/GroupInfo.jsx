import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "./../../assets/svg/Close";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidPencil, BiSolidDislike } from "react-icons/bi";
import {
  AiOutlineCamera,
  AiFillStar,
  AiFillBell,
  AiFillLock,
  AiOutlineSearch,
} from "react-icons/ai";
import { MdArrowForwardIos } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";

import { makeCapital } from "../../utils/helpers";
import moment from "moment";

const GroupInfo = ({ setShowGroupInfo }) => {
  const fotoInputRef = useRef(null);
  const dispatch = useDispatch();
  const { activeConversation, profileFiles } = useSelector(
    (store) => store.messages
  );
  const { loggedUser } = useSelector((store) => store.currentUser);
  const [isMuted, setIsMuted] = useState(false);
  //console.log(isMuted);
  return (
    <div className="group-info h-[95%] pt-[19px]">
      <div className="relative w-full h-full">
        <div className="group_main scrollBar">
          <div className="group_header">
            <span
              className="cursor-pointer"
              onClick={() => setShowGroupInfo(false)}
            >
              <CloseIcon className="dark:fill-red-600" />
            </span>
            <p className="header-info">Group info</p>
          </div>
          <div className="group_box">
            <div className="change_icon">
              <img
                src={activeConversation?.picture}
                alt="group "
                className="group_img"
              />
              <div className="cover_img">
                <span>
                  <AiOutlineCamera size={20} color="#ddd" />
                </span>
                <span className="cover_img-ic">CHANGE GROUP ICON</span>
                <input ref={fotoInputRef} type="file" />
              </div>
            </div>
            <div className="group_gen-info">
              <div className="group_name">
                {activeConversation?.name}
                <span>
                  <BiSolidPencil size={18} />
                </span>
              </div>
              <div className="group_parts">
                Group . {activeConversation?.users.length} participants
              </div>
            </div>
          </div>
          <div className="group_media">
            <div className="group_media_header">
              Group created by {makeCapital(activeConversation?.admin?.name)},
              on {moment(activeConversation?.updatedAt).format("DD/MM/YYYY")}
            </div>
            <div className="group_media_docs">Media, links and docs</div>
            <div className="group_media_imgs">
              {profileFiles.length > 0 &&
                profileFiles.map((file) =>
                  file.type === "IMAGE" ? (
                    <img
                      key={file.public_id}
                      src={file.url}
                      alt="file"
                      className="profile_files"
                    />
                  ) : file.type === "VIDEO" ? (
                    <video
                      key={file.public_id}
                      src={file.url}
                      alt="file"
                      className="profile_files"
                    />
                  ) : (
                    <img
                      src={`/file/${file.type}.png`}
                      alt=""
                      className="profile_files"
                    />
                  )
                )}
            </div>
          </div>
          <div className="group_settings">
            <div className="group_settings-p1">
              <span>
                <AiFillStar size={18} color="#222" />
              </span>
              <span className="star-text">Starred messages</span>
              <span>
                <MdArrowForwardIos size={18} color="#222" />
              </span>
            </div>
            <div className="group_settings-p2">
              <span>
                <AiFillBell size={18} color="#222" />
              </span>
              <span className="star-text">Mute notifications</span>
              <p
                className="mute-nots"
                onClick={() => setIsMuted((prev) => !prev)}
              >
                <span className={isMuted ? "r0" : "l0"}></span>
              </p>
            </div>
            <div className="group_settings-p3">
              <span>
                <AiFillLock size={18} color="#222" />
              </span>
              <div className="encrypt">
                <p>Encryption</p>
                <span>
                  Messages are end-to-end encrypted. Click to learn more
                </span>
              </div>
            </div>
          </div>
          <div className="group_participants">
            <div className="group_participants-header">
              <span className="star-text">
                {activeConversation?.users.length} participants
              </span>
              <span>
                <AiOutlineSearch size={18} color="#222" />
              </span>
            </div>
            <div className="group_participants-users">
              {activeConversation.users.length > 0 &&
                activeConversation.users.map((usr) => (
                  <div key={usr._id} className="usr-box">
                    <div className="usr-img">
                      <img src={usr.picture} alt="" />
                    </div>
                    <div className="usr-info">
                      <p className="usr-name">
                        <span className="usr-name-1">
                          {makeCapital(usr.name)}
                        </span>
                        {usr._id === activeConversation.admin._id && (
                          <span className="usr-name-2">Group Admin</span>
                        )}
                      </p>
                      <p className="usr-status">{usr.status}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="group_exit">
            <div className="exit-1">
              <span className="exit-1a">
                <IoExitOutline size={20} color="#ea0038" />
              </span>
              <span className="exit-1b">Exit group</span>
            </div>
            <div className="exit-1">
              <span className="exit-1a">
                <BiSolidDislike size={20} color="#ea0038" />
              </span>
              <span className="exit-1b">Report group</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
