import { useState } from "react";
import { createProduct } from "../../api";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    size: [] as string[],
    color: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "size" || name === "color") {
      const options = (e.target as HTMLSelectElement).selectedOptions;
      const values = Array.from(options).map((option) => option.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      await createProduct(productData);
      // Limpiar el formulario después del éxito
      setFormData({
        name: "",
        size: [],
        description: "",
        price: "",
        stock: "",
        color: [],
      });
      alert("Producto creado exitosamente");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear el producto"
      );
    }
  };

  return (
    <div className="p-4 mt-4 col-span-2">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col mb-4">
          <label htmlFor="name">Titulo:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
            placeholder="Ingrese el titulo del producto"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="price">Precio:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
            placeholder="Ingrese el precio del producto"
          />
        </div>

        <div className="flex flex-col col-span-2 mb-4">
          <label htmlFor="description">Descripcion:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="h-24 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
            placeholder="Ingrese la descripcion del producto"
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label htmlFor="size">Talles:</label>
          <select
            name="size"
            id="size"
            multiple
            value={formData.size}
            onChange={handleChange}
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2 min-h-[100px]"
          >
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="color">Colores:</label>
          <select
            name="color"
            id="color"
            multiple
            value={formData.color}
            onChange={handleChange}
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2 min-h-[100px]"
          >
            <option value="Blanco">Blanco</option>
            <option value="Negro">Negro</option>
            <option value="Beige">Beige</option>
            <option value="Gris">Gris</option>
            <option value="Verde">Verde</option>
            <option value="Marron">Marron</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
            placeholder="Ingrese la cantidad en stock"
          />
        </div>
        <button
          type="submit"
          className="bg-sky-200 p-2 mt-4 col-start-2 rounded-sm cursor-pointer text-center hover:bg-sky-300 transition-all duration-300"
        >
          Guardar Producto
        </button>
      </form>
    </div>
  );
};

export default Form;
