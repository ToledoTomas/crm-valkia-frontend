import React from "react";

const pageOrdenes = () => {
  return (
    <div className="m-12 flex flex-row justify-between items-center">
      <h2 className="text-2xl mb-4">Ordenes</h2>
      <button className="mt-2 p-3 rounded-md flex flex-row items-center gap-2 bg-sky-200 cursor-pointer hover:bg-sky-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="feather feather-plus"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
        Nueva Orden
      </button>
    </div>
  );
};

export default pageOrdenes;
