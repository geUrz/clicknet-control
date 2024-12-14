import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaUserFriends } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { VisitaDetalles } from '../VisitaDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Dropdown, Form, FormField, FormGroup, Label } from 'semantic-ui-react'
import { formatDateInc } from '@/helpers'
import { getStatusClassVisita } from '@/helpers/getStatusClass/getStatusClass'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './VisitasList.module.css'

export function VisitasList(props) {

  const { reload, onReload, visitas, onToastSuccessVisitaMod, onToastSuccessVisitaDel, activateFilter=true } = props

  const { loading } = useAuth()

  const [showDetalles, setShowDetalles] = useState(false)
  const [visitaSeleccionada, setVisitaSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

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
      (filterTipovisita === '' || filterTipovisita === 'Todas' || visita.tipovisita === filterTipovisita) &&
      (filterTipoacceso === '' || filterTipoacceso === 'Todas' || visita.tipoacceso === filterTipoacceso) &&
      (filterEstado === '' || filterEstado === 'Todas' || visita.estado === filterEstado) &&
      (filterFecha === null || visita.date === formatDateInc(filterFecha) || visita.fromDate === formatDateInc(filterFecha))
    )
  })

  const opcionesTipovisita = [
    { key: 1, text: 'Todas', value: 'Todas' },
    { key: 2, text: 'Familia', value: 'Familia' },
    { key: 3, text: 'Amigo', value: 'Amigo' },
    { key: 4, text: 'Proveedor', value: 'Proveedor' },
    { key: 5, text: 'Diddi, Uber, Rappi', value: 'Diddi, Uber, Rappi' }
  ]

  const opcionesTipoacceso = [
    { key: 1, text: 'Todas', value: 'Todas' },
    { key: 2, text: 'Eventual', value: 'eventual' },
    { key: 3, text: 'Frecuente', value: 'frecuente' }
  ]

  const opcionesEstado = [
    { key: 1, text: 'Todas', value: 'Todas' },
    { key: 2, text: 'Sin ingresar', value: 'Sin ingresar' },
    { key: 3, text: 'Ingresado', value: 'Ingresado' },
    { key: 4, text: 'Retirado', value: 'Retirado' }
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

      {activateFilter ? 
        <>
          <div className={styles.filters}>

<h1>Buscar por:</h1>

<Form>
  <FormGroup>
    <Label className={styles.label}>Tipo visita</Label>
    <Dropdown
      placeholder='Todas'
      fluid
      selection
      options={opcionesTipovisita}
      value={filterTipovisita}
      onChange={(e, data) => setFilterTipovisita(data.value)}
    />

    <Label className={styles.label}>Tipo acceso</Label>
    <Dropdown
      placeholder='Todas'
      fluid
      selection
      options={opcionesTipoacceso}
      value={filterTipoacceso}
      onChange={(e, data) => setFilterTipoacceso(data.value)}
    />

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
        </>
      : ''}

      {showLoading ? (
        <Loading size={45} loading={1} />
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
                        <h1>Nombre de la visita</h1>
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
