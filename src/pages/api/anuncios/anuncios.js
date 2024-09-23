import connection from "@/libs/db"
import axios from "axios";

const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY;

// Función para enviar notificación
async function sendNotification(message) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
  };

  const data = {
    app_id: ONE_SIGNAL_APP_ID,
    included_segments: ['All'],
    contents: { en: message },
  };

  try {
    await axios.post('https://onesignal.com/api/v1/notifications', data, { headers });
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
}

export default async function handler(req, res) {
  const { id, usuario_id, folio, anuncio, descripcion, search } = req.query; // Agregamos 'search' al destructuring

  if (req.method === 'GET') {

    // Caso para búsqueda de anuncios insensible a mayúsculas y minúsculas
    if (search) {
      const searchQuery = `%${search.toLowerCase()}%`; // Convertimos la búsqueda a minúsculas
      try {
        const [rows] = await connection.query(
          `SELECT id, usuario_id, folio, anuncio, descripcion, date, hora 
                    FROM anuncios 
                    WHERE LOWER(anuncio) LIKE ? 
                    OR LOWER(folio) LIKE ? 
                    OR LOWER(descripcion) LIKE ?`,
          [searchQuery, searchQuery, searchQuery]
        )

        if (rows.length === 0) {
          return res.status(404).json({ message: 'No se encontraron anuncios' });
        }

        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ error: 'Error al realizar la búsqueda' });
      }
      return
    }

    // Caso para obtener anuncio por folio
    if (folio) {

      try {
        const [rows] = await connection.query('SELECT id, usuario_id, folio, anuncio, descripcion, date, hora FROM anuncios WHERE folio = ?', [folio]);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Anuncio no encontrado' })
        }
        res.status(200).json(rows[0])
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
      return
    }

    // Caso para obtener anuncios anuncio
    if (anuncio) {
      try {
        const [rows] = await connection.query('SELECT id, usuario_id, folio, anuncio, descripcion, date, hora FROM anuncios WHERE anuncio = ?', [anuncio]);
        res.status(200).json(rows)
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
      return;
    }

    // Caso para obtener anuncios por descripcion
    if (descripcion) {
      try {
        const [rows] = await connection.query('SELECT id, usuario_id, folio, anuncio, descripcion, date, hora FROM anuncios WHERE descripcion = ? ', [descripcion]);
        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      return;
    }

    // Caso para obtener anuncio por usuario_id
    if (usuario_id) {
      try {
        const [rows] = await connection.query('SELECT id, usuario_id, folio, anuncio, descripcion, date, hora FROM anuncios WHERE usuario_id = ?', [usuario_id]);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Anuncio no encontrado' })
        }
        res.status(200).json(rows[0])
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
      return;
    }

    // Caso para obtener todos los anuncios
    try {
      const [rows] = await connection.query(
        `SELECT
        anuncios.id,
        anuncios.usuario_id,
        usuarios.nombre AS usuario_nombre,
        usuarios.isadmin AS usuario_isadmin,
        anuncios.folio,
        anuncios.anuncio,
        anuncios.descripcion,
        anuncios.date,
        anuncios.hora
    FROM anuncios
    JOIN usuarios ON anuncios.usuario_id = usuarios.id`
      )
      res.status(200).json(rows)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { usuario_id, folio, anuncio, descripcion, date, hora } = req.body;
      if (!usuario_id || !anuncio || !descripcion || !hora) {
        return res.status(400).json({ error: 'Todos los datos son obligatorios' })
      }

      const [result] = await connection.query(
        'INSERT INTO anuncios (usuario_id, folio, anuncio, descripcion, date, hora) VALUES (?, ?, ?, ?, ?, ?)',
        [usuario_id, folio, anuncio, descripcion, date, hora]
      )

      // Enviar notificación después de crear el anuncio
      const message = `Se ha creado un nuevo anuncio: ${anuncio}.`
      await sendNotification(message)

      const newClient = { id: result.insertId }
      res.status(201).json(newClient)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    // Actualización del anuncio
    const { anuncio, descripcion, date, hora } = req.body;

    if (!anuncio || !descripcion || !date || !hora || !id) {
      return res.status(400).json({ error: 'ID, anuncio y descripción son obligatorios' });
    }

    try {
      const [result] = await connection.query(
        'UPDATE anuncios SET anuncio = ?, descripcion = ?, date = ?, hora = ? WHERE id = ?',
        [anuncio, descripcion, date, hora, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Anuncio no encontrado' });
      }

      res.status(200).json({ message: 'Anuncio actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    if (!id) {
      return res.status(400).json({ error: 'ID de del anuncio es obligatorio' });
    }

    else {
      // Eliminar la incidencia por ID
      try {
        const [result] = await connection.query('DELETE FROM anuncios WHERE id = ?', [id]);

        // Verificar si el anuncio fue eliminado
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Anuncio no encontrado' });
        }

        res.status(200).json({ message: 'Anuncio eliminado correctamente' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
