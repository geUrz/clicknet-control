// Notificaciones.js
import { useState, useEffect } from 'react'
import { BasicLayout } from '@/layouts'
import styles from './noti.module.css'
import { useAuth } from '@/contexts/AuthContext'
import { ListEmpty, Loading } from '@/components/Layouts'
import axios from 'axios'
import { size, map } from 'lodash'

export default function Noti() {

  const {user, loading} = useAuth()
  
  const [notifications, setNotifications] = useState([])
  console.log(notifications);
  
  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user]) // Dependencia en `user`

  const fetchNotifications = async () => {
    if (!user) return; // Evita hacer la solicitud si `user` es null o undefined
    try {
      const user_id = user.id
      const response = await axios.get(`/api/notificaciones/notificaciones?user_id=${user_id}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  /* const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notificaciones/notificaciones/${id}`, {
        read: true,
      });
      fetchNotifications(); // Actualiza la lista después de marcar como leída
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  } */

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (
    <BasicLayout title='Notificaciones' relative>
      <div className={styles.notifications}>
        <h1>Notificaciones</h1>
        {!notifications ? (
          <Loading size={45} loading={0} />
        ) : (
          size(notifications) === 0 ? (
            <ListEmpty />
          ) : (
            <div>
              {map(notifications, (noti) => (
                <div key={noti.id}>
                  <h1>{noti.message}</h1>
                </div>
            ))}
            </div>
          )
        )}
      </div>
    </BasicLayout>
  )
}
