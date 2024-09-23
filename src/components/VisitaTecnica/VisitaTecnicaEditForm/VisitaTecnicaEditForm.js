import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label, TextArea } from 'semantic-ui-react'
import { useAuth } from '@/contexts/AuthContext'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './VisitaTecnicaEditForm.module.css'

export function VisitaTecnicaEditForm(props) {

  const { reload, onReload, visitatecnica, onOpenEditVisitatecnica, onToastSuccessVisitatecnicaMod } = props

  const { user } = useAuth()

  const [formData, setFormData] = useState({
    visitatecnica: visitatecnica.visitatecnica,
    descripcion: visitatecnica.descripcion,
    date: visitatecnica.date ? new Date(visitatecnica.date + 'T00:00:00') : null,
    hora: visitatecnica.hora,
    estado: visitatecnica.estado
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.visitatecnica) {
      newErrors.visitatecnica = 'El campo es requerido'
    }

    if (!formData.descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!formData.date) {
      newErrors.date = 'El campo es requerido'
    }

    if (!formData.hora) {
      newErrors.hora = 'El campo es requerido'
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
      await axios.put(`/api/visitatecnica/visitatecnica?id=${visitatecnica.id}`, {
        ...formData,
        date: formData.date ? formData.date.toISOString().split('T')[0] : null
      })
      onReload()
      onOpenEditVisitatecnica()
      onToastSuccessVisitatecnicaMod()
    } catch (error) {
      console.error('Error actualizando la visitatecnica:', error)
    }
  }


  return (

    <>

      <IconClose onOpenClose={onOpenEditVisitatecnica} />

      <Form>
        <FormGroup>
        <FormField error={!!errors.visitatecnica}>
            <Label>
              Visita técnica
            </Label>
            <Input
              type="text"
              name="visitatecnica"
              value={formData.visitatecnica}
              onChange={handleChange}
            />
            {errors.visitatecnica && <span className={styles.error}>{errors.visitatecnica}</span>}
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
            {errors.descripcion && <span className={styles.error}>{errors.descripcion}</span>}
          </FormField>
          <FormField error={!!errors.date}>
            <Label>
              Fecha
            </Label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/aaaa"
              locale="es"
              isClearable
              showPopperArrow={false}
              popperPlacement="top"
            />
            {errors.date && <span className={styles.error}>{errors.date}</span>}
          </FormField>
          <FormField error={!!errors.hora}>
            <Label>
              Hora
            </Label>
            <Input
              name='hora'
              type="time"
              value={formData.hora}
              onChange={handleChange}
            />
            {errors.hora && <span className={styles.error}>{errors.hora}</span>}
          </FormField>
          <FormField error={!!errors.estado}>
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
              <option value='Pendiente'>Pendiente</option>
              <option value='En proceso'>En proceso</option>
              <option value='Realizada'>Realizada</option>
            </FormField>
            {errors.estado && <span className={styles.error}>{errors.estado}</span>}
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
