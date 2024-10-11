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
    const { id, residencial_id, usuario_id, search, deleteImage } = req.query; // Agregamos 'search' al destructuring

    if (req.method === 'GET') {

        // Caso para búsqueda de incidencias insensible a mayúsculas y minúsculas
        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`; // Convertimos la búsqueda a minúsculas
            try {
                const [rows] = await connection.query(
                    `SELECT id, usuario_id, folio, incidencia, descripcion, zona, estado 
                    FROM incidencias 
                    WHERE LOWER(incidencia) LIKE ?
                    OR LOWER(folio) LIKE ? 
                    OR LOWER(zona) LIKE ? 
                    OR LOWER(estado) LIKE ?`,
                    [searchQuery, searchQuery, searchQuery, searchQuery]
                )

                if (rows.length === 0) {
                    return res.status(404).json({ message: 'No se encontraron incidencias' })
                }

                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: 'Error al realizar la búsqueda' })
            }
            return
        }
        // Caso para obtener incidencia por usuario_id
        if (residencial_id) {
            try {
                const [rows] = await connection.query('SELECT id, usuario_id, folio, incidencia, descripcion, zona, estado, img1, img2, residencial_id createdAt FROM incidencias WHERE residencial_id = ?', [residencial_id])
                if (rows.length === 0) {
                    return res.status(404).json({ error: 'Negocio no encontrado' })
                }
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
            return;
        }

        // Caso para obtener todos los incidencias
        try {
            const [rows] = await connection.query(
                `SELECT
            incidencias.id,
            incidencias.usuario_id,
            usuarios.nombre AS usuario_nombre,
            usuarios.usuario AS usuario_usuario,
            usuarios.privada AS usuario_privada,
            usuarios.calle AS usuario_calle,
            usuarios.casa AS usuario_casa,
            usuarios.usuario AS usuario_usuario,
            incidencias.folio,
            incidencias.incidencia,
            incidencias.descripcion,
            incidencias.zona,
            incidencias.estado,
            incidencias.img1,
            incidencias.img2,
            incidencias.residencial_id,
            incidencias.createdAt
        FROM incidencias
        JOIN usuarios ON incidencias.usuario_id = usuarios.id
        ORDER BY incidencias.updatedAt DESC
    `)
            res.status(200).json(rows)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'POST') {
        try {
            const { usuario_id, folio, incidencia, descripcion, zona, estado, residencial_id } = req.body;
            if (!usuario_id || !incidencia || !descripcion || !residencial_id) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }

            const [result] = await connection.query(
                'INSERT INTO incidencias (usuario_id, folio, incidencia, descripcion, zona, estado, residencial_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [usuario_id, folio, incidencia, descripcion, zona, estado, residencial_id]
            )

            const header = 'Incidencia creada'
            const message = `${incidencia}`
            const url = '/incidencias'
            await sendNotification(usuario_id, header, message, url)

            const newClient = { id: result.insertId }
            res.status(201).json(newClient)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la incidencia es obligatorio' })
        }

        const { incidencia, descripcion, zona, estado } = req.body;

        if (!incidencia || !descripcion || !zona || !estado || !id) {
            return res.status(400).json({ error: 'ID, visitatecnica y descripción son obligatorios' })
          }
        
            try {

                const [result] = await connection.query(
                    'UPDATE incidencias SET incidencia = ?, descripcion = ?, zona = ?, estado = ? WHERE id = ?',
                    [incidencia, descripcion, zona, estado, id]
                )

                const header = 'Incidencia modificada'
                const message = `${incidencia}`
                const url = '/incidencias'
                await sendNotification(usuario_id, header, message, url)

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Incidencia no encontrada' })
                }

                res.status(200).json({ message: 'Incidencia actualizada correctamente' })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
    } else if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la incidencia es obligatorio' })
        }

        if (deleteImage === 'true') {
            try {
                const [result] = await connection.query(
                    'UPDATE incidencias SET image = NULL WHERE id = ?',
                    [id]
                )
        
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Incidencia no encontrada' })
                }
        
                res.status(200).json({ message: 'Imagen eliminada correctamente' })
            } catch (error) {
                console.error('Error en el servidor al eliminar la imagen:', error.message, error.stack)
                res.status(500).json({ error: 'Error interno del servidor al eliminar la imagen' })
            }
        
        } else {
            // Eliminar la incidencia por ID
            try {
                const [result] = await connection.query('DELETE FROM incidencias WHERE id = ?', [id])

                const header = 'Incidencia eliminada'
                const message = `${incidencia}`
                const url = '/incidencias'
                await sendNotification(usuario_id, header, message, url)
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Incidencia no encontrada' })
                }

                res.status(200).json({ message: 'Incidencia eliminada correctamente' })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
