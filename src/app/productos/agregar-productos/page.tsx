"use client";

import React from "react";
import Form from "./../_components/Form";
import ImageProduct from "./../_components/ImageProduct";

const pageAgregarProductos = () => {
  return (
    <div className="m-12">
      <h2 className="text-2xl mb-4">Productos</h2>
      <div className="grid grid-cols-3 gap-4">
        <Form />
        <ImageProduct />
      </div>
    </div>
  );
};

export default pageAgregarProductos;
