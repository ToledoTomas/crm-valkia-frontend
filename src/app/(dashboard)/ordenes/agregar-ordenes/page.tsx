"use client";

import React from "react";
import Form from "./../_components/Form";

const pageAgregarOrdenes = () => {
  return (
    <div className="m-12">
      <h2 className="text-2xl mb-4">Agregar Nueva Orden</h2>
      <div className="grid grid-cols-3 gap-4">
        <Form />
      </div>
    </div>
  );
};

export default pageAgregarOrdenes;
