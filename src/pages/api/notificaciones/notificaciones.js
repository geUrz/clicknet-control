import connection from "@/libs/db";

export async function getNotificaciones(req, res) {
  if (req.method === 'GET') {
    try {
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
      }

      const query = 'SELECT * FROM notificaciones WHERE user_id = $1 ORDER BY created_at DESC';
      const values = [user_id];

      const result = await connection.query(query, values);

      // Verifica el formato del resultado
      if (!result.rows) {
        return res.status(404).json({ error: 'No notifications found' });
      }

      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching notificaciones:', error);
      res.status(500).json({ error: 'Error fetching notificaciones' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export async function createNotification(req, res) {
  if (req.method === 'POST') {
    try {
      const { user_id, message } = req.body;

      if (!user_id || !message) {
        return res.status(400).json({ error: 'user_id and message are required' });
      }

      const query = 'INSERT INTO notificaciones (user_id, message) VALUES ($1, $2) RETURNING *';
      const values = [user_id, message];

      const result = await connection.query(query, values);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ error: 'Error creating notification' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
