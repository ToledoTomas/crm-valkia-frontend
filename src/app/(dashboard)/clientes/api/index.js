export const getClients = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3001/customer", {
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
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const createClient = async (client) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay token de autenticación. Por favor, inicia sesión.");
    }

    const response = await fetch("http://localhost:3001/customer", {
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
        throw new Error(errorData.message || "No autorizado. Verifica tus credenciales o permisos.");
      }
      
      const errorMessage = errorData.message || `Error HTTP! status: ${response.status}`;
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
    const response = await fetch(`http://localhost:3001/customer/${id}`, {
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

export default getClients;

