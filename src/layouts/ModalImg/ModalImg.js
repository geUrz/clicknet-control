import { IconClose, Loading } from '@/components/Layouts'
import styles from './ModalImg.module.css'
import { Image } from 'semantic-ui-react'
import { FaTrash } from 'react-icons/fa'

export function ModalImg(props) {

  const {img, imgKey, openImg, onShowConfirmDelImg, delImage=true} = props
  
  return (
    
    <>
    
      <IconClose onOpenClose={openImg} />

      {!img ? 
        <Loading size={40} loading={1} /> :
        <div className={styles.img}>
        <Image src={img} />
        {delImage ?
          <FaTrash onClick={() => onShowConfirmDelImg(imgKey)} /> : null
        }
      </div>
      }

    </>

  )
}
