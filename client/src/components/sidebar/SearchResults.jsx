import React from "react";
import Contacts from "./Contacts";

const SearchResults = ({ searchResults }) => {
  return (
    <div className="conversations scrollBar overflow-x-hidden">
      <div>
        {/* Heading */}
        <div className="flex flex-col px-8 pt-8">
          <h1 className="font-extralight text-md text-green_2">Contacts</h1>
          <span className="w-full mt-4 ml-10 border-b dark:border-b-dark_border_1"></span>
        </div>
        {/* Results */}
        <ul>
          {searchResults.map((res) => (
            <Contacts key={res._id} contact={res} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchResults;
