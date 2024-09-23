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
    (async () => {
      try {
        const res = await axios.get('/api/reportes/reportes')
        setReportes(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  const [toastSuccessReportes, setToastSuccessReportes] = useState(false)
  const [toastSuccessReportesMod, setToastSuccessReportesMod] = useState(false)
  const [toastSuccessReportesDel, setToastSuccessReportesDel] = useState(false)

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

        {toastSuccessReportes && <ToastSuccess contain='Reporte creado exitosamente' onClose={() => setToastSuccessReportes(false)} />}

        {toastSuccessReportesMod && <ToastSuccess contain='Reporte modificado exitosamente' onClose={() => setToastSuccessReportesMod(false)} />}

        {toastSuccessReportesDel && <ToastDelete contain='Reporte eliminado exitosamente' onClose={() => setToastSuccessReportesDel(false)} />}

        <ReporteList reload={reload} onReload={onReload} reportes={reportes} onToastSuccessReportesMod={onToastSuccessReportesMod} onToastSuccessReportesDel={onToastSuccessReportesDel} />

        {user.isadmin === 'Admin' ? (
          <Add titulo='crear reporte' onOpenClose={onOpenCloseForm} />
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
