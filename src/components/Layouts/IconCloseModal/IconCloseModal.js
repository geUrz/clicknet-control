import { FaTimes } from 'react-icons/fa'
import styles from './IconCloseModal.module.css'

export function IconCloseModal(props) {

  const {onOpenClose} = props

  return (
    
    <div className={styles.iconClose}>
      <div onClick={onOpenClose}>
        <FaTimes />
      </div>
    </div>

  )
}
