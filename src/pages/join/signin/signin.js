import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { BasicJoin, BasicLayout } from '@/layouts'
import { FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'
import { useRedirectIfAuthenticated } from '@/hooks'
import styles from './signin.module.css'

export default function Signin() {

  const [errors, setErrors] = useState({})

  const [credentials, setCredentials] = useState({
    emailOrUsuario: '',
    password: ''
  })

  useRedirectIfAuthenticated()

  const { login } = useAuth()
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const validarFormSignIn = () => {
    const newErrors = {}

    if (!credentials.emailOrUsuario) {
      newErrors.emailOrUsuario = 'El campo es requerido'
    }

    if (!credentials.password) {
      newErrors.password = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validarFormSignIn()) {
      return
    }
    setError(null)

    try {
      await login(credentials.emailOrUsuario, credentials.password)
    } catch (error) {
      console.error('Error capturado:', error);

      if (error?.status === 401) {
        setError(error.data.error || '¡ Correo o contraseña no existe !');
      } else {
        setError(error?.data?.error || '¡ Ocurrió un error inesperado !');
      }
    }
  }

  return (

    <BasicJoin relative>

      <div className={styles.main}>

      <div className={styles.boxForm}>
        
        <div className={styles.user}>
          <FaUserCircle />
          <h1>Iniciar sesión</h1>
        </div>

          <Form onSubmit={handleSubmit}>
            <FormGroup widths='equal'>
              <FormField error={!!errors.emailOrUsuario}>
                <Label>Usuario / Correo</Label>
                <Input
                  name='emailOrUsuario'
                  type='text'
                  value={credentials.emailOrUsuario}
                  onChange={handleChange}
                />
                {errors.emailOrUsuario && <span className={styles.error}>{errors.emailOrUsuario}</span>}
              </FormField>
              <FormField error={!!errors.password}>
                <Label>Contraseña</Label>
                <Input
                  name='password'
                  type='password'
                  value={credentials.password}
                  onChange={handleChange}
                />
                {errors.password && <span className={styles.error}>{errors.password}</span>}
              </FormField>
            </FormGroup>
            {error && <p className={styles.error}>{error}</p>}
            <Button primary type='submit'>Iniciar sesión</Button>
          </Form>

          <div className={styles.link}>
            <Link href='/join/signup'>
              ¿No tienes un usuario?, Crea uno aquí
            </Link>
          </div>

        </div>

      </div>

    </BasicJoin>

  )
}
