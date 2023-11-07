import React from "react";

const SeenBy = ({ contact }) => {
  return (
    <li className="list-none h-[72px] cursor-pointer hover:dark:bg-dark_bg_2 dark:text-dark_text_1 px-[10px] ">
      <div className="flex items-center gap-x-3 py-[10px]">
        <div className="flex items-center gap-x-3">
          <div className="relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden">
            <img
              src={contact.picture}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full flex flex-col">
            <h1 className="font-bold capitalize flex items-center gap-x-2">
              {contact.name}
            </h1>
            <div>
              <div className="flex items-center gap-x-1 dark:text-dark_text_2">
                <div className="flex-1 items-center gap-x-1">
                  <p>{contact.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom line */}
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
};

export default SeenBy;
