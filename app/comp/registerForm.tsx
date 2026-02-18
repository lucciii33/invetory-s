import { useState } from "react";
import { AuthApi } from "~/api/authApi";

export default function RegisterForm() {
  const authApi = AuthApi();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    pais: "",
    edad: "",
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await authApi.register({
        ...formData,
        edad: Number(formData.edad),
      });
      console.log("Usuario registrado:", data);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl text-black font-bold mb-4">Registrar Cuenta</h2>
      <form onSubmit={handleSubmit} className="text-black">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="firstName">
            Nombre
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Juan"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="lastName">
            Apellido
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Pérez"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tu@email.com"
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

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="pais">
            País
          </label>
          <input
            type="text"
            id="pais"
            name="pais"
            value={formData.pais}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="México"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="edad">
            Edad
          </label>
          <input
            type="number"
            id="edad"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="25"
          />
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />
          <label className="text-gray-700" htmlFor="terms">
            Acepto los términos y condiciones
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
