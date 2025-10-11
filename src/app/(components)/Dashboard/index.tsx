"use client";

import Image from "next/image";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
      <div className="p-4 rounded-lg shadow-md col-span-2">
        <h2 className="text-sm font-bold">Titulo</h2>
        <p className="text-2xl font-bold">Valor</p>
        <Image src="/prueba.jpg" alt="Imagen" width={500} height={800} />
      </div>
      <div className="p-4 rounded-lg shadow-md col-span-1">
        <h2 className="text-sm font-bold">Titulo</h2>
        <p className="text-2xl font-bold">Valor</p>
      </div>
    </div>
  );
};

export default Dashboard;
