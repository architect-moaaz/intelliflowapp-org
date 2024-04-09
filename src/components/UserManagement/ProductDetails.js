import React from "react";
const ProductDetails = (props) => {
  let customClasses = "";
  if (props.product.checked) {
    customClasses = "checked";
  }
  // console.log("product.checked", props.product);
  return (
    <div
      id="user-product-details"
      className={`product-details ${customClasses}`}
      onClick={() => props.handleChange(props.product.menuID)}
    >
      <p className="mb-0 secondaryColor">{props.product.menuName}</p>
    </div>
  );
};

export default ProductDetails;
