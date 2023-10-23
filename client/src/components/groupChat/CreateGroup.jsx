import React, { useState } from "react";
import ReturnIcon from "./../../assets/svg/Return";
import MultipleSelect from "./MultipleSelect";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "../../axios";

const CreateGroup = ({ setShowGroupMenu }) => {
  const { loggedUser } = useSelector((store) => store.currentUser);
  const [name, setName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSearchUsers = async (e) => {
    try {
      const { data } = await axios.get(`/users/user?search=${e.target.value}`);
      console.log(data);
      if (data.length > 0) {
        let tempArr = [];
        data.forEach((dt) => {
          let temp = {
            value: dt._id,
            label: dt.name,
            picture: dt.picture,
          };
          tempArr.push(temp);
        });
        setSearchResults(tempArr);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="createGroupAnim relative flex0030 h-full z-40 ">
      <div className="mt-5">
        <button
          className="btn w-6 h-6 border"
          onClick={() => setShowGroupMenu(false)}
        >
          <ReturnIcon className="fill-white " />
        </button>

        <div className="mt-4">
          <input
            className="w-full bg-transparent border-b border-green_1 dark:text-dark_text_1 outline-none pl-1"
            required
            type="text"
            placeholder="Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <MultipleSelect
          searchResults={searchResults}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          handleSearchUsers={handleSearchUsers}
        />
      </div>
    </div>
  );
};

export default CreateGroup;
