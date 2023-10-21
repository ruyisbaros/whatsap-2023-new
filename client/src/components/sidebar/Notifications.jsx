import React from "react";
import NotificationIcon from "../../assets/svg/Notification";
import ArrowIcon from "../../assets/svg/Arrow";
import CloseIcon from "../../assets/svg/Close";

const Notifications = () => {
  return (
    <div className="h-[90px] dark:bg-dark_bg_3 flex items-center p-[13px]">
      <div className="w-full flex items-center justify-between">
        {/* left */}
        <div className="flex items-center gap-x-4">
          <div className="cursor-pointer">
            <NotificationIcon className="dark:fill-blue_1" />
          </div>
          <div className="flex flex-col">
            <span className="textPrimary">Get notified of new messages.</span>
            <span className="textSecondary mt-1 flex items-center gap-1">
              Turn on desktop notifications
              <ArrowIcon className="dark:fill-dark_svg_2 mt-1 cursor-pointer" />
            </span>
          </div>
        </div>
        {/* right */}
        <div>
          <CloseIcon className="dark:fill-dark_svg_2 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
