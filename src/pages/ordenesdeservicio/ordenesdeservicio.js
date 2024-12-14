import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout, BasicModal } from '@/layouts'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import axios from 'axios'
import { OrdenServicioForm, OrdenServicioList } from '@/components/OrdenServicio'
import styles from './ordenesdeservicio.module.css'

export default function Ordenesdeservicio() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [ordenservicio, setOrdenservicio] = useState(null)
  
  useEffect(() => {
    if (user && user.residencial_id) {
      (async () => {
        try {
          const res = await axios.get(`/api/ordenservicio/ordenservicio?residencial_id=${user.residencial_id}`)
          setOrdenservicio(res.data)
        } catch (error) {
            console.error(error)
        }
      })()
    }
  }, [reload, user])

  const [toastSuccessOrdenservicio, setToastSuccessOrdenservicio] = useState(false)
  const [toastSuccessOrdenservicioMod, setToastSuccessOrdenservicioMod] = useState(false)
  const [toastSuccessOrdenservicioDel, setToastSuccessOrdenservicioDel] = useState(false)

  const onToastSuccessOrdenservicio = () => {
    setToastSuccessOrdenservicio(true)
    setTimeout(() => {
      setToastSuccessOrdenservicio(false)
    }, 3000)
  }

  const onToastSuccessOrdenservicioMod = () => {
    setToastSuccessOrdenservicioMod(true)
    setTimeout(() => {
      setToastSuccessOrdenservicioMod(false)
    }, 3000)
  }

  const onToastSuccessOrdenservicioDel = () => {
    setToastSuccessOrdenservicioDel(true)
    setTimeout(() => {
      setToastSuccessOrdenservicioDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='Órdenes de servicio' relative onReload={onReload}>

        {toastSuccessOrdenservicio && <ToastSuccess contain='Creada exitosamente' onClose={() => setToastSuccessOrdenservicio(false)} />}

        {toastSuccessOrdenservicioMod && <ToastSuccess contain='Modificada exitosamente' onClose={() => setToastSuccessOrdenservicioMod(false)} />}

        {toastSuccessOrdenservicioDel && <ToastDelete contain='Eliminada exitosamente' onClose={() => setToastSuccessOrdenservicioDel(false)} />}

        <OrdenServicioList reload={reload} onReload={onReload} ordenservicio={ordenservicio} onToastSuccessOrdenservicioMod={onToastSuccessOrdenservicioMod} onToastSuccessOrdenservicioDel={onToastSuccessOrdenservicioDel} />

        <Add onOpenClose={onOpenCloseForm} />

      </BasicLayout>

      <BasicModal title='crear órden de servicio' show={openForm} onClose={onOpenCloseForm}>
        <OrdenServicioForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccessOrdenservicio={onToastSuccessOrdenservicio} />
      </BasicModal>

    </ProtectedRoute>

  )
}
