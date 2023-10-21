import React, { useState } from "react";
import ReturnIcon from "../../assets/svg/Return";
import SearchIcon from "../../assets/svg/Search";
import FilterIcon from "../../assets/svg/FilterIcon";
import axios from "../../axios";
import { toast } from "react-toastify";

const SearchBar = ({ searchResults, setSearchResults }) => {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = async (e) => {
    if (search && e.key === "Enter") {
      try {
        const { data } = await axios.get(
          `/message/chat_users?search=${search}`
        );

        //console.log(data);
        setSearchResults(data);
        setSearch("");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      setSearchResults([]);
    }
  };
  //console.log(search);
  return (
    <div className="h-[49px] py-1 relative">
      <div className="px-[10px]">
        <div className="flex items-center gap-x-2 ">
          <div className="w-full dark:bg-dark_bg_2 rounded-lg pl-2 flex items-center">
            {show || searchResults > 0 ? (
              <span
                className="w-8 flex items-center justify-center rotateAnimation cursor-pointer"
                onClick={() => setSearchResults([])}
              >
                <ReturnIcon className="fill-green_1 w-5" />
              </span>
            ) : (
              <span className="w-8 flex items-center justify-center">
                <SearchIcon className="dark:fill-dark_svg_2 w-5" />
              </span>
            )}
            <input
              type="text"
              placeholder="Search or start a new chat "
              className="input"
              onFocus={() => setShow(true)}
              onBlur={() => searchResults === 0 && setShow(false)}
              onKeyDown={handleSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn">
            <FilterIcon className="dark:fill-dark_svg_2" />
          </button>
        </div>
        {/*  {searchResults && <div className="search_results"></div>} */}
      </div>
    </div>
  );
};

export default SearchBar;
