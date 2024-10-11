import connection from "@/libs/db"

export default async function handler(req, res) {
  const { id } = req.query; // Agregamos 'search' al destructuring

  if (req.method === 'GET') {

    // Caso para obtener todos los residenciales
    try {
      const [rows] = await connection.query(
        `SELECT
        residenciales.id,
        residenciales.usuario_id,
        residenciales.folio,
        usuarios.nombre AS usuario_nombre,
        usuarios.isadmin AS usuario_isadmin,
        residenciales.nombre,
        residenciales.direccion,
        residenciales.createdAt
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
      const { usuario_id, folio, nombre, direccion } = req.body;
      if (!usuario_id || !folio || !nombre || !direccion) {
        return res.status(400).json({ error: 'Todos los datos son obligatorios' })
      }

      const [result] = await connection.query(
        'INSERT INTO residenciales (usuario_id, folio, nombre, direccion) VALUES (?, ?, ?, ?)',
        [usuario_id, folio, nombre, direccion]
      )

      const newClient = { id: result.insertId }
      res.status(201).json(newClient)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {

    const { nombre, direccion } = req.body;

    if (!nombre || !direccion || !id) {
      return res.status(400).json({ error: 'ID, nombre y direccion son obligatorios' })
    }

    try {
      const [result] = await connection.query(
        'UPDATE residenciales SET nombre = ?, direccion = ? WHERE id = ?',
        [nombre, direccion, id]
      )

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Residencial no encontrado' })
        }

        res.status(200).json({ message: 'Residencial actualizado correctamente' })
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
  } else if (req.method === 'DELETE') {
    
    if (!id) {
      return res.status(400).json({ error: 'ID del residencial es obligatorio' })
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
