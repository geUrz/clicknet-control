import jwt from 'jsonwebtoken'
import connection from '@/libs/db'
import { parse } from 'cookie'

export default async function meHandler(req, res) {
  try {
    const cookies = parse(req.headers.cookie || '')
    const token = cookies.myToken;

    if (!token) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const decoded = jwt.verify(token, 'secret')

    const [rows] = await connection.query(`
      SELECT 
        usuarios.id, 
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
      JOIN 
        residenciales ON usuarios.residencial_id = residenciales.id 
      WHERE 
        usuarios.id = ?
    `, [decoded.id])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const user = rows[0];

    return res.json({ 
      user: { 
        id: user.id, 
        nombre: user.nombre, 
        usuario: user.usuario, 
        privada: user.privada, 
        calle: user.calle, 
        casa: user.casa, 
        email: user.email, 
        isadmin: user.isadmin, 
        residencial_id: user.residencial_id,
        nombre_residencial: user.nombre_residencial 
      } 
    })
  } catch (error) {
    console.error('Error al obtener el usuario:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
