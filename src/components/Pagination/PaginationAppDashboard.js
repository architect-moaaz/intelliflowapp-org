import React from "react";
import ReactPaginate from "react-paginate";
import { paginationPrevArrow, paginationNextArrow } from "./../../assets/index";
import "./CommonPagination.css";

const PaginationAppDashboard = ({ pageCount, setOffset, offset }) => {
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const newOffset = selectedPage + 1;
    // setOffset(selectedPage + 1);
    setOffset(newOffset);
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
      initialPage={offset - 1}
      forcePage={offset - 1}
    />
  );
};

export default PaginationAppDashboard;
