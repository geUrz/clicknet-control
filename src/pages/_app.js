
import 'semantic-ui-css/semantic.min.css'
import { initializeOneSignal } from '@/libs/onesignal'
import { useEffect } from 'react';
import '@/styles/globals.css'
import { AuthProvider } from '@/contexts/AuthContext';

export default function App(props) {

  const { Component, pageProps } = props

  useEffect(() => {
    initializeOneSignal()
  }, [])

  return(
  
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>

  ) 
}
