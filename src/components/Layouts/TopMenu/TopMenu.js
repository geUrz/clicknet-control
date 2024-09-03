import { FaBell, FaUser } from 'react-icons/fa'
import styles from './TopMenu.module.css'

export function TopMenu(props) {

  const {title} = props

  return (

    <div className={styles.main}>
      <FaBell />
      <h1>{title}</h1>
      <FaUser />
    </div>

  )
}
