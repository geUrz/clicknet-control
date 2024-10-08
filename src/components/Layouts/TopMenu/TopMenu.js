import { FaBell, FaUser } from 'react-icons/fa'
import styles from './TopMenu.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext'

export function TopMenu(props) {

  const { title } = props

  const { user } = useAuth()

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user && user.id) { // Verifica que el usuario y su ID estén disponibles
        try {
          const response = await axios.get('/api/notificaciones/unread-count', {
            params: { usuario_id: user.id } // Pasa el ID del usuario a la API
          });
          setUnreadCount(response.data.count);
        } catch (error) {
          console.error('Error fetching unread notifications count:', error);
        }
      }
    };

    fetchUnreadCount();
  }, [user])

  return (

    <div className={styles.main}>
      <div className={styles.section}>
        <Link href='/notificaciones' className={styles.mainNoti}>
          <FaBell />
          {unreadCount > 0 && <span className={styles.notiCount}>{unreadCount}</span>}
        </Link>
        <h1>{title}</h1>
        <Link href='/cuenta'>
          <FaUser />
        </Link>
      </div>
    </div>

  )
}
