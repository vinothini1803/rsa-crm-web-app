import React, { useEffect } from "react";
import "./components.less";
import { SearchIcon } from "../../utills/imgConstants";
import { useSelector } from "react-redux";
import { SearchCall } from "../../../store/slices/searchSlice";
import { useLocation } from "react-router";
const Search = ({ onChange, expand, placeholder, className, value }) => {
  const reduxSearchValue = useSelector(SearchCall) || "";
  const { pathname } = useLocation();
  
  // Use prop value if explicitly provided (for case list pages with local state)
  // Otherwise, use original behavior: Redux for cases/tds pages, uncontrolled for others
  const inputProps = value !== undefined 
    ? { value } 
    : (pathname.includes("cases") || pathname.includes("tds")
      ? { value: reduxSearchValue }
      : {});

  return (
    <div
      className={`${expand == true ? "search permission" : "search"} ${
        className ?? className
      }`}
    >
      <button className="search-btn" type="button">
        <img src={SearchIcon} />
      </button>
      <input
        type="search"
        className={expand == true ? "permission-search-input" : "searchinput"}
        aria-label="search"
        placeholder={placeholder ?? "Search"}
        onChange={onChange}
        {...inputProps}
      ></input>
    </div>
  );
};

export default Search;
