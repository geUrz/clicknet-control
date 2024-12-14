import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ReporteForm, ReporteList } from '@/components/Reportes'
import styles from './reportes.module.css'


export default function Reportes() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [reportes, setReportes] = useState(null)

  useEffect(() => {
    if (user && user.residencial_id) {
      (async () => {
        try {
          const res = await axios.get(`/api/reportes/reportes?residencial_id=${user.residencial_id}`);
          setReportes(res.data);
        } catch (error) {
            console.error(error);
        }
      })();
    }
  }, [reload, user])

  const [toastSuccess, setToastSuccessReportes] = useState(false)
  const [toastSuccessMod, setToastSuccessReportesMod] = useState(false)
  const [toastSuccessDel, setToastSuccessReportesDel] = useState(false)

  const onToastSuccessReporte = () => {
    setToastSuccessReportes(true)
    setTimeout(() => {
      setToastSuccessReportes(false)
    }, 3000)
  }

  const onToastSuccessReportesMod = () => {
    setToastSuccessReportesMod(true)
    setTimeout(() => {
      setToastSuccessReportesMod(false)
    }, 3000)
  }

  const onToastSuccessReportesDel = () => {
    setToastSuccessReportesDel(true)
    setTimeout(() => {
      setToastSuccessReportesDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (
    
    <ProtectedRoute>

      <BasicLayout title='Reportes' relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccessReportes(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessReportesMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminado exitosamente' onClose={() => setToastSuccessReportesDel(false)} />}

        <ReporteList reload={reload} onReload={onReload} reportes={reportes} onToastSuccessReportesMod={onToastSuccessReportesMod} onToastSuccessReportesDel={onToastSuccessReportesDel} />

        {user.isadmin === 'Admin' ? (
          <Add onOpenClose={onOpenCloseForm} />
        ) : (
          ''
        )}

      </BasicLayout>

      <BasicModal title='crear Reporte' show={openForm} onClose={onOpenCloseForm}>
        <ReporteForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccessReporte={onToastSuccessReporte} />
      </BasicModal>

    </ProtectedRoute>

  )
}
