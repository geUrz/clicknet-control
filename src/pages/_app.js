import 'semantic-ui-css/semantic.min.css';
import '@/styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

/* const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
} */

export default function App(props) {
  const { Component, pageProps } = props;

  /* useEffect(() => {
    const userId = getCookie('userId')
    
    if (userId) {
      initializeOneSignal()
    } else {
      console.log('User ID no disponible. Asegúrate de hacer login primero.');
    }
  }, []) */

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
