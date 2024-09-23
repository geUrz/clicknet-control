import { Button, Form, FormField, FormGroup, Input, Label, TextArea } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import styles from './IncidenciaForm.module.css'
import { genIncId } from '@/helpers'

export function IncidenciaForm(props) {

  const { user } = useAuth()

  const [incidencia, setIncidencia] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [zona, setZona] = useState('')

  const { reload, onReload, onOpenCloseForm, onToastSuccessIncidencia } = props

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!incidencia) {
      newErrors.incidencia = 'El campo es requerido'
    }

    if (!descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!zona) {
      newErrors.zona = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleIncidenciaChange = (e) => {
    const value = e.target.value
    setIncidencia(value)
  }

  const crearIncidencia = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    const folio = genIncId(4)
    const estado = 'Pendiente'

    try {
      await axios.post('/api/incidencias/incidencias', {
        usuario_id: user.id,
        folio,
        incidencia,
        descripcion,
        zona,
        estado
      })

      setIncidencia('')
      setDescripcion('')
      setZona('')

      onReload()
      onOpenCloseForm()
      onToastSuccessIncidencia()

    } catch (error) {
      console.error('Error al crear el incidencia:', error)
    }

  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>

        <div className={styles.container}>

          <Form>
            <FormGroup widths='equal'>
              <FormField error={!!errors.incidencia}>
                <Label>
                  Incidencia
                </Label>
                <Input
                  name='incidencia'
                  type="text"
                  value={incidencia}
                  onChange={handleIncidenciaChange}
                />
                {errors.incidencia && <span className={styles.error}>{errors.incidencia}</span>}
              </FormField>
              <FormField error={!!errors.descripcion}>
                <Label>
                  Descripción
                </Label>
                <TextArea
                  name='descripcion'
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
                {errors.descripcion && <span className={styles.error}>{errors.descripcion}</span>}
              </FormField>
              <FormField error={!!errors.zona}>
                <Label>
                  Zona
                </Label>
                <FormField
                  name='zona'
                  type="text"
                  control='select'
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                >
                  <option value=''></option>
                  <option value='Caseta'>Caseta</option>
                  <option value='León'>León</option>
                  <option value='Calet'>Calet</option>
                  <option value='Yza'>Yza</option>
                  <option value='Páramo'>Paramo</option>
                </FormField>
                {errors.zona && <span className={styles.error}>{errors.zona}</span>}
              </FormField>
            </FormGroup>
            <Button
              primary
              onClick={crearIncidencia}
            >
              Crear
            </Button>

          </Form>

        </div>

      </div>

    </>

  )
}
