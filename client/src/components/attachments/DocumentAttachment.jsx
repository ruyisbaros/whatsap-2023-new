import React, { useRef } from "react";
import { toast } from "react-toastify";
import { reduxAddFile } from "../../redux/chatSlice";
import { useDispatch } from "react-redux";
import DocumentIcon from "../../assets/svg/Document";
import { getFileType } from "../../utils/fileTypes";

const DocumentAttachment = () => {
  const dispatch = useDispatch();
  const documentInputRef = useRef(null);

  const handleDocument = (e) => {
    let files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file) {
        if (
          file.type !== "application/pdf" &&
          file.type !== "text/plain" &&
          file.type !== "application/msword" &&
          file.type !== "application/vnd.ms-powerpoint" &&
          file.type !== "application/zip"
        ) {
          files = files.filter((item) => item.name !== file.name);
          toast.error(
            "You can upload pdf, text, doc, powerPoint and zip types!"
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
            reduxAddFile({
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
        className="bg-[#5f66cd] rounded-full"
        onClick={() => documentInputRef.current.click()}
      >
        <DocumentIcon />
      </button>
      <input
        type="file"
        hidden
        multiple
        ref={documentInputRef}
        accept="application/pdf,text/plain,application/msword,application/vnd.ms-powerpoint,application/zip"
        onChange={handleDocument}
      />
    </div>
  );
};

export default DocumentAttachment;
