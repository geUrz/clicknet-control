import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { VisitaProvForm, VisitaProvsList } from '@/components/VisitaProvs'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Visitaprovedores() {

  const {user, loading} = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [visitaprovs, setVisitaprovs] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/visitaprovedores/visitaprovedores')
        setVisitaprovs(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  const [toastSuccessVisitaprov, setToastSuccessVisitaprov] = useState(false)
  const [toastSuccessVisitaprovMod, setToastSuccessVisitaprovMod] = useState(false)
  const [toastSuccessVisitaprovDel, setToastSuccessVisitaprovDel] = useState(false)

  const onToastSuccessVisitaprov = () => {
    setToastSuccessVisitaprov(true)
    setTimeout(() => {
      setToastSuccessVisitaprov(false)
    }, 3000)
  }

  const onToastSuccessVisitaprovMod = () => {
    setToastSuccessVisitaprovMod(true)
    setTimeout(() => {
      setToastSuccessVisitaprovMod(false)
    }, 3000)
  }

  const onToastSuccessVisitaprovDel = () => {
    setToastSuccessVisitaprovDel(true)
    setTimeout(() => {
      setToastSuccessVisitaprovDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='visita provedores' relative onReload={onReload}>

        {toastSuccessVisitaprov && <ToastSuccess contain='Visita provedor creado exitosamente' onClose={() => setToastSuccessVisitaprov(false)} />}

        {toastSuccessVisitaprovMod && <ToastSuccess contain='Visita provedor modificado exitosamente' onClose={() => setToastSuccessVisitaprovMod(false)} />}

        {toastSuccessVisitaprovDel && <ToastDelete contain='Visita provedor eliminado exitosamente' onClose={() => setToastSuccessVisitaprovDel(false)} />}

        <VisitaProvsList reload={reload} onReload={onReload} visitaprovs={visitaprovs} onToastSuccessVisitaprovMod={onToastSuccessVisitaprovMod} onToastSuccessVisitaprovDel={onToastSuccessVisitaprovDel} />

        {user.isadmin === 'Admin' || user.isadmin === 'Caseta' || user.isadmin === 'Comité' ? (
          <Add titulo='crear visita provedor' onOpenClose={onOpenCloseForm} />
        ) : (
          ''
        )}

      </BasicLayout>

      <BasicModal title='crear visita provedor' show={openForm} onClose={onOpenCloseForm}>
        <VisitaProvForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccessVisitaprov={onToastSuccessVisitaprov} />
      </BasicModal>

    </ProtectedRoute>

  )
}
