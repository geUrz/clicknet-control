import 'semantic-ui-css/semantic.min.css'
import { initializeOneSignal } from '@/libs/onesignal'
import { useEffect } from 'react'
import '@/styles/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAuth } from '@/contexts/AuthContext'

export default function App(props) {
  const { Component, pageProps } = props
  const { user } = useAuth()

  useEffect(() => {
    if (user && user.id) { 
      initializeOneSignal() 
    } else {
      console.log('User no autenticado. Asegúrate de hacer login primero.')
    }
  }, [user])

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
