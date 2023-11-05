import React, { useEffect, useState } from "react";
import { ReturnIcon } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { reduxRESetViewedStatus } from "../../redux/statusSlicer";

const ViewStatus = ({ setShowViewStatus }) => {
  const dispatch = useDispatch();
  const { viewedStatus } = useSelector((store) => store.statuses);
  const [activeIndex, setActiveIndex] = useState(0);

  //console.log(activeIndex);

  const handleIndexR = () => {
    if (viewedStatus?.files.length - 1 === activeIndex) {
      setActiveIndex(0);
    } else {
      setActiveIndex((prev) => prev + 1);
    }
  };
  const handleIndexL = () => {
    if (activeIndex === 0) {
      setActiveIndex(viewedStatus?.files.length - 1);
    } else {
      setActiveIndex((prev) => prev - 1);
    }
  };
  useEffect(() => {
    let timer = setTimeout(() => {
      if (viewedStatus?.files?.length - 1 !== activeIndex) {
        setActiveIndex(activeIndex + 1);
      } else if (viewedStatus?.files?.length - 1 >= activeIndex) {
        setShowViewStatus(false);
        dispatch(reduxRESetViewedStatus());
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeIndex, viewedStatus]);

  const AnimatedBar = () => {
    return (
      <div className="animated_line">
        <span></span>
      </div>
    );
  };
  useEffect(() => {
    AnimatedBar();
  }, [activeIndex]);
  return (
    <div className="status-full w-full h-screen dark:bg-dark_bg_1 overflow-hidden">
      <div className="close_status">
        <button
          className="btn w-6 h-6"
          onClick={() => setShowViewStatus(false)}
        >
          <ReturnIcon className="fill-white " />
        </button>
        <span className="text-white font-bold text-[20px]"></span>
      </div>
      <div className="w-full h-full  flex items-center justify-center relative">
        <div className="relative w-[70%] h-[60%] ">
          <button className="myStatus-left" onClick={handleIndexL}>
            <FaChevronLeft color="#222" size={35} />
          </button>
          <div className="w-full h-full flex overflow-hidden">
            {viewedStatus?.files.length > 0 && (
              <div className="w-full h-full">
                {viewedStatus?.files[activeIndex].type === "IMAGE" ? (
                  <>
                    <img
                      src={viewedStatus?.files[activeIndex].url}
                      alt=""
                      className="w-full h-[90%] object-cover"
                    />
                    <span className="w-full dark:text-dark_text_4 text-[18px] mt-2 text-center inline-block">
                      {viewedStatus?.text}
                    </span>
                  </>
                ) : (
                  <>
                    <video
                      src={viewedStatus?.files[activeIndex].url}
                      controls
                      className="w-full h-[90%] object-cover"
                    />
                    <span className="w-full dark:text-dark_text_4 text-[18px] mt-2 text-center inline-block">
                      {viewedStatus?.text}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <button className="myStatus-right" onClick={handleIndexR}>
            <FaChevronRight color="#222" size={35} />
          </button>
          <div className="view-lines">
            {viewedStatus?.files.length > 0 &&
              Array.from({ length: viewedStatus?.files.length }).map(
                (el, idx) => (
                  <span
                    style={{
                      background: activeIndex === idx ? "#008069" : "#fff",
                    }}
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                  ></span>
                )
              )}
          </div>
          <AnimatedBar />
        </div>
      </div>
    </div>
  );
};

export default ViewStatus;
