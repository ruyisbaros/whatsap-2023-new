import React from "react";

const CustomAuthInput = ({ name, type, placeholder, register, error }) => {
  return (
    <div className="mt-8 content-center dark:text-dark_text_1 space-y-1 ">
      <label htmlFor={name} className="text-sm font-bold tracking-wide ml-2">
        {placeholder}
      </label>
      <input
        className="w-full dark:bg-dark_bg_3 text-base py-2 px-4 rounded-lg outline-none"
        type={type}
        placeholder={name}
        name={name}
        {...register(name)}
      />
      {error && <p className="text-red-400 text-sm ml-1">{error}</p>}
    </div>
  );
};

export default CustomAuthInput;
