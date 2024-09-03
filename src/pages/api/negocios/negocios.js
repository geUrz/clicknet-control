import connection from "@/libs/db"
import slugify from "slugify"
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
    const { id, usuario_id, best, categoria, slug, search, deleteImage } = req.query; // Agregamos 'search' al destructuring

    if (req.method === 'GET') {

        // Caso para búsqueda de negocios insensible a mayúsculas y minúsculas
        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`; // Convertimos la búsqueda a minúsculas
            try {
                const [rows] = await connection.query(
                    `SELECT id, usuario_id, negocio, descripcion, categoriaone, categoriatwo, tags, tel, whatsapp, facebook, email, web, ubicacion, mapa, best, image, slug 
                    FROM negocios 
                    WHERE LOWER(negocio) LIKE ? 
                    OR LOWER(descripcion) LIKE ? 
                    OR LOWER(categoriaone) LIKE ? 
                    OR LOWER(categoriatwo) LIKE ?
                    OR LOWER(tags) LIKE ?`,
                    [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]
                );

                if (rows.length === 0) {
                    return res.status(404).json({ message: 'No se encontraron negocios' });
                }

                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: 'Error al realizar la búsqueda' });
            }
            return
        }  

        // Caso para obtener negocio por slug
        if (slug) {
            console.log('Buscando negocio con slug:', slug)
            try {
                const [rows] = await connection.query('SELECT id, usuario_id, negocio, descripcion, categoriaone, categoriatwo, tel, whatsapp, facebook, email, web, ubicacion, mapa, best, image, slug FROM negocios WHERE slug = ?', [slug]);
                if (rows.length === 0) {
                    return res.status(404).json({ error: 'Negocio no encontrado' })
                }
                res.status(200).json(rows[0])
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
            return
        }

        // Caso para obtener negocios destacados
        if (best === 'true') {
            try {
                const [rows] = await connection.query('SELECT id, usuario_id, negocio, descripcion, categoriaone, categoriatwo, tel, whatsapp, facebook, email, web, ubicacion, mapa, best, image, slug FROM negocios WHERE best = ?', ['true']);
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
            return;
        }

        // Caso para obtener negocios por categoría
        if (categoria) {
            try {
                const [rows] = await connection.query('SELECT id, usuario_id, negocio, descripcion, categoriaone, categoriatwo, tel, whatsapp, facebook, email, web, ubicacion, mapa, best, image, slug FROM negocios WHERE categoriaone = ? OR categoriatwo = ?', [categoria, categoria]);
                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            return;
        }

        // Caso para obtener negocio por usuario_id
        if (usuario_id) {
            try {
                const [rows] = await connection.query('SELECT id, usuario_id, negocio, descripcion, categoriaone, categoriatwo, tel, whatsapp, facebook, email, web, ubicacion, mapa, best, image, slug FROM negocios WHERE usuario_id = ?', [usuario_id]);
                if (rows.length === 0) {
                    return res.status(404).json({ error: 'Negocio no encontrado' })
                }
                res.status(200).json(rows[0])
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
            return;
        }

        // Caso para obtener todos los negocios
        try {
            const [rows] = await connection.query('SELECT id, usuario_id, negocio, descripcion, categoriaone, categoriatwo, tel, whatsapp, facebook, email, web, ubicacion, mapa, best, image, slug FROM negocios')
            res.status(200).json(rows)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'POST') {
        try {
            const { usuario_id, negocio, descripcion, categoriaone, categoriatwo, tags, tel, whatsapp, facebook, email, web, ubicacion, mapa, best, image } = req.body;
            if (!usuario_id || !negocio || !categoriaone) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }

            // Generar el slug del nombre del negocio
            const slug = slugify(negocio, { lower: true, strict: true })

            const [result] = await connection.query(
                'INSERT INTO negocios (usuario_id, negocio, slug, descripcion, categoriaone, categoriatwo, tags, tel, whatsapp, facebook, email, web, ubicacion, mapa, best, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [usuario_id, negocio, slug, descripcion, categoriaone, categoriatwo, tags, tel, whatsapp, facebook, email, web, ubicacion, mapa, best, image]
            );

            // Enviar notificación después de crear la nota
            const message = `Se ha creado un nuevo negocio: ${negocio}.`
            await sendNotification(message)

            const newClient = { id: result.insertId }
            res.status(201).json(newClient)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'ID del negocio es obligatorio' });
        }

        const { image, negocio, descripcion, categoriaone, categoriatwo, tags, tel, whatsapp, facebook, email, web, ubicacion, mapa, best } = req.body;

        if (image) {
            // Actualización solo de la imagen
            try {
                const [result] = await connection.query(
                    'UPDATE negocios SET image = ? WHERE id = ?',
                    [image, id]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Negocio no encontrado' });
                }

                res.status(200).json({ message: 'Imagen actualizada correctamente' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else if (negocio && categoriaone) {
            // Actualización completa del negocio
            try {
                const slug = slugify(negocio, { lower: true, strict: true });

                const [result] = await connection.query(
                    'UPDATE negocios SET negocio = ?, descripcion = ?, categoriaone = ?, categoriatwo = ?, tags = ?, tel = ?, whatsapp = ?, facebook = ?, email = ?, web = ?, ubicacion = ?, mapa = ?, best = ?, image = ?, slug = ? WHERE id = ?',
                    [negocio, descripcion, categoriaone, categoriatwo, tags, tel, whatsapp, facebook, email, web, ubicacion, mapa, best, image, slug, id]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Negocio no encontrado' });
                }

                res.status(200).json({ message: 'Negocio actualizado correctamente' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            return res.status(400).json({ error: 'Datos insuficientes para actualizar el negocio' });
        }
    } else if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({ error: 'ID del negocio es obligatorio' });
        }

        if (deleteImage === 'true') {
            try {
                const [result] = await connection.query(
                    'UPDATE negocios SET image = NULL WHERE id = ?',
                    [id]
                );
        
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Negocio no encontrado' });
                }
        
                res.status(200).json({ message: 'Imagen eliminada correctamente' });
            } catch (error) {
                console.error('Error en el servidor al eliminar la imagen:', error.message, error.stack);
                res.status(500).json({ error: 'Error interno del servidor al eliminar la imagen' });
            }
        
        } else {
            // Eliminar el negocio por ID
            try {
                const [result] = await connection.query('DELETE FROM negocios WHERE id = ?', [id]);

                // Verificar si el negocio fue eliminado
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Negocio no encontrado' });
                }

                res.status(200).json({ message: 'Negocio eliminado correctamente' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
