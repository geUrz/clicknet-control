import { useState } from 'react'
import { BasicLayout } from '@/layouts'
import axios from 'axios'
import styles from './visitas.module.css'
import { GenerarCodigo } from '@/components/Visitas/GenerarCodigo';

export default function Visitas() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('')

  const handleAuthenticate = async () => {
    try {
      const response = await axios.post('/api/visitas/validate-code', { code })
      
      // Verificar si la respuesta es exitosa
      if (response.status === 200) {
        setMessage(response.data.message)
      } else {
        throw new Error('Error al autenticar el código')
      }
    } catch (error) {
      console.error('Error en handleAuthenticate:', error.message)
      setMessage('Error al autenticar el código');
    }
  };

  return (
    <BasicLayout title='Visitas'>
      <div>
        <h1>Autenticación de Visitante</h1>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Introduce el código recibido"
        />
        <button onClick={handleAuthenticate}>Autenticar</button>
        {message && <p>{message}</p>}
      </div>

      <GenerarCodigo />

    </BasicLayout>
  );
}
