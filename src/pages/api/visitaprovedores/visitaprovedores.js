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
        await axios.post('https://onesignal.com/api/v1/notifications', data, { headers })
    } catch (error) {
        console.error('Error sending notification:', error.message)
    }
}

export default async function handler(req, res) {
    const { id, usuario_id } = req.query

    if (req.method === 'GET') {

        // Caso para obtener visitaprovedores por usuario_id
        if (usuario_id) {
            try {
                const [rows] = await connection.query('SELECT id, usuario_id, folio, visitaprovedor, descripcion, createdAt FROM visitaprovedores WHERE usuario_id = ?', [usuario_id])
                if (rows.length === 0) {
                    return res.status(404).json({ error: 'Negocio no encontrado' })
                }
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
            return;
        }

        // Caso para obtener todos los visitaprovedores
        try {
            const [rows] = await connection.query(
                `SELECT
                    visitaprovedores.id,
                    visitaprovedores.usuario_id,
                    usuarios.nombre AS usuario_nombre,
                    usuarios.usuario AS usuario_usuario,
                    usuarios.privada AS usuario_privada,
                    usuarios.calle AS usuario_calle,
                    usuarios.casa AS usuario_casa,
                    usuarios.usuario AS usuario_usuario,
                    visitaprovedores.folio,
                    visitaprovedores.visitaprovedor,
                    visitaprovedores.descripcion,
                    autorizo_usuario.usuario AS autorizo_usuario,
                    visitaprovedores.createdAt
                FROM visitaprovedores
                JOIN usuarios ON visitaprovedores.usuario_id = usuarios.id
                LEFT JOIN usuarios AS autorizo_usuario ON visitaprovedores.autorizo = autorizo_usuario.id
                ORDER BY visitaprovedores.updatedAt DESC
    `)
            res.status(200).json(rows)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'POST') {
        try {
            const { usuario_id, folio, visitaprovedor, descripcion, autorizo } = req.body;
            if (!usuario_id || !visitaprovedor || !descripcion) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }

            const [result] = await connection.query(
                'INSERT INTO visitaprovedores (usuario_id, folio, visitaprovedor, descripcion, autorizo) VALUES (?, ?, ?, ?, ?)',
                [usuario_id, folio, visitaprovedor, descripcion, autorizo]
            )

            // Enviar notificación después de crear la visitaprovedor
            const message = `Se ha creado una nueva visitaprovedor: ${visitaprovedor}.`
            await sendNotification(message)

            const newClient = { id: result.insertId }
            res.status(201).json(newClient)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la visitaprovedor es obligatorio' })
        }

        const { visitaprovedor, descripcion } = req.body;

        if (visitaprovedor && descripcion) {
            // Actualización completa del negocio
            try {

                const [result] = await connection.query(
                    'UPDATE visitaprovedores SET visitaprovedor = ?, descripcion = ?',
                    [visitaprovedor, descripcion]
                )

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Visita provedor no encontrada' })
                }

                res.status(200).json({ message: 'Visita provedor actualizada correctamente' })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        } else {
            return res.status(400).json({ error: 'Datos insuficientes para actualizar la visitaprovedor' })
        }
    } else if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la visitaprovedor es obligatorio' })
        }

        else{
            // Eliminar la visitaprovedor por ID
            try {
                const [result] = await connection.query('DELETE FROM visitaprovedores WHERE id = ?', [id])

                // Verificar si el negocio fue eliminado
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Visita provedor no encontrada' })
                }

                res.status(200).json({ message: 'Visita provedor eliminada correctamente' })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
