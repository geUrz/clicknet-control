import Link from 'next/link'
import styles from './Card.module.css'

export function Card(props) {

  const {children, title, link} = props

  return (

    <Link href={`${link}`} className={styles.card}>
      {children}
      <div>
        <h1>5</h1>
        <h2>{title}</h2>
      </div>
    </Link>

  )
}
