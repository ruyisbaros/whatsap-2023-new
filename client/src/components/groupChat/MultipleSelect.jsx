import React from "react";
import Select from "react-select";

const MultipleSelect = ({
  searchResults,
  selectedUsers,
  setSelectedUsers,
  handleSearchUsers,
}) => {
  console.log(selectedUsers);
  return (
    <div className="mt-4">
      <Select
        options={searchResults}
        onChange={setSelectedUsers}
        onKeyDown={(e) => handleSearchUsers(e)}
        placeholder="Search users..."
        isMulti
        formatOptionLabel={(user) => (
          <div className="flex items-center gap-1">
            <img src={user.picture} alt={user.label} className="search-feeds" />
            <span className="text-[#222]">{user.label}</span>
          </div>
        )}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            border: "none",
            borderColor: "transparent",
            background: "transparent",
          }),
        }}
      />
    </div>
  );
};

export default MultipleSelect;
