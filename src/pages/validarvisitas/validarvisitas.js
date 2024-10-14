import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout } from '@/layouts'
import { ValidarCodigo } from '@/components/ValidarVisitas/ValidarCodigo/ValidarCodigo'
import { DatosCodigo } from '@/components/ValidarVisitas'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { SearchVisitas, ToastDelete, ToastSuccess, VisitasListSearch } from '@/components/Layouts'
import { VisitasList } from '@/components/Visitas'
import styles from './validarvisitas.module.css'
import { FaSearch } from 'react-icons/fa'
import { ToastSuccessQRValido } from '@/components/Layouts/Toast/ToastSuccessQRValido'

export default function Validarvisitas() {

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [visita, setVisita] = useState(null)

  const [visitas, setVisitas] = useState(null)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [toastSuccessQRValido, setToastSuccessQRValido] = useState(false)
  const [toastSuccessVisitaMod, setToastSuccessVisitaMod] = useState(false)
  const [toastSuccessVisitaDel, setToastSuccessVisitaDel] = useState(false)

  const onToastSuccessQRValido = () => setToastSuccessQRValido((prevState) => !prevState)

  const onToastSuccessVisitaMod = () => {
    setToastSuccessVisitaMod(true)
    setTimeout(() => {
      setToastSuccessVisitaMod(false)
    }, 3000)
  }

  const onToastSuccessVisitaDel = () => {
    setToastSuccessVisitaDel(true)
    setTimeout(() => {
      setToastSuccessVisitaDel(false)
    }, 3000)
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/visitas/visitas')
        setVisitas(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  return (

    <ProtectedRoute>

      <BasicLayout title='Validar visitas' relative onReload={onReload}>

      {toastSuccessQRValido && <ToastSuccessQRValido onToastSuccessQRValido={onToastSuccessQRValido} />}

        {toastSuccessVisitaMod && <ToastSuccess contain='Visita modificada exitosamente' onClose={() => setToastSuccessVisitaMod(false)} />}

        {toastSuccessVisitaDel && <ToastDelete contain='Visita eliminada exitosamente' onClose={() => setToastSuccessVisitaDel(false)} />}

        <DatosCodigo visita={visita} reload={reload} onReload={onReload} />

        <ValidarCodigo setVisita={setVisita} reload={reload} onReload={onReload} onToastSuccessQRValido={onToastSuccessQRValido} />

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchVisitas onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessVisitaMod={onToastSuccessVisitaMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <VisitasListSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar visita</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        <VisitasList visitas={visitas} reload={reload} onReload={onReload} onToastSuccessVisitaMod={onToastSuccessVisitaMod} onToastSuccessVisitaDel={onToastSuccessVisitaDel} activateFilter={false} />

      </BasicLayout>

    </ProtectedRoute>

  )
}
