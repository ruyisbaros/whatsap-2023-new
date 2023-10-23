import React from "react";
import Select from "react-select";

const MultipleSelect = ({
  searchResults,
  selectedUsers,
  setSelectedUsers,
  handleSearchUsers,
}) => {
  return (
    <div className="mt-4">
      <Select
        options={searchResults}
        onChange={setSelectedUsers}
        onKeyDown={(e) => handleSearchUsers(e)}
        placeholder="Search users..."
        isMulti
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
