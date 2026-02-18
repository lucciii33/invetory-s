import { useEffect, useState } from "react";
import { AuthApi } from "~/api/authApi";

export default function LoginForm() {
  const authApi = AuthApi();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await authApi.login(formData);
      console.log("Usuario autenticado:", data);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl  text-black font-bold mb-4">Iniciar Sesión</h2>
      <form className="text-black" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tu@email.com"
            value={formData.email}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}
