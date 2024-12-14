import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaFileAlt } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { OrdenServicioDetalles } from '../OrdenServicioDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Dropdown, Form, FormField, FormGroup, Label } from 'semantic-ui-react'
import { formatDate, formatDateInc } from '@/helpers'
import { getStatusClass } from '@/helpers/getStatusClass/getStatusClass'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './OrdenServicioList.module.css'

export function OrdenServicioList(props) {

  const { reload, onReload, ordenservicio, onToastSuccessOrdenservicioMod, onToastSuccessOrdenservicioDel } = props

  const { loading } = useAuth()

  const [showDetalles, setShowDetalles] = useState(false)
  const [ordenservicioSeleccionada, setOrdenservicioSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (ordenservicio) => {
    setOrdenservicioSeleccionada(ordenservicio)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setOrdenservicioSeleccionada(null)
    setShowDetalles(false)
  }

  const [filterEstado, setFilterEstado] = useState('')
  const [filterFecha, setFilterFecha] = useState(null)

  const filteredOrdenservicio = (ordenservicio || []).filter((ordenservicio) => {
    return (
      (filterEstado === '' || filterEstado === 'Todas' || ordenservicio.estado === filterEstado) &&
      (filterFecha === null || ordenservicio.date === formatDateInc(filterFecha))
    )
  })

  const opcionesEstado = [
    { key: 1, text: 'Todas', value: 'Todas' },
    { key: 2, text: 'Pendiente', value: 'Pendiente' },
    { key: 3, text: 'En proceso', value: 'En proceso' },
    { key: 4, text: 'Realizada', value: 'Realizada' }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800) 

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <>

      <div className={styles.filters}>

        <h1>Buscar por:</h1>

        <Form>
          <FormGroup>
          <Label className={styles.label}>Estatus</Label>
            <Dropdown
                placeholder='Todas'
                fluid
                selection
                options={opcionesEstado}
                value={filterEstado}
                onChange={(e, data) => setFilterEstado(data.value)}
              />
            <Label className={styles.label}>Fecha</Label>
            <FormField>
              <DatePicker
                selected={filterFecha}
                onChange={(date) => setFilterFecha(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/aaaa"
                locale="es"
                isClearable
                showPopperArrow={false}
                popperPlacement="bottom"
              />
            </FormField>
          </FormGroup>
        </Form>
      </div>

      {showLoading ? (
        <Loading size={45} loading={1} />
      ) : (
        size(filteredOrdenservicio) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(filteredOrdenservicio, (ordenservicio) => {
              const statusClass = getStatusClass(ordenservicio.estado)

              return (
                <div key={ordenservicio.id} className={styles.section} onClick={() => onOpenDetalles(ordenservicio)}>
                  <div className={`${styles[statusClass]}`}>
                    <div className={styles.column1}>
                      <FaFileAlt />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Órden de servicio</h1>
                        <h2>{ordenservicio.nombre}</h2>
                      </div>
                      <div >
                        <h1>Fecha</h1>
                        <h2>{formatDate(ordenservicio.date)}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles de la órden de servicio' show={showDetalles} onClose={onCloseDetalles}>
        {ordenservicioSeleccionada && (
          <OrdenServicioDetalles
            reload={reload}
            onReload={onReload}
            ordenservicio={ordenservicioSeleccionada}
            onOpenCloseDetalles={onCloseDetalles}
            onToastSuccessOrdenservicioMod={onToastSuccessOrdenservicioMod}
            onToastSuccessOrdenservicioDel={onToastSuccessOrdenservicioDel}
          />
        )}
      </BasicModal>

    </>

  )
}
