import { BasicLayout } from '@/layouts'
import styles from './home.module.css'
import { useState } from 'react'
import { Card } from '@/components/Home'
import { FaBullhorn, FaCarCrash, FaClipboard, FaHornbill } from 'react-icons/fa'

export default function Home() {

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  return (

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
            link='/reportes'
            title='reportes'
          >
            <FaClipboard />
          </Card>

        </div>
      </div>

    </BasicLayout>

  )
}
