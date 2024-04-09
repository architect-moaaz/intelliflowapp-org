import React from "react";

const ProductItem = ({ product, handleChange }) => (
  <div className="">
    <input
      
      type="checkbox"
      className=""
      id={`customCheck1-${product.id}`}
      checked={product.checked}
      onChange={() => handleChange(product.id)}
    />
    <label
      id="product-item-name"
      className="custom-control-label secondaryColor"
      htmlFor={`customCheck1-${product.id}`}
    >
      {product.name}
    </label>
  </div>
);

export default ProductItem;