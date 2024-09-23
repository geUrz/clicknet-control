import { map, size } from 'lodash'
import { ListEmpty } from '@/components/Layouts'
import { FaFileAlt } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { IncidenciaDetalles } from '../IncidenciaDetalles'
import styles from './PubById.module.css'
import { useState } from 'react'

export function PubById(props) {

  const {reload, onReload, incidencias, onToastSuccessIncidenciaMod, onToastSuccessIncidenciaMDel} = props

  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null)

  const [showDetalles, setShowDetalles] = useState(null)

  const onOpenDetalles = (incidencia) => {
    setIncidenciaSeleccionada(incidencia)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setIncidenciaSeleccionada(null)
    setShowDetalles(false)
  }

  return (

    <>

      {size(incidencias) === 0 ? (
        <ListEmpty />
      ) : (
        <div className={styles.main}>
          {map(incidencias, (incidencia) => (
            <div key={incidencia.id} className={styles.section} onClick={() => onOpenDetalles(incidencia)}>
              <div>
                <div className={styles.column1}>
                  <FaFileAlt />
                </div>
                <div className={styles.column2}>
                  <div >
                    <h1>Incidencia</h1>
                    <h2>{incidencia.incidencia}</h2>
                  </div>
                  <div >
                    <h1>Zona</h1>
                    <h2>{incidencia.zona}</h2>
                  </div>
                  <div>
                    <h1>Estatus</h1>
                    <h2>{incidencia.estado}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
      }

      <BasicModal title='detalles de la incidencia' show={showDetalles} onClose={onOpenDetalles}>
        <IncidenciaDetalles reload={reload} onReload={onReload} incidencia={incidenciaSeleccionada} onOpenCloseDetalles={onCloseDetalles} onToastSuccessIncidenciaMod={onToastSuccessIncidenciaMod} onToastSuccessIncidenciaMDel={onToastSuccessIncidenciaMDel} />
      </BasicModal>

    </>

  )
}
