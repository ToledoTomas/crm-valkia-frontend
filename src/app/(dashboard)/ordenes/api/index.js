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
    // Handle paginated response { data: [...], meta: ... }
    if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    }
    // Handle legacy/flat array response
    return Array.isArray(data) ? data : [];
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
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/search?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al buscar ordenes");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateStatusOrder = async (id, status) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
