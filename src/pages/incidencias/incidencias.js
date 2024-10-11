import { BasicLayout, BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { IncidenciasList } from '@/components/Incidencias'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { IncidenciaForm } from '@/components/Incidencias/IncidenciaForm'
import { useAuth } from '@/contexts/AuthContext'
import styles from './incidencias.module.css'

export default function Incidencias() {

  const {user, loading} = useAuth()
  
  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [incidencias, setIncidencias] = useState(null)
  
  useEffect(() => {
    if (user && user.residencial_id) {
      (async () => {
        try {
          const res = await axios.get(`/api/incidencias/incidencias?residencial_id=${user.residencial_id}`);
          setIncidencias(res.data);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [reload, user])

  const [toastSuccessIncidencia, setToastSuccessIncidencia] = useState(false)
  const [toastSuccessIncidenciaMod, setToastSuccessIncidenciaMod] = useState(false)
  const [toastSuccessIncidenciaDel, setToastSuccessIncidenciaDel] = useState(false)

  const onToastSuccessIncidencia = () => {
    setToastSuccessIncidencia(true)
    setTimeout(() => {
      setToastSuccessIncidencia(false)
    }, 3000)
  }

  const onToastSuccessIncidenciaMod = () => {
    setToastSuccessIncidenciaMod(true)
    setTimeout(() => {
      setToastSuccessIncidenciaMod(false)
    }, 3000)
  }

  const onToastSuccessIncidenciaDel = () => {
    setToastSuccessIncidenciaDel(true)
    setTimeout(() => {
      setToastSuccessIncidenciaDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='incidencias' relative onReload={onReload}>

        {toastSuccessIncidencia && <ToastSuccess contain='Incidencia creada exitosamente' onClose={() => setToastSuccessIncidencia(false)} />}

        {toastSuccessIncidenciaMod && <ToastSuccess contain='Incidencia modificada exitosamente' onClose={() => setToastSuccessIncidenciaMod(false)} />}

        {toastSuccessIncidenciaDel && <ToastDelete contain='Incidencia eliminada exitosamente' onClose={() => setToastSuccessIncidenciaDel(false)} />}

        <IncidenciasList reload={reload} onReload={onReload} incidencias={incidencias} onToastSuccessIncidenciaMod={onToastSuccessIncidenciaMod} onToastSuccessIncidenciaDel={onToastSuccessIncidenciaDel} />

        <Add titulo='crear incidencia' onOpenClose={onOpenCloseForm} />

      </BasicLayout>

      <BasicModal title='crear incidencia' show={openForm} onClose={onOpenCloseForm}>
        <IncidenciaForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccessIncidencia={onToastSuccessIncidencia} />
      </BasicModal>

    </ProtectedRoute>

  )
}
