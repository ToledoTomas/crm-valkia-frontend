async function filterDataOnServer(query: string) {
  const data = [
    {
      id: 1,
      name: "Producto 1",
      description: "Descripción del producto 1",
      price: 100,
      stock: 50,
      size: ["XS", "S", "M", "L", "XL"],
      color: ["Rojo", "Azul", "Verde"],
      category: "Categoría 1",
    },
    {
      id: 2,
      name: "Producto 2",
      description: "Descripción del producto 2",
      price: 200,
      stock: 30,
      size: ["XS", "S", "M", "L", "XL"],
      color: ["Rojo", "Azul", "Verde"],
      category: "Categoría 2",
    },
    {
      id: 3,
      name: "Producto 3",
      description: "Descripción del producto 3",
      price: 150,
      stock: 20,
      size: ["XS", "S", "M", "L", "XL"],
      color: ["Rojo", "Azul", "Verde"],
      category: "Categoría 3",
    },
  ];
  if (!query) {
    return data;
  }

  return data.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
}

export default async function Tables({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query || "";
  const filteredProducts = await filterDataOnServer(query);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase ">
              ID
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase ">
              Nombre
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Categoría
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Precio
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Stock
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Tamaño
            </th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase ">
              Color
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredProducts.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="px-5 py-4">{item.id}</td>
              <td className="px-5 py-4">{item.name}</td>
              <td className="px-5 py-4">{item.category}</td>
              <td className="px-5 py-4">$ {item.price}</td>
              <td className="px-5 py-4">{item.stock}</td>
              <td className="px-5 py-4">{item.size.join(", ")}</td>
              <td className="px-5 py-4">{item.color.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
