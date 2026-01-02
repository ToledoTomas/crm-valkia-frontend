export const login = async (user: any) => {
  try {
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.message) {
        // If message is array (class-validator), join it
        const message = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message;
        throw new Error(message);
      }

      if (response.status === 401) {
        throw new Error("Credenciales inválidas");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
