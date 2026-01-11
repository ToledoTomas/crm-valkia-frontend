const API_URL = "http://localhost:3001/customer";

export const getClients = async () => {
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
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const createClient = async (client) => {
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
      body: JSON.stringify(client),
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
    console.error("Error creating client:", error);
    throw error;
  }
};

export const deleteClientId = async (id) => {
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
    console.error("Error deleting client:", error);
    throw error;
  }
};

export const searchByFullname = async (fullname) => {
  try {
    const params = new URLSearchParams({ fullname });

    const response = await fetch(`${API_URL}/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al buscar clientes");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const getClientById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching client by ID:", error);
    throw error;
  }
};

export const updateClient = async (id, client) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(client),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

export default getClients;
