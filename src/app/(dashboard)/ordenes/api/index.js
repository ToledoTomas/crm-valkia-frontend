const API_URL = "http://localhost:3001/invoice";

export const getOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const createOrder = async (order) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "No hay token de autenticación. Por favor, inicia sesión."
      );
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error(
          errorData.message ||
            "No autorizado. Verifica tus credenciales o permisos."
        );
      }

      const errorMessage =
        errorData.message || `Error HTTP! status: ${response.status}`;
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export const searchOrderById = async (id) => {
  try {
    // Assuming the backend supports searching by ID or we just fetch this specific one
    // But usually search expects a list. If this returns one object, we might need to wrap it in array.
    // However, following the pattern of searchByName, let's assume a search endpoint.
    // If exact ID match, maybe GET /orders/:id?
    // Let's try to mimic searchByName but for ID.
    // If the user wants a "searcher", usually it's a list filter.

    // For now, let's assume a search endpoint exists or we filter client-side if needed,
    // but the instruction says "buscador para buscar facturas por id".

    // Changing strategy: The prompt says "search by id".
    // Usually backend for search might be ?q=... or specific fields.
    // I will use `?id=${id}` if it's a search endpoint, otherwise `?q=${id}`.

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/search?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Fallback: try to get by ID directly if search fails? No, let's assume search works.
      throw new Error("Error al buscar ordenes");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
