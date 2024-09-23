import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaUserFriends } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { VisitaDetalles } from '../VisitaDetalles'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Form, FormField, FormGroup, Label } from 'semantic-ui-react'
import { formatDateInc } from '@/helpers'
import { getStatusClassVisita } from '@/helpers/getStatusClass/getStatusClass'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './VisitasList.module.css'

export function VisitasList(props) {

  const { reload, onReload, visitas, onToastSuccessVisitaMod, onToastSuccessVisitaDel } = props

  const { loading } = useAuth()

  const [showDetalles, setShowDetalles] = useState(false)
  const [visitaSeleccionada, setVisitaSeleccionada] = useState(null)

  const onOpenDetalles = (visita) => {
    setVisitaSeleccionada(visita)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setVisitaSeleccionada(null)
    setShowDetalles(false)
  }

  const [filterTipovisita, setFilterTipovisita] = useState('')
  const [filterTipoacceso, setFilterTipoacceso] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterFecha, setFilterFecha] = useState(null)

  const filteredVisitas = (visitas || []).filter((visita) => {
    return (
      (filterTipovisita === '' || visita.tipovisita === filterTipovisita) &&
      (filterTipoacceso === '' || visita.tipoacceso === filterTipoacceso) &&
      (filterEstado === '' || visita.estado === filterEstado) &&
      (filterFecha === null || visita.date === formatDateInc(filterFecha) || visita.fromDate === formatDateInc(filterFecha))
    )
  })

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <>

      <div className={styles.filters}>

        <h1>Buscar por:</h1>

        <Form>
          <FormGroup>
            <Label className={styles.label}>Tipo de visita</Label>
            <FormField
              control='select'
              value={filterTipovisita}
              onChange={(e) => setFilterTipovisita(e.target.value)}
            >
              <option value="">Todos</option>
              <option value='Familiar'>Familiar</option>
              <option value='Amigo'>Amigo</option>
              <option value='Proveedor'>Proveedor</option>
              <option value='Paquetería'>Paquetería</option>
              <option value='Didi, Uber, Rappi'>Didi, Uber, Rappi</option>
            </FormField>

            <Label className={styles.label}>Tipo de acceso</Label>
            <FormField
              control='select'
              value={filterTipoacceso}
              onChange={(e) => setFilterTipoacceso(e.target.value)}
            >
              <option value="">Todos</option>
              <option value='Eventual'>Eventual</option>
              <option value='Frecuente'>Frecuente</option>
            </FormField>

            <Label className={styles.label}>Estatus</Label>
            <FormField
              control='select'
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Sin ingresar">Sin ingresar</option>
              <option value="Ingresado">Ingresado</option>
              <option value="Retirado">Retirado</option>
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

      {!visitas ? (
        <Loading size={45} loading={2} />
      ) : (
        size(filteredVisitas) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(filteredVisitas, (visita) => {
              const statusClass = getStatusClassVisita(visita.estado)

              return (
                <div key={visita.id} className={styles.section} onClick={() => onOpenDetalles(visita)}>
                  <div className={`${styles[statusClass]}`}>
                    <div className={styles.column1}>
                      <FaUserFriends />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Visita</h1>
                        <h2>{visita.visita}</h2>
                      </div>
                      <div >
                        <h1>Tipo de visita</h1>
                        <h2>{visita.tipovisita}</h2>
                      </div>
                      <div>
                        <h1>Tipo de acceso</h1>
                        <h2>{visita.tipoacceso}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles de la visita' show={showDetalles} onClose={onCloseDetalles}>
        {visitaSeleccionada && (
          <VisitaDetalles
            reload={reload}
            onReload={onReload}
            visita={visitaSeleccionada}
            onOpenCloseDetalles={onCloseDetalles}
            onToastSuccessVisitaMod={onToastSuccessVisitaMod}
            onToastSuccessVisitaDel={onToastSuccessVisitaDel}
          />
        )}
      </BasicModal>

    </>

  )
}
