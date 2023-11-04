import React from "react";

const CreateStatusText = ({ setStatusText, statusText }) => {
  return (
    <div className="w-[90%] mx-auto h-[15%] flex items-center justify-center">
      <input
        type="text"
        className="w-[60%] outline-none focus:border-[#008069] focus:border-[2px] dark:bg-dark_border_2 h-[50px] rounded-lg pl-4 text-gray-300"
        placeholder="TYPE STATUS..."
        value={statusText}
        onChange={(e) => setStatusText(e.target.value)}
      />
    </div>
  );
};

export default CreateStatusText;
