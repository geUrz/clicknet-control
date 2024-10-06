import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaUserMd } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { VisitaProvDetalles } from '../VisitaProvDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Dropdown, Form, FormField, FormGroup, Label } from 'semantic-ui-react'
import { formatDateInc, formatDateVT } from '@/helpers'
import { getStatusClassVisita } from '@/helpers/getStatusClass/getStatusClass'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './VisitaProvsList.module.css'

export function VisitaProvsList(props) {

  const { reload, onReload, visitaprovs, onToastSuccessVisitaprovMod, onToastSuccessVisitaprovDel } = props

  const { loading } = useAuth()

  const [showDetalles, setShowDetalles] = useState(false)
  const [visitaprovSeleccionada, setVisitaprovSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (visitaprov) => {
    setVisitaprovSeleccionada(visitaprov)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setVisitaprovSeleccionada(null)
    setShowDetalles(false)
  }

  const [filterEstado, setFilterEstado] = useState('')
  const [filterFecha, setFilterFecha] = useState(null)

  const filteredVisitaprov = (visitaprovs || []).filter((visitaprov) => {
    return (
      (filterEstado === '' || filterEstado === 'Todas' || visitaprov.estado === filterEstado) &&
      (filterFecha === null || formatDateInc(visitaprov.createdAt) === formatDateInc(filterFecha))
    )
  })

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

      <div className={styles.filters}>

        <h1>Buscar por:</h1>

        <Form>
          <FormGroup>
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
        size(filteredVisitaprov) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(filteredVisitaprov, (visitaprov) => {
              const statusClass = getStatusClassVisita(visitaprov.estado)

              return (
                <div key={visitaprov.id} className={styles.section} onClick={() => onOpenDetalles(visitaprov)}>
                  <div className={`${styles[statusClass]}`}>
                    <div className={styles.column1}>
                      <FaUserMd />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Visita provedor</h1>
                        <h2>{visitaprov.visitaprovedor}</h2>
                      </div>
                      <div>
                        <h1>Fecha</h1>
                        <h2>{formatDateVT(visitaprov.createdAt)}</h2>
                      </div>
                      <div>
                        <h1>Autorizó</h1>
                        <h2>{visitaprov.usuario_nombre}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles de la visita provedor' show={showDetalles} onClose={onCloseDetalles}>
        {visitaprovSeleccionada && (
          <VisitaProvDetalles
            reload={reload}
            onReload={onReload}
            visitaprov={visitaprovSeleccionada}
            onOpenCloseDetalles={onCloseDetalles}
            onToastSuccessVisitaprovMod={onToastSuccessVisitaprovMod}
            onToastSuccessVisitaprovDel={onToastSuccessVisitaprovDel}
          />
        )}
      </BasicModal>

    </>

  )
}
