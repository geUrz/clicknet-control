import axios from 'axios';
import connection from '@/libs/db';

export default async function sendNotification(req, res) {
  const { userId, title, message } = req.body;

  if (!userId || !title || !message) {
    return res.status(400).json({ error: 'User ID, title y message son requeridos' });
  }

  try {
    // Obtener todos los Player IDs asociados al usuario desde la tabla player_ids
    const [playerIds] = await connection.query(
      'SELECT player_id FROM player_ids WHERE user_id = ?',
      [userId]
    );

    if (playerIds.length === 0) {
      return res.status(404).json({ message: 'No se encontraron Player IDs para este usuario' });
    }

    // Extraer los Player IDs
    const playerIdArray = playerIds.map(player => player.player_id);

    // Enviar notificación a OneSignal con todos los Player IDs
    const notificationPayload = {
      app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      include_player_ids: playerIdArray, // Enviar a todos los Player IDs del usuario
      headings: { en: title },
      contents: { en: message },
    };

    await axios.post('https://onesignal.com/api/v1/notifications', notificationPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${process.env.NEXT_PUBLIC_ONESIGNAL_REST_API_KEY}`,
      }
    });

    return res.status(200).json({ message: 'Notificación enviada correctamente a todos los dispositivos.' });
  } catch (error) {
    console.error('Error al enviar notificación:', error.message);
    return res.status(500).json({ error: 'Error al enviar notificación' });
  }
}
