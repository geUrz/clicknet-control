import 'semantic-ui-css/semantic.min.css';
import { initializeOneSignal } from '@/libs/onesignal';
import { useEffect } from 'react';
import '@/styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export default function App(props) {
  const { Component, pageProps } = props;

  useEffect(() => {
    const userId = getCookie('userId'); // Obtener el userId de las cookies
    
    if (userId) {
      initializeOneSignal(); // Inicializar OneSignal solo si el userId está disponible
    } else {
      console.log('User ID no disponible. Asegúrate de hacer login primero.');
    }
  }, []); // Ejecutar solo una vez al montar el componente

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
