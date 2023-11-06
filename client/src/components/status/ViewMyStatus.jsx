import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";

const ViewMyStatus = ({ setShowMyStatus }) => {
  const { myStatus } = useSelector((store) => store.statuses);
  const [activeIndex, setActiveIndex] = useState(0);
  //console.log(activeIndex);

  const handleIndexR = () => {
    if (myStatus.files.length - 1 === activeIndex) {
      setActiveIndex(0);
    } else {
      setActiveIndex((prev) => prev + 1);
    }
  };
  const handleIndexL = () => {
    if (activeIndex === 0) {
      setActiveIndex(myStatus.files.length - 1);
    } else {
      setActiveIndex((prev) => prev - 1);
    }
  };
  useEffect(() => {
    let timer = setTimeout(() => {
      if (myStatus.files.length - 1 !== activeIndex) {
        setActiveIndex(activeIndex + 1);
      } else if (myStatus.files.length - 1 >= activeIndex) {
        setShowMyStatus(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeIndex, myStatus.files.length]);

  console.log("document: ", new Date(myStatus.createdAt).getTime());
  console.log("today: ", new Date().getTime());
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
    <div className="my-status w-[70%] h-full dark:bg-dark_bg_1 overflow-hidden">
      <div className="close_status h-[60px]">
        <button
          className="btn w-6 h-6 ml-5"
          onClick={() => setShowMyStatus(false)}
        >
          <AiOutlineCloseCircle color="red" size={25} />
        </button>
        <span className="text-white font-bold text-[20px]">Your Story</span>
      </div>
      <div className="w-full h-full  flex items-center justify-center relative">
        <div className="relative w-[70%] h-[60%] ">
          <button className="myStatus-left" onClick={handleIndexL}>
            <FaChevronLeft color="#222" size={35} />
          </button>
          <div className="w-full h-full flex overflow-hidden">
            {myStatus.files.length > 0 && (
              <div className="w-full h-full">
                {myStatus.files[activeIndex].type === "IMAGE" ? (
                  <>
                    <img
                      src={myStatus.files[activeIndex].url}
                      alt=""
                      className="w-full h-[90%] object-contain"
                    />
                    <span className="w-full dark:text-dark_text_4 text-[18px] mt-2 text-center inline-block">
                      {myStatus.text}
                    </span>
                  </>
                ) : (
                  <>
                    <video
                      src={myStatus.files[activeIndex].url}
                      controls
                      className="w-full h-[90%] object-cover"
                    />
                    <span className="w-full dark:text-dark_text_4 text-[18px] mt-2 text-center inline-block">
                      {myStatus.text}
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
            {myStatus.files.length > 0 &&
              Array.from({ length: myStatus.files.length }).map((el, idx) => (
                <span
                  style={{
                    background: activeIndex === idx ? "#008069" : "#fff",
                  }}
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                ></span>
              ))}
          </div>
          <AnimatedBar />
        </div>
      </div>
    </div>
  );
};

export default ViewMyStatus;
