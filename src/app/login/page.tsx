"use client";

import { useState } from "react";
import { login } from "./api";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(user);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error logging in:", err);
      // Display the error message from the API or a default message
      setError(
        err.message ||
          "Error al iniciar sesión. Por favor verifique sus credenciales."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 rounded"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`bg-sky-200 p-2 rounded-md cursor-pointer hover:bg-sky-300 transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
};

export default Login;
