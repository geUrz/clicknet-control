import { BasicLayout } from '@/layouts'
import styles from './home.module.css'
import { useState } from 'react'
import { Card } from '@/components/Home'
import { FaBullhorn, FaCarCrash, FaClipboard, FaUserCog } from 'react-icons/fa'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'

export default function Home() {

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  return (

    <ProtectedRoute>

    <BasicLayout title='Inicio' onReload={onReload} relative>

      <div className={styles.main}>
        <div className={styles.section}>

          <Card
            link='/incidencias'
            title='Incidencias'
          >
            <FaCarCrash />
          </Card>

          <Card
            link='/anuncios'
            title='Anuncios'
          >
            <FaBullhorn />
          </Card>

          <Card
            link='/visitatecnica'
            title='Visita Técnica'
          >
            <FaUserCog />
          </Card>

          <Card
            link='/reportes'
            title='Reportes'
          >
            <FaClipboard />
          </Card>

        </div>
      </div>

    </BasicLayout>

    </ProtectedRoute>

  )
}
