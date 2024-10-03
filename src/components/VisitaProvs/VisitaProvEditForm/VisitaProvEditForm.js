import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import styles from './VisitaProvEditForm.module.css'
import { useAuth } from '@/contexts/AuthContext'

export function VisitaProvEditForm(props) {

  const { reload, onReload, visitaprov, onOpenEditVisitaprov, onToastSuccessVisitaprovMod } = props

  const {user} = useAuth()

  const [formData, setFormData] = useState({
    visitaprovedor: visitaprov.visitaprovedor,
    descripcion: visitaprov.descripcion,
    estado: visitaprov.estado
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.visitaprovedor) {
      newErrors.visitaprovedor = 'El campo es requerido'
    }

    if (!formData.descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!formData.estado) {
      newErrors.estado = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Enviar los datos actualizados
  const handleSubmit = async (e) => {
    
    e.preventDefault()

    if (!validarForm()) {
      return
    }

    try {
      await axios.put(`/api/visitaprovedores/visitaprovedores?id=${visitaprov.id}`, formData)
      onReload()
      onOpenEditVisitaprov()
      onToastSuccessVisitaprovMod()
    } catch (error) {
      console.error('Error actualizando la visita provedor:', error)
    }
  }

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

      <IconClose onOpenClose={onOpenEditVisitaprov} />

      <Form onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <FormGroup widths='equal'>
          <FormField error={!!errors.visitaprovedor}>
            <Label>
              Visita provedor
            </Label>
            <Input
              type="text"
              name="visitaprovedor"
              value={formData.visitaprovedor}
              onChange={handleChange}
            />
            {errors.visitaprovedor && <Message negative>{errors.visitaprovedor}</Message>}
          </FormField>
          <FormField error={!!errors.descripcion}>
            <Label>
              Descripción
            </Label>
            <TextArea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
            {errors.descripcion && <Message negative>{errors.descripcion}</Message>}
          </FormField>
          {user.isadmin === 'Admin' && activate ? (
          <>

            <FormField>
              <Label>
                Estatus
              </Label>
              <FormField
                name='estado'
                type="text"
                control='select'
                value={formData.estado}
                onChange={handleChange}
              >
                <option value=''></option>
                <option value='Sin ingresar'>Sin ingresar</option>
                <option value='Ingresado'>Ingresado</option>
                <option value='Retirado'>Retirado</option>
              </FormField>
              {errors.estado && <Message negative>{errors.estado}</Message>}
            </FormField>

          </>
        ) : (
          ''
        )}
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
