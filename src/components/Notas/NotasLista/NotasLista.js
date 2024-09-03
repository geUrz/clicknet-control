import { useEffect, useState } from 'react'
import axios from 'axios'
import { map, size } from 'lodash'
import { FaCheck, FaInfoCircle, FaTimes } from 'react-icons/fa'
import { formatId } from '@/helpers'
import { Loading, ListEmpty, ToastSuccess } from '@/components/Layouts'
import { BasicModal } from '@/layouts'
import { NotaDetalles } from '../NotaDetalles'
import { Confirm, Image } from 'semantic-ui-react'
import styles from './NotasLista.module.css'

export function NotasLista(props) {

  const{reload, onReload} = props

  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [notas, setNotas] = useState()
  const [notaSeleccionada, setNotaSeleccionada] = useState(null)
  const[toastSuccess, setToastSuccess] = useState(false)
  const[toastSuccessConfirm, setToastSuccessConfirm] = useState(false)
  const[toastSuccessDelete, setToastSuccessDelete] = useState(false)
  
  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  const onToastSuccessConfirm = () => {
    setToastSuccessConfirm(true)
    setTimeout(() => {
      setToastSuccessConfirm(false)
    }, 3000)
  }

  const onToastSuccessDelete = () => {
    setToastSuccessDelete(true)
    setTimeout(() => {
      setToastSuccessDelete(false)
    }, 3000)
  }

  const fetchNotas = async () => {
    try {
        const response = await axios.get('/api/notas');
        setNotas(response.data)
    } catch (error) {
        console.error('Error fetching notas:', error);
    }
}

useEffect(() => {
    fetchNotas()
}, [reload])

  const onShowConfirm = () => setShowConfirm((prevState) => !prevState)
 
  const onOpenClose = async (nota) => {
    try {
      const response = await axios.get(`/api/conceptos?nota_id=${nota.id}`)
      nota.conceptos = response.data
      setNotaSeleccionada(nota)
      setShow((prevState) => !prevState)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
    }
  }

  const onDeleteNota = async (notaId) => {
    try {
      const response = await axios.delete(`/api/notas`, {
        params: { id: notaId },
      })
      if (response.status === 200) {
        setNotas((prevState) => prevState.filter((nota) => nota.id !== notaId))
        setShow(false)
        onShowConfirm()
        onToastSuccessConfirm()

      } else {
        console.error('Error al eliminar la nota: Respuesta del servidor no fue exitosa', response)
      }
    } catch (error) {
      console.error('Error al eliminar la nota:', error.response || error.message || error)
    }
  }

  const onDeleteConcept = async (conceptoId) => {
    try {
      const response = await axios.delete(`/api/conceptos`, {
        params: { concepto_id: conceptoId },
      })
      if (response.status === 200) {
        setNotaSeleccionada((prevState) => ({
          ...prevState,
          conceptos: prevState.conceptos.filter((concepto) => concepto.id !== conceptoId),
        }))
        onToastSuccessDelete()
      } else {
        console.error('Error al eliminar el concepto: Respuesta del servidor no fue exitosa', response);
      }
    } catch (error) {
      console.error('Error al eliminar el concepto:', error.response || error.message || error);
    }
  }

  const onAddConcept = (concept) => {
    setNotaSeleccionada((prevState) => ({
      ...prevState,
      conceptos: [...prevState.conceptos, concept],
    }))
    onReload()
  }

  return (

    <>

      {toastSuccess && <ToastSuccess contain='Concepto creado exitosamente' onClose={() => setToastSuccess(false)} />}

      {toastSuccessConfirm && <ToastSuccess contain='Nota eliminada exitosamente' onClose={() => setToastSuccessConfirm(false)} />}

      {toastSuccessDelete && <ToastSuccess contain='Concepto eliminado exitosamente' onClose={() => setToastSuccessConfirm(false)} />}

      {!notas ? (
        <Loading size={45} loading={1} />
      ) : (
        size(notas) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(notas, (nota) => (
              <div key={nota.id} className={styles.rowMap} onClick={() => onOpenClose(nota)}>
                <h1>{formatId(nota.id)}</h1>
                <h1>{nota.cliente}</h1>
                <h1>{nota.marca}</h1>
                <h1><FaInfoCircle /></h1>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles de la nota' show={show} onClose={onOpenClose}>
        <NotaDetalles notas={notaSeleccionada} notaId={notaSeleccionada} reload={reload} onReload={onReload} onShowConfirm={onShowConfirm} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} onAddConcept={onAddConcept} onDeleteNota={onDeleteNota} onDeleteConcept={onDeleteConcept} />
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
        onConfirm={() => onDeleteNota(notaSeleccionada.id)}
        onCancel={onShowConfirm}
        content='¿ Estas seguro de eliminar la nota ?'
      />

    </>

  )
}
