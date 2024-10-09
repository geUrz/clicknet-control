import connection from "@/libs/db"
import axios from "axios";

const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY;

// Función para enviar notificación
async function sendNotification(usuario_id, header, message, url) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
  }

  const data = {
    app_id: ONE_SIGNAL_APP_ID,
    included_segments: ['All'],
    headings: { en: header },
    contents: { en: message },
    url: url
  }

  try {
    await axios.post('https://onesignal.com/api/v1/notifications', data, { headers })

    await connection.query(
      'INSERT INTO notificaciones (usuario_id, header, message, url) VALUES (?, ?, ?, ?)',
      [usuario_id, header, message, url]
  )

  } catch (error) {
    console.error('Error sending notification:', error.message)
  }
}

export default async function handler(req, res) {
  const { id, usuario_id  } = req.query; // Agregamos 'search' al destructuring

  if (req.method === 'GET') {

    // Caso para obtener todos los residenciales
    try {
      const [rows] = await connection.query(
        `SELECT
        residenciales.id,
        residenciales.usuario_id,
        usuarios.nombre AS usuario_nombre,
        usuarios.isadmin AS usuario_isadmin,
        residenciales.nombre,
        residenciales.direccion
    FROM residenciales
    JOIN usuarios ON residenciales.usuario_id = usuarios.id
    ORDER BY residenciales.updatedAt DESC
    `)
      res.status(200).json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { usuario_id, folio, reporte, descripcion, date, estado } = req.body;
      if (!usuario_id || !reporte || !descripcion) {
        return res.status(400).json({ error: 'Todos los datos son obligatorios' })
      }

      const [result] = await connection.query(
        'INSERT INTO residenciales (usuario_id, folio, reporte, descripcion, date, estado) VALUES (?, ?, ?, ?, ?, ?)',
        [usuario_id, folio, reporte, descripcion, date, estado]
      )

      // Enviar notificación después de crear el reporte
      const header = 'Reporte'
      const message = `${reporte}`
      const url = '/residenciales'
      await sendNotification(usuario_id, header, message, url)

      const newClient = { id: result.insertId }
      res.status(201).json(newClient)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {

    const { reporte, descripcion, date, estado } = req.body;

    if (!reporte || !descripcion || !date || !estado || !id) {
      return res.status(400).json({ error: 'ID, reporte y descripción son obligatorios' })
    }

    try {
      const [result] = await connection.query(
        'UPDATE residenciales SET reporte = ?, descripcion = ?, date = ?, estado = ? WHERE id = ?',
        [reporte, descripcion, date, estado, id]
      )

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Reporte no encontrado' })
        }

        res.status(200).json({ message: 'Reporte actualizado correctamente' })
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
  } else if (req.method === 'DELETE') {
    
    if (!id) {
      return res.status(400).json({ error: 'ID del reporte es obligatorio' })
    }

    else {
      // Eliminar la incidencia por ID
      try {
        const [result] = await connection.query('DELETE FROM residenciales WHERE id = ?', [id])

        // Verificar si el anuncio fue eliminado
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Reporte no encontrado' })
        }

        res.status(200).json({ message: 'Reporte eliminado correctamente' })
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    }

  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
