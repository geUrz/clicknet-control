import connection from "@/libs/db";

export default async function handler(req, res) {
    const { id, search } = req.query;

    if (req.method === 'GET') {

        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`
            try {
                const [rows] = await connection.query(
                    `SELECT  
                        usuarios.folio, 
                        usuarios.nombre, 
                        usuarios.usuario, 
                        usuarios.privada, 
                        usuarios.calle, 
                        usuarios.casa, 
                        usuarios.email, 
                        usuarios.isadmin, 
                        usuarios.residencial_id, 
                        residenciales.nombre AS nombre_residencial
                    FROM 
                        usuarios
                    LEFT JOIN 
                        residenciales ON usuarios.residencial_id = residenciales.id
                    WHERE LOWER(usuarios.nombre) LIKE ? 
                    OR LOWER(usuarios.folio) LIKE ? 
                    OR LOWER(usuarios.usuario) LIKE ? 
                    OR LOWER(usuarios.privada) LIKE ? 
                    OR LOWER(usuarios.calle) LIKE ? 
                    OR LOWER(usuarios.casa) LIKE ? 
                    OR LOWER(usuarios.email) LIKE ? 
                    OR LOWER(residenciales.nombre) LIKE ? 
                    ORDER BY usuarios.createdAt DESC`, 
                    [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]
                )

                if (rows.length === 0) {
                    return res.status(404).json({ message: 'No se encontraron usuarios' })
                }

                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: 'Error al realizar la búsqueda' })
            }
            return;
        }

        if (id) {
            try {
                const [rows] = await connection.query(
                    'SELECT id, nombre, usuario, privada, calle, casa, email, isadmin, residencial_id FROM usuarios WHERE id = ?',
                    [id]
                );

                if (rows.length === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }

                res.status(200).json(rows[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            try {
                const [rows] = await connection.query(
                    `SELECT 
                        usuarios.id, 
                        usuarios.folio, 
                        usuarios.nombre, 
                        usuarios.usuario, 
                        usuarios.privada, 
                        usuarios.calle, 
                        usuarios.casa, 
                        usuarios.email, 
                        usuarios.isadmin, 
                        usuarios.residencial_id, 
                        residenciales.nombre AS nombre_residencial
                    FROM 
                        usuarios
                    LEFT JOIN 
                        residenciales ON usuarios.residencial_id = residenciales.id
                    ORDER BY 
                        usuarios.createdAt DESC`
                );
                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    } else if (req.method === 'POST') {
        // Crear un nuevo usuario
        const { folio, nombre, usuario, privada, calle, casa, email, isadmin, residencial_id } = req.body;

        try {
            const [result] = await connection.query(
                `INSERT INTO usuarios (folio, nombre, usuario, privada, calle, casa, email, isadmin, residencial_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [folio, nombre, usuario, privada, calle, casa, email, isadmin, residencial_id]
            );

            res.status(201).json({ id: result.insertId, folio, nombre, usuario, privada, calle, casa, email, isadmin, residencial_id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'PUT') {
        // Actualizar un usuario existente
        if (!id) {
            return res.status(400).json({ error: 'ID del usuario es necesario para actualizar' });
        }

        const { nombre, usuario, privada, calle, casa, email, isadmin, residencial_id } = req.body;

        try {
            const [result] = await connection.query(
                `UPDATE usuarios 
                 SET nombre = ?, usuario = ?, privada = ?, calle = ?, casa = ?, email = ?, isadmin = ?, residencial_id = ?
                 WHERE id = ?`,
                [nombre, usuario, privada, calle, casa, email, isadmin, residencial_id, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).json({ id, nombre, usuario, privada, calle, casa, email, isadmin, residencial_id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
