import { Add, Loading, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { UsuarioForm, UsuarioList } from '@/components/usuarios'
import styles from './usuarios.module.css'
import { FaSearch } from 'react-icons/fa'
import { SearchUsuarios, UsuariosListSearch } from '@/components/Usuarios'

export default function Usuarios() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [usuarios, setUsuarios] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/usuarios/usuarios')
        setUsuarios(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  const [toastSuccessUsuario, setToastSuccessUsuario] = useState(false)
  const [toastSuccessUsuarioMod, setToastSuccessUsuarioMod] = useState(false)

  const onToastSuccessUsuario = () => {
    setToastSuccessUsuario(true)
    setTimeout(() => {
      setToastSuccessUsuario(false)
    }, 3000)
  }

  const onToastSuccessUsuarioMod = () => {
    setToastSuccessUsuarioMod(true)
    setTimeout(() => {
      setToastSuccessUsuarioMod(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='Usuarios' relative onReload={onReload}>

        {toastSuccessUsuario && <ToastSuccess contain='Usuario creado exitosamente' onClose={() => setToastSuccessUsuario(false)} />}

        {toastSuccessUsuarioMod && <ToastSuccess contain='Usuario modificado exitosamente' onClose={() => setToastSuccessUsuarioMod(false)} />}

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchUsuarios onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessUsuarioMod={onToastSuccessUsuarioMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <UsuariosListSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar usuario</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        {user.isadmin === 'Admin' ? (
          <Add titulo='crear usuario' onOpenClose={onOpenCloseForm} />
        ) : (
          ''
        )} 

        <UsuarioList reload={reload} onReload={onReload} usuarios={usuarios} onToastSuccessUsuarioMod={onToastSuccessUsuarioMod} /> 

      </BasicLayout>

      <BasicModal title='crear usuario' show={openForm} onClose={onOpenCloseForm}>
        <UsuarioForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccessUsuario={onToastSuccessUsuario} />
      </BasicModal>

    </ProtectedRoute>

  )
}
