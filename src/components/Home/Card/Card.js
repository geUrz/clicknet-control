import Link from 'next/link'
import styles from './Card.module.css'

export function Card(props) {

  const {children, title, link, count=true, countIncidencias, countAnuncios, countVisitatecnica, countReportes, countVisitaprovedores} = props

  const counts = {
    '/incidencias': countIncidencias,
    '/anuncios': countAnuncios,
    '/visitatecnica': countVisitatecnica,
    '/reportes': countReportes,
    '/visitaprovedores': countVisitaprovedores
  }

  return (

    <Link href={`${link}`} className={styles.card}>
      <div>
        {children}
      </div>
      <div>
        {count ? (
          <h1>{counts[link] || '0'}</h1>
        ) : (
          ''
        )}
        <h2>{title}</h2>
      </div>
    </Link>

  )
}
