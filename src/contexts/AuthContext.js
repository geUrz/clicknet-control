import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { initializeOneSignal } from '@/libs/onesignal'; // Importa la función de OneSignal

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUserFromCookies() {
      try {
        const response = await axios.get('/api/auth/me');
        setUser(response.data.user); // Asegúrate de que `user` incluya el `id`
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    if (!user) {
      loadUserFromCookies(); // Forzar la recarga del usuario si no está disponible
    }
  }, [user]);

  const login = async (emailOrUsuario, password) => {
    try {
      // Realizar el login
      await axios.post('/api/auth/login', { emailOrUsuario, password });

      // Obtener el usuario actualizado después del login
      const userResponse = await axios.get('/api/auth/me');
      const loggedUser = userResponse.data.user; // Almacenar el usuario en una constante
      setUser(loggedUser); // Actualizar el estado del usuario

      // Redirigir al usuario a la página principal después del login
      router.push('/');

      // Inicializar OneSignal con los datos del usuario
      if (loggedUser?.id) {
        initializeOneSignal(loggedUser.id, loggedUser.nombre, loggedUser.usuario); // Asegúrate de que el usuario tiene id, nombre, y usuario
      }
    } catch (error) {
      if (error.response) {
        throw error.response;
      } else {
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      router.push('/join/signin');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
