import { IconCloseModal } from '@/components/Layouts'
import { Button, Confirm, Form, FormField, FormGroup, Input, Label, TextArea } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import { NotasRowHeadModal } from '../NotasRowHead'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { BiToggleLeft, BiToggleRight } from 'react-icons/bi'
import axios from 'axios'
import { formatCurrency } from '@/helpers'
import styles from './NotaForm.module.css'

export function NotaForm(props) {

  const { reload, onReload, onOpenClose, onToastSuccess } = props

  const [showConfirm, setShowConfirm] = useState(false)
  const [cliente, setCliente] = useState('')
  const [marca, setMarca] = useState('')
  const [conceptos, setConceptos] = useState([])
  const [nuevoConcepto, setNuevoConcepto] = useState({ tipo: '', concepto: '', cantidad: '', precio: '' })
  const [errors, setErrors] = useState({})
  const [toggleIVA, setToggleIVA] = useState(false)
  const [conceptoAEliminar, setConceptoAEliminar] = useState(null)

  const onShowConfirm = (index) => {
    setConceptoAEliminar(index)
    setShowConfirm(true)
  }

  const onHideConfirm = () => {
    setConceptoAEliminar(null)
    setShowConfirm(false)
  }

  const validarFormCliente = () => {
    const newErrors = {}

    if (!cliente) {
      newErrors.cliente = 'El campo es requerido'
    }

    if (!marca) {
      newErrors.marca = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const validarFormConceptos = () => {
    const newErrors = {}

    if (!nuevoConcepto.tipo) {
      newErrors.tipo = 'El campo es requerido'
    }

    if (!nuevoConcepto.concepto) {
      newErrors.concepto = 'El campo es requerido'
    }

    if (!nuevoConcepto.cantidad) {
      newErrors.cantidad = 'El campo es requerido'
    } else if (nuevoConcepto.cantidad <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0'
    }

    if (!nuevoConcepto.precio) {
      newErrors.precio = 'El campo es requerido'
    } else if (nuevoConcepto.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const crearNota = async (e) => {
    e.preventDefault()

    if (!validarFormCliente()) {
      return
    }

    try {
      const response = await axios.post('/api/notas', { cliente, marca })
      const notaId = response.data.id
      await Promise.all(conceptos.map(concepto =>
        axios.post('/api/conceptos', { nota_id: notaId, ...concepto })
      ))
      onToastSuccess()
      setCliente('');
      setMarca('')
      setConceptos([])
      onOpenClose()
      onReload()
      
    } catch (error) {
      console.error('Error al crear la nota:', error)

    }
  }

  const añadirConcepto = () => {
    if (!validarFormConceptos()) {
      return
    }
    setConceptos([...conceptos, nuevoConcepto]);
    setNuevoConcepto({ tipo: '', concepto: '', cantidad: '', precio: '' })
  }

  const eliminarConcepto = () => {
    const nuevosConceptos = conceptos.filter((_, i) => i !== conceptoAEliminar);
    setConceptos(nuevosConceptos);
    onHideConfirm();
  }

  const calcularTotales = () => {
    const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    return { subtotal, iva, total }
  };

  const { subtotal, iva, total } = calcularTotales()

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA))
  }, [toggleIVA])

  const onIVA = () => {
    setToggleIVA(prevState => (!prevState))
  }

  return (

    <>

      <IconCloseModal onOpenClose={onOpenClose} />

      <div className={styles.main}>

        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.cliente}>
              <Label>Cliente</Label>
              <Input  
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
              {errors.cliente && <span className={styles.error}>{errors.cliente}</span>}
            </FormField>
          </FormGroup>
          <FormGroup widths='equal'>
            <FormField error={!!errors.marca}>
              <Label>Marca / Modelo</Label>
              <Input  
                type="text"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
              />
              {errors.marca && <span className={styles.error}>{errors.marca}</span>}
            </FormField>
          </FormGroup>
        </Form>

        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.tipo}>
              <Label>Tipo</Label>
              <select
                value={nuevoConcepto.tipo}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, tipo: e.target.value })}
              >
                <option value=''></option>
                <option value='Servicio'>Servicio</option>
                <option value='Producto'>Producto</option>
              </select>
              {errors.tipo && <span className={styles.error}>{errors.tipo}</span>}
            </FormField>
            <FormField error={!!errors.concepto}>
              <Label>Concepto</Label>
              <Input
                type="text"
                value={nuevoConcepto.concepto}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, concepto: e.target.value })}
              />
              {errors.concepto && <span className={styles.error}>{errors.concepto}</span>}
            </FormField>
            <FormField error={!!errors.precio}>
              <Label>Precio</Label>
              <Input
                type="number"
                value={nuevoConcepto.precio}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, precio: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              />
              {errors.precio && <span className={styles.error}>{errors.precio}</span>}
            </FormField>
            <FormField error={!!errors.cantidad}>
              <Label>Qty</Label>
              <Input
                type="number"
                value={nuevoConcepto.cantidad}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, cantidad: e.target.value === '' ? '' : parseInt(e.target.value) })}
              />
              {errors.cantidad && <span className={styles.error}>{errors.cantidad}</span>}
            </FormField>
          </FormGroup>
          <Button secondary onClick={añadirConcepto}>Añadir Concepto</Button>
        </Form>

        <div className={styles.section}>

          <NotasRowHeadModal rowMain />

          {conceptos.map((concepto, index) => (
            <div key={index} className={styles.rowMapConcept} onClick={() => onShowConfirm(index)}>
              <h1>{concepto.tipo}</h1>
              <h1>{concepto.concepto}</h1>
              <h1>${formatCurrency(concepto.precio * 1)}</h1>
              <h1>{concepto.cantidad}</h1>
              <h1>${formatCurrency(concepto.precio * concepto.cantidad)}</h1>
            </div>
          ))}

          <div className={styles.box3}>
            <div className={styles.box3_1}>
              <h1>Subtotal:</h1>

              {!toggleIVA ? (

                <div className={styles.toggleOFF} onClick={onIVA}>
                  <BiToggleLeft />
                  <h1>IVA:</h1>
                </div>

              ) : (

                <div className={styles.toggleON} onClick={onIVA}>
                  <BiToggleRight />
                  <h1>IVA:</h1>
                </div>

              )}

              <h1>Total:</h1>
            </div>

            <div className={styles.box3_2}>

              {!toggleIVA ? (
                <>

                  <h1>-</h1>
                  <h1>-</h1>

                </>
              ) : (
                <>

                  <h1>{formatCurrency(subtotal)}</h1>
                  <h1>{formatCurrency(iva)}</h1>

                </>
              )}

              {!toggleIVA ? (
                <h1>{formatCurrency(subtotal)}</h1>
              ) : (
                <h1>{formatCurrency(total)}</h1>
              )}

            </div>
          </div>

        </div>

        <Button primary onClick={crearNota}>Crear</Button>

      </div>

      <Confirm
        open={showConfirm}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={eliminarConcepto}
        onCancel={onHideConfirm}
        content='¿Estás seguro de eliminar el concepto?'
      />

    </>

  )
}
