import { TopMenu, BottomMenu } from '@/components/Layouts'
import styles from './BasicLayout.module.css'
import classNames from 'classnames'

export function BasicLayout(props) {

  const {
    children, 
    relative=false,
    title,
    categorie
  } = props

  return (

    <>
    
    <TopMenu title={title} />

    <div className={classNames({[styles.relative] : relative})}>
      {children}
    </div>

    <BottomMenu categorie={categorie}/>

    </>

  )
}
