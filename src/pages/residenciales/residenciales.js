import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { ResidencialForm, ResidencialList } from '@/components/residenciales'
import styles from './residenciales.module.css'


export default function Residenciales() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [residenciales, setResidenciales] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/residenciales/residenciales')
        setResidenciales(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  const [toastSuccessResidenciales, setToastSuccessResidenciales] = useState(false)
  const [toastSuccessResidencialesMod, setToastSuccessResidencialesMod] = useState(false)
  const [toastSuccessResidencialesDel, setToastSuccessResidencialesDel] = useState(false)

  const onToastSuccessResidencial = () => {
    setToastSuccessResidenciales(true)
    setTimeout(() => {
      setToastSuccessResidenciales(false)
    }, 3000)
  }

  const onToastSuccessResidencialMod = () => {
    setToastSuccessResidencialesMod(true)
    setTimeout(() => {
      setToastSuccessResidencialesMod(false)
    }, 3000)
  }

  const onToastSuccessResidencialDel = () => {
    setToastSuccessResidencialesDel(true)
    setTimeout(() => {
      setToastSuccessResidencialesDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (
    
    <ProtectedRoute>

      <BasicLayout title='Residenciales' relative onReload={onReload}>

        {toastSuccessResidenciales && <ToastSuccess csidenciales='Residencial creado exitosamente' onClose={() => setToastSuccessResidenciales(false)} />}

        {toastSuccessResidencialesMod && <ToastSuccess contain='Residencial modificado exitosamente' onClose={() => setToastSuccessResidencialesMod(false)} />}

        {toastSuccessResidencialesDel && <ToastDelete contain='Residencial eliminado exitosamente' onClose={() => setToastSuccessResidencialesDel(false)} />}

        <ResidencialList reload={reload} onReload={onReload} residenciales={residenciales} onToastSuccessResidencialMod={onToastSuccessResidencialMod} onToastSuccessResidencialDel={onToastSuccessResidencialDel} />

        {user.isadmin === 'Admin' ? (
          <Add titulo='crear reporte' onOpenClose={onOpenCloseForm} />
        ) : (
          ''
        )}

      </BasicLayout>

      <BasicModal title='crear residencial' show={openForm} onClose={onOpenCloseForm}>
        <ResidencialForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccessResidencial={onToastSuccessResidencial} />
      </BasicModal>

    </ProtectedRoute>

  )
}
