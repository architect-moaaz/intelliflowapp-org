import React from "react";
// import "./styles.css";
import "./CommonTablePagination.css"
import NextArrow from "../../../assets/datagridIcons/NextArrow";
import PrevArrow from "../../../assets/datagridIcons/PrevArrow";

const Pagination = (props) => {
  const handlePagination = (current) => {
    props.pagination(current);
    // console.log("cr", current)
  };

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center'}}>
       
        <ul className="pagination-button-container">
          <li className="page-item">
            <a
            id="commonTablePagination-pagination"
              className={`page-link ${
                props.current === 1 ? "disabled" : props.current > 1 ? "" : ""
              }`}
              
              onClick={() => handlePagination(props.current - 1)}
            >
              <PrevArrow fillColor={false ? "#0D3C84" : "#C4CDD5"}  />
            </a>
          </li>
          {props.total < 7 ? (
            <>
              {Array.apply(0, Array(props.total)).map((arr, i) => (
                <>
                  <li
                    key={i}
                    className={`page-item ${
                      props.current === i + 1 ? "active" : ""
                    }`}
                  >
                    <a
                    id="commonTablePagination-page-link-add"
                      className="page-link"
                      
                      onClick={() => handlePagination(i + 1)}
                    >
                      {i + 1}
                    </a>
                  </li>
                </>
              ))}
            </>
          ) : props.current % 5 >= 0 &&
            props.current > 4 &&
            props.current + 2 < props.total ? (
            <>
              <li className="page-item">
                <a
                  className="page-link"
                  id="commonTablePagination-page-link-current"
                  onClick={() => handlePagination(1)}
                >
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link disabled" >
                  ...
                </a>
              </li>
              <li className="page-item">
                <a
                  className="page-link"
                  id="commonTablePagination-page-link-sub"
                  onClick={() => handlePagination(props.current - 1)}
                >
                  {props.current - 1}
                </a>
              </li>
              <li className="page-item active">
                <a
                  className="page-link"
                  id="commonTablePagination-page-active"
                  onClick={() => handlePagination(props.current)}
                >
                  {props.current}
                </a>
              </li>
              <li className="page-item">
                <a
                  className="page-link"
                  id="commonTablePagination-page-active-add"
                  onClick={() => handlePagination(props.current + 1)}
                >
                  {props.current + 1}
                </a>
              </li>
              <li className="page-item">
                <a className="page-link disabled" >
                  ...
                </a>
              </li>
              <li className="page-item">
                <a
                  className="page-link"
                  id="commonTablePagination-page-total"
                  onClick={() => handlePagination(props.total)}
                >
                  {props.total}
                </a>
              </li>
            </>
          ) : props.current % 5 >= 0 &&
            props.current > 4 &&
            props.current + 2 >= props.total ? (
            <>
              <li className="page-item">
                <a
                  className="page-link"
                  id="commonTablePagination-handlePagination"
                  onClick={() => handlePagination(1)}
                >
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link disabled" >
                  ...
                </a>
              </li>
              <li
                className={`page-item ${
                  props.current === props.total - 3 ? "active" : ""
                }`}
              >
                <a
                  className="page-link"
                  id="commonTablePagination-decreaseByThree"
                  onClick={() => handlePagination(props.total - 3)}
                >
                  {props.total - 3}
                </a>
              </li>
              <li
                className={`page-item ${
                  props.current === props.total - 2 ? "active" : ""
                }`}
              >
                <a
                  className="page-link"
                  id="commonTablePagination-DecreaseByTwo"
                  onClick={() => handlePagination(props.total - 2)}
                >
                  {props.total - 2}
                </a>
              </li>
              <li
                className={`page-item ${
                  props.current === props.total - 1 ? "active" : ""
                }`}
              >
                <a
                  className="page-link"
                  id="commonTablePagination-decreaseByOne"
                  onClick={() => handlePagination(props.total - 1)}
                >
                  {props.total - 1}
                </a>
              </li>
              <li
                className={`page-item ${
                  props.current === props.total ? "active" : ""
                }`}
              >
                <a
                  className="page-link"
                  id="commonTablePagination-total"
                  onClick={() => handlePagination(props.total)}
                >
                  {props.total}
                </a>
              </li>
            </>
          ) : (
            <>
              {Array.apply(0, Array(5)).map((arr, i) => (
                <>
                  <li
                    className={`page-item ${
                      props.current === i + 1 ? "active" : ""
                    }`}
                    key={i}
                  >
                    <a
                      className="page-link"
                      id="commonTablePagination-increment"
                      onClick={() => handlePagination(i + 1)}
                    >
                      {i + 1}
                    </a>
                  </li>
                </>
              ))}
              <li className="page-item">
                <a className="page-link disabled" >
                  ...
                </a>
              </li>
              <li className="page-item">
                <a
                  className="page-link"
                  id="commonTablePagination-totalPage"
                  onClick={() => handlePagination(props.total)}
                >
                  {props.total}
                </a>
              </li>
            </>
          )}
          <li className="page-item">
            <a
              className={`page-link ${
                props.current === props.total
                  ? "disabled"
                  : props.current < props.total
                  ? ""
                  : ""
              }`}
              id="commonTablePagination-currentIncrement"
              onClick={() => handlePagination(props.current + 1)}
            >
              <NextArrow fillColor={false ? "#0D3C84" : "#C4CDD5"} />
            </a>
          </li>
        </ul>
     
   
    </div>
  );
};

export default Pagination;
