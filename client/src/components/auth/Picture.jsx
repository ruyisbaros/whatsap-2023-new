import React, { useRef } from "react";
import { toast } from "react-toastify";

const Picture = ({ blobPicture, setBlobPicture }) => {
  const inputRef = useRef(null);
  const handlePicture = (e) => {
    let pic = e.target.files[0];
    if (pic) {
      if (
        pic.type !== "image/jpeg" &&
        pic.type !== "image/png" &&
        pic.type !== "image/gif" &&
        pic.type !== "image/webp"
      ) {
        toast.error("You can upload jpeg, png or webp types!");
        return;
      } else if (pic.size > 1024 * 1024 * 5) {
        toast.error("Max 5mb size allowed!");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(pic);
      reader.onload = (e) => {
        setBlobPicture(e.target.result);
      };
    }
  };
  const handleChangePic = () => {
    setBlobPicture("");
    inputRef.current.click();
  };
  return (
    <div className="mt-8 content-center dark:text-dark_text_1 space-y-1">
      <label htmlFor="picture" className="text-sm font-bold tracking-wide">
        Picture (optional)
      </label>
      {blobPicture ? (
        <div>
          <img
            className="w-20 h-20 object-cover rounded-md shadow-md "
            src={blobPicture}
            alt="profile"
          />
          <div
            className="w-20 mt-2 py-1 text-red-600 dark:bg-dark_bg_3 rounded-md text-xs cursor-pointer flex items-center justify-center"
            onClick={handleChangePic}
          >
            Remove
          </div>
        </div>
      ) : (
        <div
          className="w-full h-12 dark:bg-dark_bg_3 rounded-md cursor-pointer font-bold flex items-center justify-center"
          onClick={() => inputRef.current.click()}
        >
          Upload Picture
        </div>
      )}
      <input
        type="file"
        name="picture"
        id="picture"
        hidden
        ref={inputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={handlePicture}
      />
    </div>
  );
};

export default Picture;
