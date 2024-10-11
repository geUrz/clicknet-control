import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaFileAlt } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { IncidenciaDetalles } from '../IncidenciaDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Dropdown, Form, FormField, FormGroup, Label } from 'semantic-ui-react'
import { formatDateInc } from '@/helpers'
import { getStatusClass } from '@/helpers/getStatusClass/getStatusClass'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './IncidenciasList.module.css'

export function IncidenciasList(props) {

  const { reload, onReload, incidencias, onToastSuccessIncidenciaMod, onToastSuccessIncidenciaDel } = props

  const { loading } = useAuth()

  const [showDetalles, setShowDetalles] = useState(false)
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (incidencia) => {
    setIncidenciaSeleccionada(incidencia)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setIncidenciaSeleccionada(null)
    setShowDetalles(false)
  }

  const [filterEstado, setFilterEstado] = useState('')
  const [filterFecha, setFilterFecha] = useState(null)

  const filteredIncidencias = (incidencias || []).filter((incidencia) => {
    return (
      (filterEstado === '' || filterEstado === 'Todas' || incidencia.estado === filterEstado) &&
      (filterFecha === null || formatDateInc(incidencia.createdAt) === formatDateInc(filterFecha))
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
        <Loading size={45} loading={2} />
      ) : (
        size(filteredIncidencias) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(filteredIncidencias, (incidencia) => {
              const statusClass = getStatusClass(incidencia.estado)

              return (
                <div key={incidencia.id} className={styles.section} onClick={() => onOpenDetalles(incidencia)}>
                  <div className={`${styles[statusClass]}`}>
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
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles de la incidencia' show={showDetalles} onClose={onCloseDetalles}>
        {incidenciaSeleccionada && (
          <IncidenciaDetalles
            reload={reload}
            onReload={onReload}
            incidencia={incidenciaSeleccionada}
            onOpenCloseDetalles={onCloseDetalles}
            onToastSuccessIncidenciaMod={onToastSuccessIncidenciaMod}
            onToastSuccessIncidenciaDel={onToastSuccessIncidenciaDel}
          />
        )}
      </BasicModal>

    </>

  )
}
