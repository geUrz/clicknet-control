import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaBullhorn } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { AnuncioDetalles } from '../AnuncioDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Form, FormField, FormGroup, Label } from 'semantic-ui-react'
import { convertTo12HourFormat, formatDate, formatDateInc } from '@/helpers'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './AnunciosList.module.css'

export function AnunciosList(props) {

  const { reload, onReload, anuncios, onToastSuccessAnuncioMod, onToastSuccessAnuncioDel } = props

  const { loading } = useAuth()

  const [showDetalles, setShowDetalles] = useState(false)
  const [anuncioseleccionada, setAnuncioSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (anuncio) => {
    setAnuncioSeleccionada(anuncio)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setAnuncioSeleccionada(null)
    setShowDetalles(false)
  }

  const [filterFecha, setFilterFecha] = useState(null)

  const filteredanuncios = (anuncios || []).filter((anuncio) => {
    return (
      (filterFecha === null || anuncio.date === formatDateInc(filterFecha))
    )
  })

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
        size(filteredanuncios) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(filteredanuncios, (anuncio) => (
              <div key={anuncio.id} className={styles.section} onClick={() => onOpenDetalles(anuncio)}>
                <div>
                  <div className={styles.column1}>
                    <FaBullhorn />
                  </div>
                  <div className={styles.column2}>
                    <div >
                      <h1>Anuncio</h1>
                      <h2>{anuncio.anuncio}</h2>
                    </div>
                    <div >
                      <h1>Fecha</h1>
                      <h2>{formatDate(anuncio.date)}</h2>
                    </div>
                    <div >
                      <h1>Hora</h1>
                      <h2>{convertTo12HourFormat(anuncio.hora)}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del anuncio' show={showDetalles} onClose={onCloseDetalles}>
        {anuncioseleccionada && (
          <AnuncioDetalles
            reload={reload}
            onReload={onReload}
            anuncio={anuncioseleccionada}
            onOpenCloseDetalles={onCloseDetalles}
            onToastSuccessAnuncioMod={onToastSuccessAnuncioMod}
            onToastSuccessAnuncioDel={onToastSuccessAnuncioDel}
          />
        )}
      </BasicModal>

    </>

  )
}
