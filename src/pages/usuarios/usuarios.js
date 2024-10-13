import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout } from '@/layouts'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function usuarios() {

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

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

  return (
    
    <ProtectedRoute>

      <BasicLayout title='Usuarios' relative onReload={onReload}>



      </BasicLayout>

    </ProtectedRoute>

  )
}
