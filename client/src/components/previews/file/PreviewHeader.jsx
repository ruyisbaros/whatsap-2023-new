import React from "react";
import CloseIcon from "../../../assets/svg/Close";
import { useDispatch, useSelector } from "react-redux";
import { reduxMakeFilesEmpty } from "../../../redux/chatSlice";

const PreviewHeader = ({ activeIndex }) => {
  const dispatch = useDispatch();
  const { files } = useSelector((store) => store.messages);
  const closePreview = () => {
    dispatch(reduxMakeFilesEmpty());
  };
  return (
    <div className="w-full ">
      <div className="w-full flex items-center justify-between">
        <div className="translate-x-4 cursor-pointer" onClick={closePreview}>
          <CloseIcon className="dark:fill-dark_svg_1" />
        </div>
        <h1 className="dark:text-dark_text_1 text-[15px]">
          {files[activeIndex]?.file?.name}
        </h1>
        <span></span>
      </div>
    </div>
  );
};

export default PreviewHeader;
