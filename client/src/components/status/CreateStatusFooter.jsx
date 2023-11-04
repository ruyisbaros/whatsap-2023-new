import React, { useRef, useState } from "react";
import { CloseIcon } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { MdSendTimeExtension } from "react-icons/md";
import {
  reduxAddToStatusFiles,
  reduxMakeStatusFilesEmpty,
  reduxRemoveStatusFile,
  reduxSetMyStatus,
} from "../../redux/statusSlicer";
import { getFileType } from "../../utils/fileTypes";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import axios from "../../axios";
import { newStatusCreated } from "../../SocketIOConnection";

const CreateStatusFooter = ({
  activeIndex,
  setActiveIndex,
  setStatusText,
  statusText,
  setShowCreateStatus,
}) => {
  const dispatch = useDispatch();
  const documentInputRef = useRef();
  const [status, setStatus] = useState(false);
  const { statusFiles } = useSelector((store) => store.statuses);
  const { targets } = useSelector((store) => store.messages);
  const { loggedUser } = useSelector((store) => store.currentUser);

  const handleAddDocument = (e) => {
    let files = Array.from(e.target.files);

    files.forEach((file) => {
      //console.log(file.type.split("/")[0]);
      if (file) {
        if (
          file.type !== "image/jpeg" &&
          file.type !== "image/png" &&
          file.type !== "image/gif" &&
          file.type !== "image/webp" &&
          file.type !== "video/mp4" &&
          file.type !== "video/webm"
        ) {
          files = files.filter((item) => item.name !== file.name);
          toast.error(
            "You can upload jpeg, gif, png, webp, mp4 and webm types!"
          );
          return;
        } else if (file.size > 1024 * 1024 * 20) {
          files = files.filter((item) => item.name !== file.name);
          toast.error("Max 5mb size allowed!");
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          dispatch(
            reduxAddToStatusFiles({
              file: file,
              data: e.target.result,
              type: getFileType(file.type),
            })
          );
        };
      }
    });
  };
  const handleCreateStatus = async () => {
    try {
      setStatus(true);
      const { data } = await axios.post("/status/create", {
        text: statusText,
        files: statusFiles,
        targets: targets.filter((tr) => tr._id !== loggedUser.id),
      });
      console.log(data);
      dispatch(reduxSetMyStatus(data));
      setStatus(false);
      setShowCreateStatus(false);
      setStatusText("");
      dispatch(reduxMakeStatusFilesEmpty());
      //Emit socket
      let targetUsers = targets.filter((tr) => tr._id !== loggedUser.id);
      newStatusCreated(targetUsers, data);
    } catch (error) {
      setStatus(false);
      toast.error("Something went wrong! Try again");
    }
  };
  const handleRemoveThumbnail = (index) => {
    setActiveIndex(0);
    dispatch(reduxRemoveStatusFile(index));
  };
  return (
    <div className="w-[90%] h-[20%] flex items-center justify-between mt-2 border-t dark:border-dark_border_2">
      <span></span>
      <div className="flex items-center gap-x-4 mt-2">
        {statusFiles.length > 0 &&
          statusFiles.map((file, i) => (
            <div
              key={i}
              className={`fileThumbnail w-14 h-14 border dark:border-white rounded-md cursor-pointer relative ${
                activeIndex === i
                  ? "border-[3px] p-[1px] !border-green_1 transition-all duration-[0.3s]"
                  : ""
              }`}
              onClick={() => setActiveIndex(i)}
            >
              {file.type === "IMAGE" ? (
                <img
                  src={file.data}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : file.type === "VIDEO" ? (
                <video
                  src={file.data}
                  className="w-full h-full object-cover"
                ></video>
              ) : (
                <img
                  src={`/file/${file.type}.png`}
                  alt=""
                  className="w-8 h-10 mt-1.5 ml-2.5 object-contain"
                />
              )}
              {/* Remove media */}
              <div
                className="remove_media hidden"
                onClick={() => handleRemoveThumbnail(i)}
              >
                <CloseIcon className="dark:fill-red-600 w-4 h-4 absolute z-20 right-0 top-0 cursor-pointer" />
              </div>
            </div>
          ))}
        {statusFiles.length > 0 && (
          <div
            className="w-14 h-14 border dark:border-white rounded-md flex items-center 
            justify-center cursor-pointer"
          >
            <span
              className="rotate-45"
              onClick={() => documentInputRef.current.click()}
            >
              <CloseIcon className="dark:fill-dark_svg_1" />
            </span>
            <input
              type="file"
              hidden
              multiple
              ref={documentInputRef}
              accept="application/pdf,text/plain,application/msword,application/vnd.ms-powerpoint,application/zip,image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
              onChange={handleAddDocument}
            />
          </div>
        )}
      </div>
      <div
        className="bg-green_1 w-14 h-14 mt-2 rounded-full flex items-center justify-center
        cursor-pointer"
        onClick={handleCreateStatus}
      >
        {status ? (
          <ClipLoader color="#e9edef" size={25} />
        ) : (
          <MdSendTimeExtension color="white" size={25} />
        )}
      </div>
    </div>
  );
};

export default CreateStatusFooter;
