import React, { useState } from "react";
import ReturnIcon from "./../../assets/svg/Return";
import MultipleSelect from "./MultipleSelect";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "../../axios";
import { ClipLoader } from "react-spinners";
import SendIcon from "./../../assets/svg/Send";
import { ValidIcon } from "./../../assets/svg/Valid";
import { reduxAddMyConversations } from "../../redux/chatSlice";
import { createNewGroup } from "../../SocketIOConnection";

const CreateGroup = ({ setShowGroupMenu }) => {
  const dispatch = useDispatch();
  const { loggedUser } = useSelector((store) => store.currentUser);
  const [name, setName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [status, setStatus] = useState(false);

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

  const createGroupHandler = async () => {
    if (selectedUsers.length > 0) {
      let users = selectedUsers.map((usr) => usr.value);
      try {
        setStatus(true);
        const { data } = await axios.post("/conversation/create_group", {
          name,
          users,
        });
        setStatus(false);
        console.log(data);
        setShowGroupMenu(false);
        dispatch(reduxAddMyConversations(data));
        //Socket emit group participants
        createNewGroup(data, loggedUser._id);
      } catch (error) {
        setStatus(false);
        toast.error(error.response.data.message);
      }
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
            className="w-full bg-transparent border-b border-green_1 dark:text-white outline-none pl-1"
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
      <button
        className="btn absolute max-h-10 bottom-1/3 left-1/2 -translate-x-1/2 bg-green_1 scale-150 hover:bg-green-500"
        disabled={selectedUsers.length === 0}
        onClick={createGroupHandler}
      >
        {status ? (
          <ClipLoader color="#e9edef" size={25} />
        ) : (
          <ValidIcon className="dark:fill-white mt-2 w-full h-full" />
        )}
      </button>
    </div>
  );
};

export default CreateGroup;
