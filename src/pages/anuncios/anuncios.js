import { BasicLayout, BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import styles from './anuncios.module.css'
import { AnunciosList, AnuncioForm } from '@/components/Anuncios'

export default function Anuncios() {

  const {user, loading} = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [anuncios, setAnuncios] = useState(null)
  
  useEffect(() => {
    if (user && user.residencial_id) {
    (async () => {
      try {
        const res = await axios.get(`/api/anuncios/anuncios?residencial_id=${user.residencial_id}`)
        setAnuncios(res.data)
      } catch (error) {
          console.error(error)
      }
    })()
  }
  }, [reload, user])

  const [toastSuccessAnuncio, setToastSuccessAnuncio] = useState(false)
  const [toastSuccessAnuncioMod, setToastSuccessAnuncioMod] = useState(false)
  const [toastSuccessAnuncioDel, setToastSuccessAnuncioDel] = useState(false)

  const onToastSuccessAnuncio = () => {
    setToastSuccessAnuncio(true)
    setTimeout(() => {
      setToastSuccessAnuncio(false)
    }, 3000)
  }

  const onToastSuccessAnuncioMod = () => {
    setToastSuccessAnuncioMod(true)
    setTimeout(() => {
      setToastSuccessAnuncioMod(false)
    }, 3000)
  }

  const onToastSuccessAnuncioDel = () => {
    setToastSuccessAnuncioDel(true)
    setTimeout(() => {
      setToastSuccessAnuncioDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (
    
    <ProtectedRoute>

      <BasicLayout title='anuncios' relative onReload={onReload}>

        {toastSuccessAnuncio && <ToastSuccess contain='Anuncio creado exitosamente' onClose={() => setToastSuccessAnuncio(false)} />}

        {toastSuccessAnuncioMod && <ToastSuccess contain='Anuncio modificado exitosamente' onClose={() => setToastSuccessAnuncioMod(false)} />}

        {toastSuccessAnuncioDel && <ToastDelete contain='Anuncio eliminado exitosamente' onClose={() => setToastSuccessAnuncioDel(false)} />}

        <AnunciosList reload={reload} onReload={onReload} anuncios={anuncios} onToastSuccessAnuncioMod={onToastSuccessAnuncioMod} onToastSuccessAnuncioDel={onToastSuccessAnuncioDel} />

        <Add titulo='crear anuncio' onOpenClose={onOpenCloseForm} />

      </BasicLayout>

      <BasicModal title='crear anuncio' show={openForm} onClose={onOpenCloseForm}>
        <AnuncioForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccessAnuncio={onToastSuccessAnuncio} />
      </BasicModal>

    </ProtectedRoute>

  )
}
