import { useEffect, useState } from 'react'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import { VisitasList, VisitaForm } from '@/components/Visitas'
import styles from './visitas.module.css'

export default function Visitas() {

  const {user, loading} = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [visitas, setVisitas] = useState(null)

  useEffect(() => {
    if (!user || !user.id) return
  
    (async () => {
      try {
        const res = await axios.get(`/api/visitas/visitas?usuario_id=${user.id}`)
        setVisitas(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [user, reload])

  const [toastSuccessVisita, setToastSuccessVisita] = useState(false)
  const [toastSuccessVisitaMod, setToastSuccessVisitaMod] = useState(false)
  const [toastSuccessVisitaDel, setToastSuccessVisitaDel] = useState(false)

  const onToastSuccessVisita = () => {
    setToastSuccessVisita(true)
    setTimeout(() => {
      setToastSuccessVisita(false)
    }, 3000)
  }

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

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='Visitas' relative onReload={onReload}>

        {toastSuccessVisita && <ToastSuccess contain='Creada exitosamente' onClose={() => setToastSuccessVisita(false)} />}

        {toastSuccessVisitaMod && <ToastSuccess contain='Modificada exitosamente' onClose={() => setToastSuccessVisitaMod(false)} />}

        {toastSuccessVisitaDel && <ToastDelete contain='Eliminada exitosamente' onClose={() => setToastSuccessVisitaDel(false)} />}

        <VisitasList reload={reload} onReload={onReload} visitas={visitas} onToastSuccessVisitaMod={onToastSuccessVisitaMod} onToastSuccessVisitaDel={onToastSuccessVisitaDel} />


        <Add onOpenClose={onOpenCloseForm} />

      </BasicLayout>

      <BasicModal title='crear visita' show={openForm} onClose={onOpenCloseForm}>
        <VisitaForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccessVisita={onToastSuccessVisita} />
      </BasicModal>

    </ProtectedRoute>
  )
}
