import axios from 'axios'
import { useState } from 'react'
import styles from './GenerarCodigo.module.css'

export function GenerarCodigo() {

  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleGenerateCode = async () => {
    try {
      const response = await axios.post('/api/visitas/generate-code')

      // Verificar si la respuesta es exitosa
      if (response.status === 200) {
        setCode(response.data.code)
        setError('')
      } else {
        throw new Error('Error al generar el código')
      }
    } catch (error) {
      console.error('Error en handleGenerateCode:', error.message)
      setCode('')
      setError('Error al generar el código')
    }
  }

  return (
    <div>
      <h1>Generar Código de Visita</h1>
      <button onClick={handleGenerateCode}>Generar Código</button>
      {code && (
        <div>
          <p>Código generado: {code}</p>
          <p>Envía este código al visitante.</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
