import React from "react";
import logo from "../../assets/whatsapp.png";

const WhatsappHome = () => {
  return (
    <div className="h-full w-full dark:bg-dark_bg_3  border-b-[6px] border-b-green_2">
      <div className="-mt-1.5 w-full h-full flex flex-col gap-y-8 items-center justify-center">
        <img src={logo} alt="" />
        <div className="mt-1 text-center space-y[12px]">
          <h1 className="text-[32px] dark:text-dark_text_4 font-extralight mb-2">
            Whatsapp for Windows
          </h1>
          <p className="text-sm dark:text-dark_text_3">
            Make calls, share your screen and get a faster experience when you
            download the <br />
            Windows app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsappHome;
