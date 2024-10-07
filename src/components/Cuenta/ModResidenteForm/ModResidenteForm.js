import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Form, Button, Input, Label, FormGroup, FormField } from 'semantic-ui-react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { Confirm } from '@/components/Layouts'
import styles from './ModResidenteForm.module.css'

export function ModResidenteForm(props) {

  const { onOpenClose } = props

  const { user, logout } = useAuth()

  const [formData, setFormData] = useState({
    newNombre: user.nombre || '',
    newUsuario: user.usuario || '',
    newPrivada: user.privada || '',
    newCalle: user.calle || '',
    newCasa: user.casa || '',
    newEmail: user.email || '',
    newIsAdmin: user.isadmin || '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const validarFormUser = () => {
    const newErrors = {};

    if (!formData.newNombre) {
      newErrors.newNombre = 'El campo es requerido';
    }

    if (!formData.newUsuario) {
      newErrors.newUsuario = 'El campo es requerido';
    }

    if (!formData.newIsAdmin) {
      newErrors.newIsAdmin = 'El campo es requerido';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormUser()) {
      return
    }

    setError(null)

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      await axios.put('/api/auth/updateUser', {
        userId: user.id,
        newNombre: formData.newNombre,
        newUsuario: formData.newUsuario,
        newPrivada: formData.newPrivada,
        newCalle: formData.newCalle,
        newCasa: formData.newCasa,
        newEmail: formData.newEmail,
        newIsAdmin: formData.newIsAdmin,
        newPassword: formData.newPassword,
      })

      logout()

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Ocurrió un error inesperado');
      }
    }
  }
  
  const opcionesNivel = [
    { key: 1, text: 'Admin', value: 'Admin' },
    { key: 2, text: 'Comité', value: 'Comité' },
    { key: 3, text: 'Residente', value: 'Residente' },
    { key: 4, text: 'Caseta', value: 'Caseta' },
    { key: 5, text: 'Técnico', value: 'Técnico' }
  ]

  const [activate, setActivate] = useState(false)

  const timer = useRef(null)

  const handleTouchStart = () => {
    timer.current = setTimeout(() => {
      setActivate(prev => !prev)
    }, 3000)
  }

  const handleTouchEnd = () => {
    clearTimeout(timer.current)
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === '0') {
      e.preventDefault()
      setActivate((prevState) => !prevState)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>

      <IconClose onOpenClose={onOpenClose} />

      <Form onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <FormGroup widths='equal'>
          <FormField error={!!errors.newUsuario}>
            <FormField error={!!errors.newNombre}>
              <Label>Nuevo nombre</Label>
              <Input
                name='newNombre'
                type='text'
                value={formData.newNombre}
                onChange={handleChange}
              />
              {errors.newNombre && <span className={styles.error}>{errors.newNombre}</span>}
            </FormField>
            <Label>Nuevo usuario</Label>
            <Input
              name='newUsuario'
              type='text'
              value={formData.newUsuario}
              onChange={handleChange}
            />
            {errors.newUsuario && <span className={styles.error}>{errors.newUsuario}</span>}
          </FormField>
          <FormField error={!!errors.newPrivada}>
            <Label>Nueva privada</Label>
            <Input
              name='newPrivada'
              type='text'
              value={formData.newPrivada}
              onChange={handleChange}
            />
            {errors.newPrivada && <span className={styles.error}>{errors.newPrivada}</span>}
          </FormField>
          <FormField error={!!errors.newCalle}>
            <Label>Nueva calle</Label>
            <Input
              name='newCalle'
              type='text'
              value={formData.newCalle}
              onChange={handleChange}
            />
            {errors.newCalle && <span className={styles.error}>{errors.newCalle}</span>}
          </FormField>
          <FormField error={!!errors.newCasa}>
            <Label>Nueva casa</Label>
            <Input
              name='newCasa'
              type='text'
              value={formData.newCasa}
              onChange={handleChange}
            />
            {errors.newCasa && <span className={styles.error}>{errors.newCasa}</span>}
          </FormField>
          <FormField error={!!errors.newEmail}>
            <Label>Nuevo correo</Label>
            <Input
              name='newEmail'
              type='email'
              value={formData.newEmail}
              onChange={handleChange}
            />
            {errors.newEmail && <span className={styles.error}>{errors.newEmail}</span>}
          </FormField>
          
          {activate ? (
            <FormField error={!!errors.newIsAdmin}>
            <Label>
              Nivel
            </Label>
            <Dropdown
                placeholder='Selecciona una opción'
                fluid
                selection
                options={opcionesNivel}
                value={formData.newIsAdmin}
                onChange={(e, { value }) => setFormData({ ...formData, newIsAdmin: value })}
              />
            {errors.newIsAdmin && <Message negative>{errors.newIsAdmin}</Message>}
          </FormField>
          ) : ''}

          <FormField>
            <Label>Nueva contraseña</Label>
            <Input
              name='newPassword'
              type='password'
              value={formData.newPassword}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Confirmar nueva contraseña</Label>
            <Input
              name='confirmPassword'
              type='password'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </FormField>
        </FormGroup>
        {error && <p className={styles.error}>{error}</p>}
        <Button primary onClick={handleSubmit}>Guardar</Button>
      </Form>

    </>

  )
}
