import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { BasicModal } from '@/layouts'
import { FaPlus } from 'react-icons/fa'
import { ToastSuccess } from '@/components/Layouts'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './ReciboEditForm.module.css'

export function ReciboEditForm(props) {

  const { reload, onReload, cotizacion, onOpenEditCot, onToastSuccessMod } = props

  const [show, setShow] = useState(false)

  const [formData, setFormData] = useState({
    tipo_evento: cotizacion.tipo_evento
  })
  
  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.tipo_evento) {
      newErrors.tipo_evento = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDropdownChange = (e, { value }) => {
    setFormData({ ...formData, cliente_id: value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    try {
      await axios.put(`/api/cotizaciones/cotizaciones?id=${cotizacion.id}`, {
        ...formData,
      })
      onReload()
      onOpenEditCot()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando el cotizacion:', error)
    }
  }

  const [toastSuccessCliente, setToastSuccessCCliente] = useState(false)

  const onToastSuccessCliente = () => {
    setToastSuccessCCliente(true)
    setTimeout(() => {
      setToastSuccessCCliente(false)
    }, 3000)
  }

  return (

    <>

      <IconClose onOpenClose={onOpenEditCot} />

      {toastSuccessCliente && <ToastSuccess contain='Cliente creado exitosamente' onClose={() => setToastSuccessCliente(false)} />}

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.cliente_id}>
            <Label>Cliente</Label>
            <Dropdown
              placeholder='Selecciona un cliente'
              fluid
              selection
              options={clientes.map(cliente => ({
                key: cliente.id,
                text: cliente.nombre,
                value: cliente.id
              }))}
              value={formData.cliente_id}
              onChange={handleDropdownChange}
            />
            <div className={styles.addCliente} onClick={onOpenCloseClienteForm}>
              <h1>Crear cliente</h1>
              <FaPlus />
            </div>
            {errors.cliente_id && <Message negative>{errors.cliente_id}</Message>}
          </FormField>
          <FormField error={!!errors.tipo_evento}>
            <Label>
              Tipo de evento
            </Label>
            <Input
              type="text"
              name="tipo_evento"
              value={formData.tipo_evento}
              onChange={handleChange}
            />
            {errors.tipo_evento && <Message negative>{errors.tipo_evento}</Message>}
          </FormField>
        </FormGroup>
        <Button secondary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

      <BasicModal title='crear cliente' show={show} onClose={onOpenCloseClienteForm}>
        <ClienteForm reload={reload} onReload={onReload} onOpenClose={onOpenCloseClienteForm} onToastSuccess={onToastSuccessCliente} />
      </BasicModal>

    </>

  )
}
