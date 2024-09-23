import { FaPlus } from 'react-icons/fa'
import styles from './Add.module.css'

export function Add(props) {

  const { titulo, onOpenClose } = props

  return (

    <div className={styles.iconMain}>
      <div className={styles.iconSection}>
        <div onClick={onOpenClose}>
          <FaPlus />
        </div>
        <h1>{titulo}</h1>
      </div>
    </div>


  )
}
