import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import styles from './recibos.module.css'
import { BasicLayout } from '@/layouts'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Loading } from '@/components/Layouts'
import axios from 'axios'

export default function Recibos() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => prevState)

  const [recibos, setRecibos] = useState(null)

  useEffect(() => {
    if (user && user.residencial_id) {
      (async () => {
        try {
          const res = await axios.get(`/api/recibos/recibos?residencial_id=${user.residencial_id}`)
          setRecibos(res.data)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [reload, user])

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='Recibos'>



      </BasicLayout>

    </ProtectedRoute>

  )
}
