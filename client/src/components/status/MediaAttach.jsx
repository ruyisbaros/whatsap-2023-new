import React, { useRef } from "react";
import { BsImage } from "react-icons/bs";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getFileType } from "../../utils/fileTypes";
import { reduxAddToStatusFiles } from "../../redux/statusSlicer";

const MediaAttach = () => {
  const dispatch = useDispatch();
  const photoInputRef = useRef(null);

  const handleImage = (e) => {
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
  return (
    <div>
      <button
        type="button"
        className="w-14 h-14 flex items-center justify-center bg-[#008069] rounded-full"
        onClick={() => photoInputRef.current.click()}
      >
        <BsImage size={25} color="white" />
      </button>
      <input
        type="file"
        multiple
        hidden
        ref={photoInputRef}
        accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
        onChange={handleImage}
      />
    </div>
  );
};

export default MediaAttach;
