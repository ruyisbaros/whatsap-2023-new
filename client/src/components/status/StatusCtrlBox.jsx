import React from "react";

const StatusCtrlBox = ({ menuRef, setShowStatusCtrlBox, setShowSeeUsers }) => {
  return (
    <div
      ref={menuRef}
      className="absolute right-0 z-50 dark:bg-dark_bg_2 dark:text-dark_text_1 shadow-md w-52"
    >
      <ul>
        <li
          className="list-none py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
          onClick={() => {
            setShowSeeUsers(true);
            setShowStatusCtrlBox(false);
          }}
        >
          <span>Seen By</span>
        </li>
        <li className="list-none py-3 pl-5 cursor-pointer hover:bg-dark_bg_3">
          <span>Delete Story</span>
        </li>
      </ul>
    </div>
  );
};

export default StatusCtrlBox;
