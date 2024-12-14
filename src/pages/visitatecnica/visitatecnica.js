import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { VisitaTecnicaForm, VisitaTecnicaList } from '@/components/VisitaTecnica'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Visitatecnica() {

  const { user, loading } = useAuth()
  
  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [visitatecnicas, setVisitatecnica] = useState(null)

  useEffect(() => {
    if (user && user.residencial_id) {
      (async () => {
        try {
          const res = await axios.get(`/api/visitatecnica/visitatecnica?residencial_id=${user.residencial_id}`);
          setVisitatecnica(res.data);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [reload, user])

  const [toastSuccessVisitatecnica, setToastSuccessVisitatecnica] = useState(false)
  const [toastSuccessVisitatecnicaMod, setToastSuccessVisitatecnicaMod] = useState(false)
  const [toastSuccessVisitatecnicaDel, setToastSuccessVisitatecnicaDel] = useState(false)

  const onToastSuccessVisitatecnica = () => {
    setToastSuccessVisitatecnica(true)
    setTimeout(() => {
      setToastSuccessVisitatecnica(false)
    }, 3000)
  }

  const onToastSuccessVisitatecnicaMod = () => {
    setToastSuccessVisitatecnicaMod(true)
    setTimeout(() => {
      setToastSuccessVisitatecnicaMod(false)
    }, 3000)
  }

  const onToastSuccessVisitatecnicaDel = () => {
    setToastSuccessVisitatecnicaDel(true)
    setTimeout(() => {
      setToastSuccessVisitatecnicaDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='visita técnica' relative>

        {toastSuccessVisitatecnica && <ToastSuccess contain='Creada exitosamente' onClose={() => setToastSuccessVisitatecnica(false)} />}

        {toastSuccessVisitatecnicaMod && <ToastSuccess contain='Modificada exitosamente' onClose={() => setToastSuccessVisitatecnicaMod(false)} />}

        {toastSuccessVisitatecnicaDel && <ToastDelete contain=' Eliminada exitosamente' onClose={() => setToastSuccessVisitatecnicaDel(false)} />}

        <VisitaTecnicaList reload={reload} onReload={onReload} visitatecnicas={visitatecnicas} onToastSuccessVisitatecnicaMod={onToastSuccessVisitatecnicaMod} onToastSuccessVisitatecnicaDel={onToastSuccessVisitatecnicaDel} />

        {user.isadmin === 'Admin' ? (
          <Add onOpenClose={onOpenCloseForm} />
        ) : (
          ''
        )}

      </BasicLayout>

      <BasicModal title='crear visita técnica' show={openForm} onClose={onOpenCloseForm}>
        <VisitaTecnicaForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccessVisitatecnica={onToastSuccessVisitatecnica} />
      </BasicModal>

    </ProtectedRoute>

  )
}
