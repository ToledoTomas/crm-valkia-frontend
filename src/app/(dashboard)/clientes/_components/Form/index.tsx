import { useState } from "react";
import { createClient } from "../../api";

const Form = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await createClient(formData);
      setFormData({
        fullname: "",
        email: "",
        phone: "",
      });
      alert("Cliente creado exitosamente");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear el cliente"
      );
    }
  };

  return (
    <div className="p-4 mt-4 col-span-2">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col mb-4">
          <label htmlFor="fullname">Nombre:</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
            placeholder="Ingrese el nombre del cliente"
            required
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
            placeholder="Ingrese el email del cliente"
            required
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
            placeholder="Ingrese el teléfono del cliente"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-sky-200 p-2 mt-4 col-start-2 rounded-sm cursor-pointer text-center hover:bg-sky-300 transition-all duration-300"
        >
          Guardar Cliente
        </button>
      </form>
    </div>
  );
};

export default Form;

