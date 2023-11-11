import React, { useCallback, useState } from "react";
import SideBarHeader from "./SideBarHeader";
import Notifications from "./Notifications";
import SearchBar from "./SearchBar";
import Conversations from "./Conversations";
import SearchResults from "./SearchResults";
//import { useSelector } from "react-redux";

const SidebarLeft = ({
  setShowStatusInfo,
  statusCondition,
  setStatusCondition,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  //console.log(searchResults);
  return (
    <div className="flex0040 w-[40%] lg:flex0030 lg:w-[30%] h-full overflow-hidden select-none borderC">
      <SideBarHeader
        setShowStatusInfo={setShowStatusInfo}
        statusCondition={statusCondition}
        setStatusCondition={setStatusCondition}
      />
      <Notifications />
      <SearchBar
        searchResults={searchResults.length}
        setSearchResults={setSearchResults}
      />
      {searchResults.length > 0 ? (
        <SearchResults searchResults={searchResults} />
      ) : (
        <Conversations />
      )}
    </div>
  );
};

export default SidebarLeft;
