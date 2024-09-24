import { BasicLayout, BasicModal } from '@/layouts'
import { FaEdit, FaUser } from 'react-icons/fa'
import { ModUsuarioForm, PubById } from '@/components/Cuenta'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { Button } from 'semantic-ui-react'
import styles from './cuenta.module.css'
import axios from 'axios'
import { ModResidenteForm } from '@/components/Cuenta/ModResidenteForm'

export default function Cuenta() {

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [incidencias, setIncidencias] = useState(null)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const { user, loading, logout } = useAuth()

  const [toastSuccessIncidenciaMod, setToastSuccessIncidenciaMod] = useState(false)
  const [toastSuccessIncidenciaDel, setToastSuccessIncidenciaDel] = useState(false)

  const onToastSuccessIncidenciaMod = () => {
    setToastSuccessIncidenciaMod(true)
    setTimeout(() => {
      setToastSuccessIncidenciaMod(false)
    }, 3000)
  }

  const onToastSuccessIncidenciaMDel = () => {
    setToastSuccessIncidenciaDel(true)
    setTimeout(() => {
      setToastSuccessIncidenciaDel(false)
    }, 3000)
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/incidencias/incidencias?usuario_id=${user.id}`)
        setIncidencias(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  if (loading || !user) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='cuenta' relative onReload={onReload}>

        {toastSuccessIncidenciaMod && <ToastSuccess contain='Incidencia modificada exitosamente' onClose={() => setToastSuccessIncidenciaMod(false)} />}

        {toastSuccessIncidenciaDel && <ToastDelete contain='Incidencia eliminada exitosamente' onClose={() => setToastSuccessIncidenciaDel(false)} />}

        <div className={styles.main}>
          <div className={styles.section}>
            <FaUser />

            {!user ? (
              ''
            ) : (
              user.isadmin === 'Admin' || user.isadmin === 'Técnico' || user.isadmin === 'Comité' || user.isadmin === 'Caseta' ? (
                <>

                  <h1>{user.usuario}</h1>
                  <div>
                    <h1>Nombre:</h1>
                    <h2>{user.nombre}</h2>
                  </div>
                  <div>
                    <h1>Correo:</h1>
                    <h2>{user.email}</h2>
                  </div>
                  <div>
                    <h1>Nivel:</h1>
                    <h2>{user.isadmin}</h2>
                  </div>

                </>
              ) : (
                user.isadmin === 'Residente' ? (
                  <>

                    <h1>{user.usuario}</h1>
                    <div>
                      <h1>Nombre:</h1>
                      <h2>{user.nombre}</h2>
                    </div>
                    <div>
                      <h1>Privada:</h1>
                      <h2>{user.privada}</h2>
                    </div>
                    <div>
                      <h1>Calle:</h1>
                      <h2>{user.calle}</h2>
                    </div>
                    <div>
                      <h1>Casa:</h1>
                      <h2>#{user.casa}</h2>
                    </div>
                    <div>
                      <h1>Correo:</h1>
                      <h2>{user.email}</h2>
                    </div>
                    <div>
                      <h1>Nivel:</h1>
                      <h2>{user.isadmin}</h2>
                    </div>

                  </>
                ) : null
              )
            )}

            <div className={styles.iconEdit}>
              <div onClick={onOpenClose}>
                <FaEdit />
              </div>
            </div>
            <Button negative onClick={logout}>
              Cerrar sesión
            </Button>
          </div>

          <div className={styles.miNegocio}>
            <h1>Mis publicaciones</h1>
          </div>

          <PubById reload={reload} onReload={onReload} incidencias={incidencias} onToastSuccessIncidenciaMod={onToastSuccessIncidenciaMod} onToastSuccessIncidenciaMDel={onToastSuccessIncidenciaMDel} />

        </div>


        {user.isadmin === 'Admin' || user.isadmin === 'Comité' || user.isadmin === 'Técnico' || user.isadmin === 'Caseta' ? (
          <BasicModal title='Modificar usuario' show={show} onClose={onOpenClose}>
            <ModUsuarioForm user={user} onOpenClose={onOpenClose} onToastSuccess={onToastSuccessIncidenciaMod} />
          </BasicModal>
        ) : user.isadmin === 'Residente' ? (
          <BasicModal title='Modificar residente' show={show} onClose={onOpenClose}>
            <ModResidenteForm user={user} onOpenClose={onOpenClose} onToastSuccess={onToastSuccessIncidenciaMod} />
          </BasicModal>
        ) : null}


      </BasicLayout>

    </ProtectedRoute>

  )
}
