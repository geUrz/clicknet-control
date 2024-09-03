import { FaBell, FaUser } from 'react-icons/fa'
import styles from './TopMenu.module.css'
import Link from 'next/link'

export function TopMenu(props) {

  const {title} = props

  return (

    <div className={styles.main}>
      <FaBell />
      <h1>{title}</h1>
      <Link href='/cuenta'>
        <FaUser />
      </Link>
    </div>

  )
}
