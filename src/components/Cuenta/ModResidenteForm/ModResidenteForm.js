import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Form, Button, Input, Label, FormGroup, FormField, Dropdown, Message } from 'semantic-ui-react'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
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
    confirmPassword: '',
    newResidencial: '' // Nuevo estado para el residencial
  });

  const [residenciales, setResidenciales] = useState([]) // Estado para residenciales
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const validarFormUser = () => {
    const newErrors = {}
    if (!formData.newNombre) newErrors.newNombre = 'El campo es requerido'
    if (!formData.newUsuario) newErrors.newUsuario = 'El campo es requerido'
    if (!formData.newResidencial) newErrors.newResidencial = 'El campo es requerido' // Validación para residencial
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
        newResidencial: formData.newResidencial, // Enviar el residencial
        newPassword: formData.newPassword,
      })

      logout()

    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error)
      } else {
        setError('Ocurrió un error inesperado')
      }
    }
  }

  useEffect(() => {
    const fetchResidenciales = async () => {
      try {
        const response = await axios.get('/api/residenciales/residenciales')
        const opcionesResidenciales = response.data.map(res => ({
          key: res.id,
          text: res.nombre,
          value: res.id
        }))
        setResidenciales(opcionesResidenciales)
      } catch (error) {
        console.error('Error al cargar residenciales:', error)
      }
    }

    fetchResidenciales()
  }, []) 

  return (
    <>
      <IconClose onOpenClose={onOpenClose} />

      <Form>
        <FormGroup widths='equal'>
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
          <FormField error={!!errors.newUsuario}>
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
          <FormField error={!!errors.newResidencial}>
            <Label>Nuevo residencial</Label>
            <Dropdown
              placeholder='Selecciona residencial'
              fluid
              selection
              options={residenciales}
              value={formData.newResidencial}
              onChange={(e, { value }) => setFormData({ ...formData, newResidencial: value })}
            />
            {errors.newResidencial && <Message negative>{errors.newResidencial}</Message>}
          </FormField>
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
