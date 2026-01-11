import { useState, useEffect } from "react";
import { createOrder } from "../../api";
import { getProducts } from "../../../productos/api";
import { getClients } from "../../../clientes/api";
import { Product } from "../../../productos/_components/Tables";
import { Customer } from "../../../clientes/_components/Tables";

const Form = () => {
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    products: [] as Product[],
    date: "",
    status: "Pendiente",
    total: 0,
  });

  const [clients, setClients] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, clientsData] = await Promise.all([
          getProducts(),
          getClients(),
        ]);
        setProducts(productsData);
        setClients(clientsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar productos o clientes");
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "clientId") {
      const client = clients.find((c) => c.id === Number(value));
      setFormData((prev) => ({
        ...prev,
        clientId: value,
        clientName: client ? client.fullname : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const product = products.find((p) => p.id === Number(selectedProduct));

    if (product) {
      if (product.stock <= 0) {
        alert("El producto no tiene stock disponible");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        products: [...prev.products, product],
        total: prev.total + product.price,
      }));
      setSelectedProduct("");
    }
  };

  const handleRemoveProduct = (index: number) => {
    setFormData((prev) => {
      const newProducts = [...prev.products];
      const removed = newProducts.splice(index, 1)[0];
      return {
        ...prev,
        products: newProducts,
        total: prev.total - removed.price,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.products.length === 0) {
      setError("Debe agregar al menos un producto a la orden");
      return;
    }

    if (!formData.clientId) {
      setError("Debe seleccionar un cliente");
      return;
    }

    try {
      const orderData = {
        id: Math.floor(Math.random() * 1000000), // Auto-generated ID
        customer: Number(formData.clientId),
        created_at: new Date(formData.date).toISOString(),
        total: formData.total,
        products: formData.products.map((p) => p.id),
        status: formData.status,
      };

      await createOrder(orderData);
      setFormData({
        clientId: "",
        clientName: "",
        products: [],
        date: "",
        status: "Pendiente",
        total: 0,
      });
      alert("Orden creada exitosamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la orden");
    }
  };

  return (
    <div className="p-4 mt-4 col-span-3">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col mb-4">
          <label htmlFor="clientId">Cliente:</label>
          <select
            id="clientId"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className="bg-gray-300 rounded-md p-2"
            required
          >
            <option value="">Seleccione un cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.fullname}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="date">Fecha:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="bg-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="flex flex-col mb-4 col-span-2">
          <label>Productos:</label>
          <div className="flex gap-2 mb-2">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="flex-1 bg-gray-300 rounded-md p-2"
            >
              <option value="">Seleccione un producto</option>
              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                  disabled={product.stock <= 0}
                >
                  {product.name} - ${product.price}{" "}
                  {product.stock <= 0 ? "(Sin Stock)" : ""}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddProduct}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Agregar
            </button>
          </div>

          {formData.products.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-md">
              <h4 className="font-bold mb-2">Productos Agregados:</h4>
              <ul className="mb-4 space-y-2">
                {formData.products.map((p, index) => (
                  <li
                    key={`${p.id}-${index}`}
                    className="flex justify-between items-center bg-white p-2 rounded shadow-sm"
                  >
                    <span>
                      {p.name} - ${p.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
              <div className="text-right font-bold text-xl">
                Total: ${formData.total}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="status">Estado:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="col-span-1 bg-gray-300 rounded-md placeholder:text-gray-600 p-2"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Pagado">Pagado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-sky-200 p-2 mt-4 col-start-2 rounded-sm cursor-pointer text-center hover:bg-sky-300 transition-all duration-300"
        >
          Guardar Orden
        </button>
      </form>
    </div>
  );
};

export default Form;
