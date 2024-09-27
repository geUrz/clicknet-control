import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaUserCog } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { VisitaTecnicaDetalles } from '../VisitaTecnicaDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Form, FormField, FormGroup, Label } from 'semantic-ui-react'
import { convertTo12HourFormat, formatDate, formatDateInc } from '@/helpers'
import { getStatusClass } from '@/helpers/getStatusClass/getStatusClass'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './VisitaTecnicaList.module.css'

export function VisitaTecnicaList(props) {

  const { reload, onReload, visitatecnicas, onToastSuccessVisitatecnicaMod, onToastSuccessVisitatecnicaDel } = props

  const { loading } = useAuth()

  const [showDetalles, setShowDetalles] = useState(false)
  const [visitatecnicaSeleccionada, setVisitatecnicaSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (visitatecnica) => {
    setVisitatecnicaSeleccionada(visitatecnica)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setVisitatecnicaSeleccionada(null)
    setShowDetalles(false)
  }

  const [filterFecha, setFilterFecha] = useState(null)

  const filteredVisitatecnica = (visitatecnicas || []).filter((visitatecnica) => {
    return (
      (filterFecha === null || visitatecnica.date === formatDateInc(filterFecha))
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
        size(filteredVisitatecnica) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(filteredVisitatecnica, (visitatecnica) => {
              const statusClass = getStatusClass(visitatecnica.estado)

              return (
                <div key={visitatecnica.id} className={styles.section} onClick={() => onOpenDetalles(visitatecnica)}>
                  <div className={`${styles[statusClass]}`}>
                    <div className={styles.column1}>
                      <FaUserCog />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Visita técnica</h1>
                        <h2>{visitatecnica.visitatecnica}</h2>
                      </div>
                      <div >
                        <h1>Fecha</h1>
                        <h2>{formatDate(visitatecnica.date)}</h2>
                      </div>
                      <div >
                        <h1>Hora</h1>
                        <h2>{convertTo12HourFormat(visitatecnica.hora)}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles de la visita técnica' show={showDetalles} onClose={onCloseDetalles}>
        {visitatecnicaSeleccionada && (
          <VisitaTecnicaDetalles
            reload={reload}
            onReload={onReload}
            visitatecnica={visitatecnicaSeleccionada}
            onOpenCloseDetalles={onCloseDetalles}
            onToastSuccessVisitatecnicaMod={onToastSuccessVisitatecnicaMod}
            onToastSuccessVisitatecnicaDel={onToastSuccessVisitatecnicaDel}
          />
        )}
      </BasicModal>

    </>

  )
}
