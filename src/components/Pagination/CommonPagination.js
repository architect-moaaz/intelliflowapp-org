import React from "react";
import ReactPaginate from "react-paginate";
import { paginationPrevArrow, paginationNextArrow } from "./../../assets/index";
import "./CommonPagination.css";

const CommonPagination = ({ pageCount, setOffset }) => {
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage + 1);
  };

  return (
    <ReactPaginate
      previousLabel={<img src={paginationPrevArrow} />}
      nextLabel={<img src={paginationNextArrow} />}
      breakLabel={"..."}
      breakClassName={"break-me"}
      pageCount={pageCount}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      onPageChange={handlePageClick}
      containerClassName={"pagination"}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"}
    />
  );
};

export default CommonPagination;
