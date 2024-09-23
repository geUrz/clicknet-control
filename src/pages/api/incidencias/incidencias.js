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
    const { id, usuario_id, zona, estado, search, deleteImage } = req.query; // Agregamos 'search' al destructuring

    if (req.method === 'GET') {

        // Caso para búsqueda de incidencias insensible a mayúsculas y minúsculas
        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`; // Convertimos la búsqueda a minúsculas
            try {
                const [rows] = await connection.query(
                    `SELECT id, usuario_id, folio, incidencia, descripcion, zona, estado, image 
                    FROM incidencias 
                    WHERE LOWER(incidencia) LIKE ?
                    OR LOWER(folio) LIKE ? 
                    OR LOWER(zona) LIKE ? 
                    OR LOWER(estado) LIKE ?`,
                    [searchQuery, searchQuery, searchQuery, searchQuery]
                )

                if (rows.length === 0) {
                    return res.status(404).json({ message: 'No se encontraron incidencias' });
                }

                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: 'Error al realizar la búsqueda' });
            }
            return
        }  
        // Caso para obtener incidencias destacados
        if (zona) {
            try {
                const [rows] = await connection.query('SELECT id, usuario_id, folio, incidencia, descripcion, zona, estado, image, createdAt FROM incidencias WHERE best = ?', [zona]);
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
            return;
        }

        // Caso para obtener incidencias por estado
        if (estado) {
            try {
                const [rows] = await connection.query('SELECT id, usuario_id, folio, incidencia, descripcion, zona, estado, image, createdAt FROM incidencias WHERE estado = ? ', [estado]);
                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            return;
        }

        // Caso para obtener negocio por usuario_id
        if (usuario_id) {
            try {
                const [rows] = await connection.query('SELECT id, usuario_id, folio, incidencia, descripcion, zona, estado, image, createdAt FROM incidencias WHERE usuario_id = ?', [usuario_id]);
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
            incidencias.image,
            incidencias.createdAt
        FROM incidencias
        JOIN usuarios ON incidencias.usuario_id = usuarios.id
    `);
            res.status(200).json(rows)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'POST') {
        try {
            const { usuario_id, folio, incidencia, descripcion, zona, estado, image } = req.body;
            if (!usuario_id || !incidencia || !descripcion) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }

            const [result] = await connection.query(
                'INSERT INTO incidencias (usuario_id, folio, incidencia, descripcion, zona, estado, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [usuario_id, folio, incidencia, descripcion, zona, estado, image]
            )

            // Enviar notificación después de crear la incidencia
            const message = `Se ha creado una nueva incidencia: ${incidencia}.`
            await sendNotification(message)

            const newClient = { id: result.insertId }
            res.status(201).json(newClient)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la incidencia es obligatorio' });
        }

        const { incidencia, descripcion, zona, estado, image } = req.body;

        if (image) {
            // Actualización solo de la imagen
            try {
                const [result] = await connection.query(
                    'UPDATE incidencias SET image = ? WHERE id = ?',
                    [image, id]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Incidencia no encontrada' });
                }

                res.status(200).json({ message: 'Imagen actualizada correctamente' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else if (incidencia && descripcion) {
            // Actualización completa del negocio
            try {

                const [result] = await connection.query(
                    'UPDATE incidencias SET incidencia = ?, descripcion = ?, zona = ?, estado = ?, image = ?',
                    [incidencia, descripcion, zona, estado, image]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Incidencia no encontrada' });
                }

                res.status(200).json({ message: 'Incidencia actualizada correctamente' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            return res.status(400).json({ error: 'Datos insuficientes para actualizar la incidencia' });
        }
    } else if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la incidencia es obligatorio' });
        }

        if (deleteImage === 'true') {
            try {
                const [result] = await connection.query(
                    'UPDATE incidencias SET image = NULL WHERE id = ?',
                    [id]
                );
        
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Incidencia no encontrada' });
                }
        
                res.status(200).json({ message: 'Imagen eliminada correctamente' });
            } catch (error) {
                console.error('Error en el servidor al eliminar la imagen:', error.message, error.stack);
                res.status(500).json({ error: 'Error interno del servidor al eliminar la imagen' });
            }
        
        } else {
            // Eliminar la incidencia por ID
            try {
                const [result] = await connection.query('DELETE FROM incidencias WHERE id = ?', [id]);

                // Verificar si el negocio fue eliminado
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Incidencia no encontrada' });
                }

                res.status(200).json({ message: 'Incidencia eliminada correctamente' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
