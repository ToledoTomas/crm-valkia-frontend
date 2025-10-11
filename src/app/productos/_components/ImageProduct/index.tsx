import Image from "next/image";

const ImageProduct = () => {
  return (
    <div className="p-4 mt-4 flex flex-col relative">
      <h2 className="text-xl mb-4">Imagen del producto</h2>
      <Image
        className="rounded-md mb-4"
        src="/prueba.jpg"
        alt="Producto"
        width={600}
        height={600}
      />
      <button className="absolute bottom-32 right-7 mt-2 p-2 rounded-sm bg-sky-200 cursor-pointer hover:bg-sky-300">
        Cambiar imagen
      </button>
    </div>
  );
};

export default ImageProduct;
