import { FaBullhorn, FaCar, FaCaravan, FaCarBattery, FaCarCrash, FaCaretSquareDown, FaCarSide, FaHome, FaLayerGroup, FaListAlt, FaRegListAlt, FaSadTear, FaSearchengin, FaServicestack, FaUsers, FaUserSecret } from 'react-icons/fa'
import { BiAlarm, BiAlarmExclamation, BiAlarmSnooze } from 'react-icons/bi'
import Link from 'next/link'
import styles from './BottomMenu.module.css'

export function BottomMenu() {

  return (

    <div className={styles.main}>
      <div className={styles.section}>
        <Link href='/' className={styles.tab}>
          <div>
            <FaHome />
            <h1>Inicio</h1>
          </div>
        </Link>
        <Link href='/incidencias' className={styles.tab}>
          <div>
            <FaCarCrash />
            <h1>Incidencias</h1>
          </div>
        </Link>
        <Link href='/visitas' className={styles.tab}>
          <div>
            <FaUsers />
            <h1>Visitas</h1>
          </div>
        </Link>
        <Link href='/anuncios' className={styles.tab}>
          <div>
            <FaBullhorn />
            <h1>Anuncios</h1>
          </div>
        </Link>
        <Link href='/extras' className={styles.tab}>
          <div>
            <FaLayerGroup />
            <h1>Extras</h1>
          </div>
        </Link>
      </div>
    </div>

  )
}
