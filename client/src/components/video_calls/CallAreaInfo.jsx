import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { makeCapital } from "../../utils/helpers";

const CallAreaInfo = ({ name }) => {
  const [callSeconds, setCallSeconds] = useState(0);
  const [callMinutes, setCallMinutes] = useState(0);
  const { callAccepted, callRejected, videoScreen, current } = useSelector(
    (store) => store.callStatuses
  );
  useEffect(() => {
    let timer;
    const setSec = () => {
      setCallSeconds((prev) => prev + 1);
      timer = setTimeout(setSec, 1000);
    };
    if (current === "enabled") {
      setSec();
    }
    return () => clearTimeout(timer);
  }, [current]);
  console.log(callSeconds);
  return (
    <div className="absolute top-12 z40 w-full p-1">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-y-1">
          <h1 className="text-white text-lg capitalize">
            <b>{name}</b>
          </h1>
          {!callAccepted && !callRejected && videoScreen ? (
            <span className="text-dark_text_1 text-xs ringAnim">
              Ringing...
            </span>
          ) : !callAccepted && callRejected && videoScreen ? (
            <span className="text-dark_text_1 text-xl mt-4 ">
              {`${makeCapital(name)} is busy now. Please call later`}
            </span>
          ) : (
            <></>
          )}
        </div>
        {current === "enabled" ? (
          <div
            className={`text-dark_text_2 ${
              callSeconds !== 0 ? "block" : "hidden"
            }`}
          >
            {parseInt(callSeconds / 3600 >= 0) ? (
              <>
                <span>
                  {parseInt(callSeconds / 3600).toString().length < 2
                    ? "0" + parseInt(callSeconds / 3600)
                    : parseInt(callSeconds / 3600)}
                </span>
                <span>:</span>
              </>
            ) : null}
            <span>
              {parseInt(callSeconds / 60).toString().length < 2
                ? "0" + parseInt(callSeconds / 60)
                : parseInt(callSeconds / 60)}
            </span>
            <span>:</span>
            <span>
              {(callSeconds % 60).toString().length < 2
                ? "0" + (callSeconds % 60)
                : callSeconds % 60}
            </span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CallAreaInfo;
