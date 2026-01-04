import { useState } from "react";
import { createProduct } from "../../api";
import MultiSelect from "../MultiSelect";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    cost: "",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (selected: string[]) => {
    setFormData({ ...formData, size: selected });
  };

  const handleColorChange = (selected: string[]) => {
    setFormData({ ...formData, color: selected });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        cost: Number(formData.cost),
        stock: Number(formData.stock),
      };

      await createProduct(productData);
      setFormData({
        name: "",
        size: [],
        description: "",
        price: "",
        cost: "",
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
            required
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
            required
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="cost">Costo:</label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
            placeholder="Ingrese el costo del producto"
            required
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
            required
          ></textarea>
        </div>

        <MultiSelect
          label="Talles:"
          options={["XS", "S", "M", "L", "XL"]}
          selected={formData.size}
          onChange={handleSizeChange}
        />

        <MultiSelect
          label="Colores:"
          options={["Blanco", "Negro", "Beige", "Gris", "Verde", "Marron"]}
          selected={formData.color}
          onChange={handleColorChange}
        />
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
            required
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
