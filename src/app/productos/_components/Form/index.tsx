const Form = () => {
  return (
    <div className="p-4 mt-4 col-span-2">
      <form className="grid grid-cols-2 gap-4" action="#">
        <div className="flex flex-col mb-4">
          <label htmlFor="titulo">Titulo:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
            placeholder="Ingrese el titulo del producto"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="categoria">Categoria:</label>
          <select
            name="categoria"
            id="categoria"
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
          >
            <option value="">Seleccione una categoria</option>
            <option value="categoria1">Categoria 1</option>
            <option value="categoria2">Categoria 2</option>
            <option value="categoria3">Categoria 3</option>
          </select>
        </div>
        <div className="flex flex-col col-span-2 mb-4">
          <label htmlFor="descripcion">Descripcion:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="h-36 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
            placeholder="Ingrese la descripcion del producto"
          ></textarea>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            name="precio"
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
            placeholder="Ingrese el precio del producto"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
            placeholder="Ingrese la cantidad en stock"
          />
        </div>
        <button
          type="submit"
          className="bg-sky-200 p-2 mt-4 col-start-2 rounded-sm cursor-pointer text-center hover:bg-sky-300"
        >
          Guardar Producto
        </button>
      </form>
    </div>
  );
};

export default Form;
