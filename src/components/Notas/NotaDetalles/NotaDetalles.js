import { FirmaDigital, IconCloseModal, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { formatCurrency, formatDate, formatId } from '@/helpers'
import { NotasRowHeadModal } from '../NotasRowHead'
import { useEffect, useState } from 'react'
import { BiToggleLeft, BiToggleRight } from 'react-icons/bi'
import { FaCheck, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { NotaConceptos } from '../NotaConceptos'
import { BasicModal, ModalForm } from '@/layouts'
import { NotaConceptosForm } from '../NotaConceptosForm'
import { Button, Confirm, Form, FormField, FormGroup, Image, Label, TextArea } from 'semantic-ui-react'
import { NotaPDF } from '../NotaPDF'
import { useAuth } from '@/contexts/AuthContext'
import styles from './NotaDetalles.module.css'
import axios from 'axios'
import { size } from 'lodash'

export function NotaDetalles(props) {

  const { notas, notaId, reload, onReload, onOpenClose, onAddConcept, onDeleteConcept, onShowConfirm } = props

  const { user } = useAuth()

  const [showForm, setShowForm] = useState(false)
  const [showModalFirma, setShowModalFirma] = useState(false)
  const [showConfirmFirma, setShowConfirmFirma] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentConcept, setCurrentConcept] = useState(null)
  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessPDF, setToastSuccessPDF] = useState(false)
  const [toastSuccessFirma, setToastSuccessFirma] = useState(false)
  const [toastSuccessDelete, setToastSuccessDelete] = useState(false)

  const [nota, setNota] = useState(notas.nota || '')
  const [firma, setFirma] = useState(null)
  const [notaNota, setnotaNota] = useState('')
  const [editNota, setEditNota] = useState(!!notas.nota)
  const onOpenCloseFirma = () => setShowModalFirma((prevState) => !prevState)
  const onOpenCloseConfirmFirma = () => setShowConfirmFirma((prevState) => !prevState)
  const [showFirma, setShowFirma] = useState(false)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent || ''
    const mobile = /Mobile|Android|iP(hone|od|ad)|IEMobile|Opera Mini/i.test(userAgent)
    setIsMobile(mobile)
  }, [])

  const SWIPE_THRESHOLD = 150

  const [startCoords, setStartCoords] = useState(null)
  const [isSwiping, setIsSwiping] = useState(false)

  const [activate, setActivate] = useState(false)

  // Maneja el inicio del deslizamiento
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    setStartCoords({ x: touch.clientX, y: touch.clientY })
    setIsSwiping(true)
  }

  // Maneja el movimiento del deslizamiento
  const handleTouchMove = (e) => {
    if (!isSwiping) return

    const touch = e.touches[0]
    const endCoords = { x: touch.clientX, y: touch.clientY }

    // Calcula la distancia del deslizamiento
    const deltaX = endCoords.x - startCoords.x
    const deltaY = endCoords.y - startCoords.y
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)

    // Si el deslizamiento supera el umbral, activa la acción
    if (distance > SWIPE_THRESHOLD) {
      setActivate(true)
    }
  }

  const handleTouchClick = () => {
    setActivate(false)
  }

  useEffect(() => {
    setEditNota(!!notas.nota)
  }, [notas.nota])

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  const onToastSuccessPDF = () => {
    setToastSuccessPDF(true)
    setTimeout(() => {
      setToastSuccessPDF(false)
    }, 3000)
  }

  const onToastSuccessFirma = () => {
    setToastSuccessFirma(true)
    setTimeout(() => {
      setToastSuccessFirma(false)
    }, 3000)
  }

  const onToasSuccesstDelete = () => {
    setToastSuccessDelete(true)
    setTimeout(() => {
      setToastSuccessDelete(false)
    }, 3000)
  }

  const onOpenCloseConfirm = (concepto) => {
    setShowConfirm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const onOpenCloseForm = (concepto) => {
    setShowForm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const handleDeleteConcept = () => {
    onDeleteConcept(currentConcept)
    setShowConfirm(false)
  }

  const [toggleIVA, setToggleIVA] = useState(false)

  const onIVA = async () => {
    try {

      const newToggleIVA = !toggleIVA
      setToggleIVA(newToggleIVA)
      const subtotal = notas.conceptos.reduce((sum, concepto) => sum + concepto.precio * concepto.cantidad, 0);
      const iva = subtotal * 0.16;

      await axios.put(`/api/notas?id=${notaId.id}`, { iva: newToggleIVA ? iva : 0 })
      
    } catch (error) {
      console.error('Error al actualizar el IVA:', error)
    }
  }

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA))
  }, [toggleIVA])

  const subtotal = notas.conceptos.reduce((sum, concepto) => sum + concepto.precio * concepto.cantidad, 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  const handleNotaChange = (e) => {
    setNota(e.target.value);
  }

  const handleAddNota = async () => {
    try {

      const response = await axios.put(`/api/notas?id=${notaId.id}`, { nota })

      if (response.status === 200) {
        setEditNota(!!nota)

        const updateNota = { ...notas, nota }
        setnotaNota(updateNota)
        onReload()
        onToastSuccess()
      }
    } catch (error) {
      console.error('Error al actualizar la nota:', error.response?.data || error.message);
    }
  }

  useEffect(() => {
    if (notas) {
      fetchFirma()
    }
  }, [notas])



  const fetchFirma = async () => {
    try {
      const response = await axios.get(`/api/notas?id=${notaId.id}&firma=true`);
      if (response.status === 200) {
        setFirma(response.data.firma)

        setTimeout(() => {
          setShowFirma(true)
        }, 1000)
      }
    } catch (error) {
      console.error('Error al obtener la firma:', error)
    }
  }

  const removeSignature = async () => {
    try {
      const response = await axios.put(`/api/notas?id=${notaId.id}`, {
        firma: null
      })

      if (response.status === 200) {
        console.log('Firma eliminada exitosamente')
        onToasSuccesstDelete()
        fetchFirma()
        onReload()
        onOpenCloseConfirmFirma()
      }
    } catch (error) {
      console.error('Error al eliminar la firma:', error)
    }
  }

  return (

    <>

      <IconCloseModal onOpenClose={onOpenClose} />

      {toastSuccess && <ToastSuccess contain='Concepto agregado exitosamente' onClose={() => setToastSuccess(false)} />}

      {toastSuccessPDF && <ToastSuccess contain='PDF creado exitosamente' onClose={() => setToastSuccessPDF(false)} />}

      {toastSuccessFirma && <ToastSuccess contain='Firma creada exitosamente' onClose={() => setToastSuccessPDF(false)} />}

      {toastSuccessDelete && <ToastDelete contain='Firma eliminada exitosamente' onClose={() => setToastSuccessPDF(false)} />}

      <div className={styles.section} onClick={handleTouchClick}>

        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Cliente</h1>
              <h1>{notas.cliente}</h1>
            </div>
            <div>
              <h1>Folio</h1>
              <h1>{formatId(notas.id)}</h1>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Marca / Modelo</h1>
              <h1>{notas.marca}</h1>
            </div>
            <div>
              <h1>Fecha</h1>
              <h1>{formatDate(notas.createdAt)}</h1>
            </div>
          </div>
        </div>

        <NotasRowHeadModal rowMain />

        <NotaConceptos conceptos={notas.conceptos} onOpenCloseConfirm={onOpenCloseConfirm} handleDeleteConcept={handleDeleteConcept} />

        <div className={styles.iconPlus}>
          <div onClick={onOpenCloseForm}>
            <FaPlus />
          </div>
        </div>

        <div className={styles.boxMain}>
          <div className={styles.box3_0}>

            {firma ? (
              showFirma ? (
                <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
                  <Image src={firma} alt="Firma" />
                  {activate && (
                    <div className={styles.activateTrash} onClick={onOpenCloseConfirmFirma}>
                      <div>
                        <FaTrash />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Loading size={25} loading={4} />
              )
            ) : (
              <div className={styles.iconFirmaPlus} onClick={onOpenCloseFirma}>
                <FaPlus />
              </div>
            )}

            <div className={styles.linea}></div>
            <div className={styles.firmaIsMobile}>
              <h1>Firma</h1>
              {isMobile ? (
                ''
              ) : (
                notas.firma ? (
                  <FaTrash onClick={onOpenCloseConfirmFirma} />
                ) : (
                  ''
                )
              )}
            </div>
          </div>

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
        
        <div className={styles.formNota}>
          <Form>
            <FormGroup>
              <FormField>
                <Label>
                  Nota:
                </Label>
                <TextArea
                  value={nota}
                  onChange={handleNotaChange}
                  placeholder="Escribe una nota aquí..."
                />
              </FormField>
            </FormGroup>
            <Button secondary onClick={handleAddNota}>
              {editNota ? 'Modificar nota' : 'Añadir nota'}
            </Button>
          </Form>
        </div>

        <NotaPDF notas={notas} conceptos={notas.conceptos} notaNota={notaNota.nota} firma={firma} onToastSuccessPDF={onToastSuccessPDF} />

        <div className={styles.footerDetalles}>
          <div>
            <h1>creada por:
              {!user ? (
                <span> - no disponible -</span>
              ) : (
                <span> {user.usuario}</span>
              )}
            </h1>
          </div>
          <div onClick={onShowConfirm}>
            <FaTrash />
          </div>
        </div>
      </div>

      <ModalForm title='Agregar concepto' showForm={showForm} onClose={onOpenCloseForm}>
        <NotaConceptosForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onAddConcept={onAddConcept} notaId={notaId.id} onToastSuccess={onToastSuccess} />
      </ModalForm>

      <BasicModal title='Crear firma' show={showModalFirma} onClose={onOpenCloseFirma}>
        <FirmaDigital reload={reload} onReload={onReload} fetchFirma={fetchFirma} notaId={notaId.id} onToastSuccessFirma={onToastSuccessFirma} onOpenCloseFirma={onOpenCloseFirma} />
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
        open={showConfirmFirma}
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
        onConfirm={removeSignature}
        onCancel={onOpenCloseConfirmFirma}
        content='¿ Estas seguro de eliminar la firma ?'
      />

    </>

  )
} 
