import React from "react";
import { ArrowIcon, ContactIcon, LockIcon } from "../../assets/svg";
import { AddContactIcon } from "../../assets/svg/AddContact";

const Header = () => {
  return (
    <header className="absolute t-0 w-full z30">
      <div className="flex items-center justify-between p-1">
        <button className="btn">
          <span className="rotate-180 scale-150">
            <ArrowIcon className="fill-white" />
          </span>
        </button>
        <p className="flex items-center">
          <LockIcon className="fill-white scale-75" />
          <span className="text-xs text-white">End-to-End Encrypted</span>
        </p>
        <button className="btn">
          <AddContactIcon className="fill-white" />
        </button>
      </div>
    </header>
  );
};

export default Header;
