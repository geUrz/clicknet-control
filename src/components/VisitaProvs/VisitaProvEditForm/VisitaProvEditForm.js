import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label, TextArea } from 'semantic-ui-react'
import styles from './VisitaProvEditForm.module.css'

export function VisitaProvEditForm(props) {

  const { reload, onReload, visitaprov, onOpenEditVisitaprov, onToastSuccessVisitaprovMod } = props

  const [formData, setFormData] = useState({
    visitaprovedor: visitaprov.visitaprovedor,
    descripcion: visitaprov.descripcion
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Enviar los datos actualizados
  const handleSubmit = async (e) => {
    e.preventDefault()
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
        <FormGroup>
          <FormField>
            <Label>
              Visita provedor
            </Label>
            <Input
              type="text"
              name="visitaprovedor"
              value={formData.visitaprovedor}
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
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
