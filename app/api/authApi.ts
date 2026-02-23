import { useState } from "react";

interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  pais: string;
  edad: number;
  terms: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  pais: string;
  edad: number;
  terms: boolean;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  data: RegisterResponse | null;
}

export function AuthApi() {
  const [state, setState] = useState<AuthState>({
    loading: false,
    error: null,
    data: null,
  });

  const login = async (credentials: LoginCredentials) => {
    setState({ loading: true, error: null, data: null });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error("Credenciales incorrectas");

      const data: RegisterResponse = await response.json();
      localStorage.setItem("user2", JSON.stringify(data)); 

      setState({ loading: false, error: null, data });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al iniciar sesión";
      setState({ loading: false, error: message, data: null });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setState({ loading: true, error: null, data: null });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error("Error al registrar usuario");

      const data: RegisterResponse = await response.json();
      setState({ loading: false, error: null, data });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al registrar";
      setState({ loading: false, error: message, data: null });
      throw error;
    }
  };

  return {
    ...state,
    login,
    register,
  };
}