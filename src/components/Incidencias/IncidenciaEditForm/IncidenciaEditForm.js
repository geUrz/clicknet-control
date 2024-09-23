import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label, TextArea } from 'semantic-ui-react'
import styles from './IncidenciaEditForm.module.css'
import { useAuth } from '@/contexts/AuthContext'

export function IncidenciaEditForm(props) {

  const { reload, onReload, incidencia, onOpenEditIncidencia, onToastSuccessIncidenciaMod } = props

  const {user} = useAuth()

  const [formData, setFormData] = useState({
    incidencia: incidencia.incidencia,
    descripcion: incidencia.descripcion,
    zona: incidencia.zona,
    estado: incidencia.estado
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Enviar los datos actualizados
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/incidencias/incidencias?id=${incidencia.id}`, formData)
      onReload()
      onOpenEditIncidencia()
      onToastSuccessIncidenciaMod()
    } catch (error) {
      console.error('Error actualizando la incidencia:', error)
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

      <IconClose onOpenClose={onOpenEditIncidencia} />

      <Form onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <FormGroup>
          <FormField>
            <Label>
              Incidencia
            </Label>
            <Input
              type="text"
              name="incidencia"
              value={formData.incidencia}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Descripción
            </Label>
            <TextArea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Zona
            </Label>
            <FormField
              name='zona'
              type="text"
              control='select'
              value={formData.zona}
              onChange={handleChange}
            >
              <option value=''></option>
              <option value='Caseta'>Caseta</option>
              <option value='León'>León</option>
              <option value='Calet'>Calet</option>
              <option value='Yza'>Yza</option>
              <option value='Páramo'>Páramo</option>
            </FormField>
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
                  <option value='Pendiente'>Pendiente</option>
                  <option value='En proceso'>En proceso</option>
                  <option value='Realizada'>Realizada</option>
                </FormField>
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
