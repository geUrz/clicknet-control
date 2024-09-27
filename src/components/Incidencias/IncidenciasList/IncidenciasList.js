import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaFileAlt } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { IncidenciaDetalles } from '../IncidenciaDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Form, FormField, FormGroup, Label } from 'semantic-ui-react'
import { formatDateInc } from '@/helpers'
import { getStatusClass } from '@/helpers/getStatusClass/getStatusClass'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './IncidenciasList.module.css'

export function IncidenciasList(props) {

  const { reload, onReload, incidencias, onToastSuccessIncidenciaMod, onToastSuccessIncidenciaMDel } = props

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

  const [filterZona, setFilterZona] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterFecha, setFilterFecha] = useState(null)

  const filteredIncidencias = (incidencias || []).filter((incidencia) => {
    
    return (
      (filterZona === '' || incidencia.zona === filterZona) &&
      (filterEstado === '' || incidencia.estado === filterEstado) &&
      (filterFecha === null || formatDateInc(incidencia.createdAt) === formatDateInc(filterFecha))
    )
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 1000) 

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
            <Label className={styles.label}>Zona</Label>
            <FormField
              control='select'
              value={filterZona}
              onChange={(e) => setFilterZona(e.target.value)}
            >
              <option value="">Todas</option>
              <option value='Caseta'>Caseta</option>
              <option value="León">León</option>
              <option value="Calet">Calet</option>
              <option value="Yza">Yza</option>
              <option value="Páramo">Páramo</option>
            </FormField>

            <Label className={styles.label}>Estatus</Label>
            <FormField
              control='select'
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Realizada">Realizada</option>
            </FormField>

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
            onToastSuccessIncidenciaMDel={onToastSuccessIncidenciaMDel}
          />
        )}
      </BasicModal>

    </>

  )
}
