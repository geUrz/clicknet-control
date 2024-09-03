import { BasicLayout, BasicModal } from '@/layouts'
import { FaEdit, FaUser } from 'react-icons/fa'
import { ModUsuarioForm } from '@/components/Cuenta'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import styles from './cuenta.module.css'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'

export default function Cuenta() {

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const { user, loading } = useAuth()
  
  if (loading) {
    <Loading size={45} loading={1} />
  }

  const [toastDelete, setToastDelete] = useState(false)
  const [toastSuccess, setToastSuccess] = useState(false)

  const onToastDelete = () => {
    setToastDelete(true)
    setTimeout(() => {
      setToastDelete(false)
    }, 3000)
  }

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative>

      {toastDelete && <ToastDelete contain='Negocio eliminado exitosamente' onClose={() => setToastDelete(false)} />}

      {toastSuccess && <ToastSuccess contain='Negocio modificado exitosamente' onClose={() => setToastSuccess(false)} />}

        <Title title='Usuario' />

        <div className={styles.main}>
          <div className={styles.section}>
            <FaUser />
            
            {!user ? (
              ''
            ) : (
              <>
              
                <h1>{user.usuario}</h1>
                <h2>{user.email}</h2>
              
              </>
            )}

            <div className={styles.iconEdit}>
              <div onClick={onOpenClose}>
                <FaEdit />
              </div>
            </div>
          </div>

          <div className={styles.miNegocio}>
            <h1>Mi negocio</h1>
            <h2>( Vista previa )</h2>
          </div>

        </div>
          

        <BasicModal title='modificar usuario' show={show} onClose={onOpenClose}>
          <ModUsuarioForm user={user} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} />
        </BasicModal>

      </BasicLayout>

    </ProtectedRoute>

  )
}
