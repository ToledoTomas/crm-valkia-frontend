const API_URL = "http://localhost:3001/products";

export const getProducts = async () => {
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
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const createProduct = async (product) => {
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
      body: JSON.stringify(product),
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
    console.error("Error creating product:", error);
    throw error;
  }
};

export const deleteProductId = async (id) => {
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
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const searchByName = async (name) => {
  try {
    const params = new URLSearchParams({ name });

    const response = await fetch(`${API_URL}/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al buscar productos");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export default getProducts;
