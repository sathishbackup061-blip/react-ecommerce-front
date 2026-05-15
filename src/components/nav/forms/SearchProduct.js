import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "antd";

const { Search } = Input;

const SearchProduct = () => {
  const dispatch = useDispatch();

  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  const navigate = useNavigate();

  // input typing
  const handleChange = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: e.target.value },
    });
  };

  // search submit
  const handleSubmit = (value) => {
    navigate(`/shop?${value}`);
  };

  return (
    <div className="form-inline my-2 my-lg-0">
      <Search
        placeholder="Search products"
        value={text}
        onChange={handleChange}
        onSearch={handleSubmit}
        enterButton
        style={{ width: 250,  marginTop: 7 }}
      />
    </div>
  );
};

export default SearchProduct;