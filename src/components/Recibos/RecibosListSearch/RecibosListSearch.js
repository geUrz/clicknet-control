import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { FaFileInvoice } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { CotDetalles } from '../ReciboDetalles'
import styles from './RecibosListSearch.module.css'
import axios from 'axios'

export function RecibosListSearch(props) {

  const { reload, onReload, cotizaciones, onToastSuccessMod, onToastSuccessDel } = props

  const [show, setShow] = useState(false)
  const [cotizacionSeleccionado, setCotizacionSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenClose = async (cotizacion) => {
    try {
      const response = await axios.get(`/api/cotizaciones/conceptos?cotizacion_id=${cotizacion.id}`)
      cotizacion.conceptos = response.data
      setCotizacionSeleccionado(cotizacion)
      setShow((prevState) => !prevState)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
    }
  }

  const onCloseDetalles = () => {
    setVisitaSeleccionada(null)
    setShowDetalles(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800) 

    return () => clearTimeout(timer)
  }, [])

  return (

    <>

      {showLoading ? 
        <Loading size={45} loading={1} /> :
        <div className={styles.main}>
            {map(cotizaciones, (cotiacion) => (
             <div key={cotiacion.id} className={styles.section} onClick={() => onOpenClose(cotiacion)}>
             <div>
               <div className={styles.column1}>
                 <FaFileInvoice />
               </div>
               <div className={styles.column2}>
                 <div>
                   <h1>Tipo de evento</h1>
                   <h2>{cotiacion.tipo_evento}</h2>
                 </div>
                 <div>
                   <h1>Cliente</h1>
                   <h2>{cotiacion.cliente_nombre}</h2>
                 </div>
               </div>
             </div>
           </div>
            ))}
          </div>
      }

      <BasicModal title='detalles de la cotización' show={show} onClose={onCloseDetalles}>
        {cotizacionSeleccionado && (
          <CotDetalles
            reload={reload}
            onReload={onReload}
            cotizaciones={cotizacionSeleccionado} 
            cotizacionId={cotizacionSeleccionado}
            onOpenClose={onOpenClose}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
