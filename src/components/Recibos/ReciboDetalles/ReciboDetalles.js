import { Confirm, DatosCliente, IconClose, ToastSuccess } from '@/components/Layouts'
import { FaCheck, FaEdit, FaInfoCircle, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { formatCurrency, formatDateIncDet } from '@/helpers'
import { BiToggleLeft, BiToggleRight } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { CotConceptos } from '../ReciboConceptos'
import { CotPDF } from '../ReciboPDF'
import { CotConceptosForm } from '../ReciboConceptosForm'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, TextArea } from 'semantic-ui-react'
import { CotRowHeadModal } from '../RowHead'
import { CotEditForm } from '../ReciboEditForm'
import styles from './ReciboDetalles.module.css'
import { CotConceptosEditForm } from '../ReciboConceptosEditForm'

export function ReciboDetalles(props) {

  const { recibo, reciboId, reload, onReload, onOpenClose, onAddConcept, onDeleteConcept, onShowConfirm, onToastSuccess, onToastSuccessMod, onToastSuccessDel } = props

  const [showConcep, setShowForm] = useState(false)
  const [showEditConcep, setShowEditConcept] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentConcept, setCurrentConcept] = useState(null)
  const [toastSuccess, setToastSuccess] = useState(false)
  const [cliente, setCliente] = useState(null)

  const [showEditCot, setShowEditCot] = useState(false)
  const onOpenEditCot = () => setShowEditCot((prevState) => !prevState)

  const [showCliente, setShowCliente] = useState(false)
  const onOpenCloseCliente = () => setShowCliente((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  useEffect(() => {
    setEditNota(!!(recibo && recibo.nota));
  }, [recibo?.nota])

  const onOpenCloseConfirm = (concepto) => {
    setShowConfirm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const onOpenCloseConcep = (concepto) => {
    setShowForm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const onOpenCloseEditConcep = (concepto) => {
    setShowEditConcept((prevState) => !prevState)
    setCurrentConcept(concepto)
  }

  const handleDeleteConcept = () => {
    onDeleteConcept(currentConcept)
    setShowConfirm(false)
  }

  const [toggleIVA, setToggleIVA] = useState(false)

  const onIVA = () => {
    setToggleIVA((prevState) => !prevState)
  }

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA));
  }, [toggleIVA])

  const subtotal = (recibo?.conceptos || []).reduce(
    (sum, concepto) => sum + concepto.precio * concepto.cantidad,
    0
  )
  const iva = subtotal * 0.16
  const total = subtotal + iva

  const [toggleNota, setToggleNota] = useState(false)

  const onToggleNota = () => setToggleNota((prevState) => !prevState)

  const [nota, setNota] = useState(recibo?.nota || '')
  const [editNota, setEditNota] = useState(!!recibo?.nota)
  const maxCharacters = 325

  const handleNotaChange = (e) => {
    const { value } = e.target
    if (value.length <= maxCharacters) {
      setNota(value)
    }
  }

  const handleAddNota = async () => {
    if (!recibo.id) {
      console.error("ID de la orden de servicio no disponible")
      return
    }

    try {
      const response = await axios.put(`/api/recibos/nota`, {
        id: recibo.id,
        notaValue: nota
      })

      if (response.status === 200) {
        setEditNota(true)
        onReload()
      }
    } catch (error) {
      console.error('Error al actualizar la nota:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    if (recibo?.nota !== undefined) {
      setEditNota(true);
    }
  }, [recibo?.nota]);


  const handleDeleteCot = async () => {
    if (recibo?.id) {
      try {
        await axios.delete(`/api/recibos/recibos?id=${recibo.id}`)
        onReload()
        onToastSuccessDel()
        onOpenCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar el recibo:', error)
      }
    } else {
      console.error('Recibo o ID no disponible')
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      {toastSuccess && <ToastSuccess contain='Concepto agregado exitosamente' onClose={() => setToastSuccess(false)} />}

      <div className={styles.main}>
        <div className={styles.sectionDatos}>
          <div className={styles.datos_1}>
            <div>
              <h1>Cliente</h1>
              <h2 onClick={onOpenCloseCliente}>{recibo?.cliente_nombre || 'No disponible'}<FaInfoCircle /></h2>
            </div>
            <div>
              <h1>Tipo de evento</h1>
              <h2>{recibo?.tipo_evento || 'No disponible'}</h2>
            </div>
          </div>
          <div className={styles.datos_2}>
            <div>
              <h1>Folio</h1>
              <h2>{recibo?.folio || 'No disponible'}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDateIncDet(recibo?.createdAt) || 'No disponible'}</h2>
            </div>
          </div>
        </div>

        <CotRowHeadModal rowMain />

        <CotConceptos conceptos={recibo?.conceptos || []} onOpenCloseConfirm={onOpenCloseConfirm} onOpenCloseEditConcep={onOpenCloseEditConcep} handleDeleteConcept={handleDeleteConcept} />

        <div className={styles.iconPlus}>
          <div onClick={onOpenCloseConcep}>
            <FaPlus />
          </div>
        </div>

        <div className={styles.sectionTotal}>
          <div className={styles.sectionTotal_1}>
            <h1>Subtotal:</h1>

            {!toggleIVA ? (

              <div className={styles.toggleOFF}>
                <BiToggleLeft onClick={onIVA} />
                <h1>IVA:</h1>
              </div>

            ) : (

              <div className={styles.toggleON}>
                <BiToggleRight onClick={onIVA} />
                <h1>IVA:</h1>
              </div>

            )}

            <h1>Total:</h1>
          </div>

          <div className={styles.sectionTotal_2}>

            {!toggleIVA ? (
              <>

                <h1>-</h1>
                <h1>-</h1>

              </>
            ) : (
              <>

                <h1>${formatCurrency(subtotal)}</h1>
                <h1>${formatCurrency(iva)}</h1>

              </>
            )}

            {!toggleIVA ? (
              <h1>${formatCurrency(subtotal)}</h1>
            ) : (
              <h1>${formatCurrency(total)}</h1>
            )}

          </div>
        </div>

        <div className={styles.toggleNota}>
          <h1>Añadir nota</h1>
          {toggleNota || recibo?.nota ?
            <div className={styles.toggleNotaON}><BiToggleRight onClick={onToggleNota} /></div> :
            <div className={styles.toggleNotaOFF}><BiToggleLeft onClick={onToggleNota} /></div>
          }
        </div>

        {toggleNota || recibo?.nota ? (
          <div className={styles.formNota}>
            <Form>
              <FormGroup>
                <FormField>
                  <TextArea
                    value={nota}
                    onChange={handleNotaChange}
                    placeholder="Escribe una nota aquí..."
                  />
                  <div className={styles.charCount}>
                    {nota.length}/{maxCharacters}
                  </div>
                </FormField>
              </FormGroup>
              <Button secondary onClick={handleAddNota}>
                {editNota ? 'Modificar nota' : 'Añadir nota'}
              </Button>
            </Form>
          </div>
        ) : null}


        <div className={styles.iconEdit}>
          <div><FaEdit onClick={onOpenEditCot} /></div>
        </div>

        <CotPDF recibo={recibo} conceptos={recibo?.conceptos || []} />

      </div>

      <BasicModal title='datos del cliente' show={showCliente} onClose={onOpenCloseCliente}>
        <DatosCliente
          folio={recibo?.cliente_folio || 'No disponible'}
          nombre={recibo?.cliente_nombre || 'No disponible'}
          cel={recibo?.cliente_cel || 'No disponible'}
          email={recibo?.cliente_email || 'No disponible'}
          onOpenCloseCliente={onOpenCloseCliente} />
      </BasicModal>

      <BasicModal title='modificar la cotización' show={showEditCot} onClose={onOpenEditCot}>
        <CotEditForm reload={reload} onReload={onReload} cotizacion={recibo} onOpenEditCot={onOpenEditCot} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal title='Agregar concepto' show={showConcep} onClose={onOpenCloseConcep}>
        <CotConceptosForm reload={reload} onReload={onReload} onOpenCloseConcep={onOpenCloseConcep} onAddConcept={onAddConcept} reciboId={reciboId?.id || []} onToastSuccess={onToastSuccess} />
      </BasicModal>

      <BasicModal title='Modificar concepto' show={showEditConcep} onClose={onOpenCloseEditConcep}>
        <CotConceptosEditForm
          reload={reload}
          onReload={onReload}
          conceptToEdit={currentConcept}
          onOpenCloseEditConcep={onOpenCloseEditConcep}
          onOpenCloseConfirm={onOpenCloseConfirm}
        />
      </BasicModal>

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
        onConfirm={handleDeleteConcept}
        onCancel={onOpenCloseConfirm}
        content='¿ Estas seguro de eliminar el concepto ?'
      />

      <Confirm
        open={showConfirmDel}
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
        onConfirm={handleDeleteCot}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la cotización ?'
      />

    </>

  )
}
