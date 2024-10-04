/* import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import connection from '@/libs/db';
import bcrypt from 'bcrypt';

export default async function loginHandler(req, res) {
  const { emailOrUsuario, password } = req.body;

  try {
    const [rows] = await connection.query(
      'SELECT * FROM usuarios WHERE email = ? OR usuario = ?', 
      [emailOrUsuario, emailOrUsuario]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: '¡ Correo o contraseña no existe !' });
    }

    const user = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: '¡ Correo o contraseña no existe !' });
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        id: user.id,
        usuario: user.usuario,
        email: user.email,
      },
      'secret'
    );

    const serialized = serialize('myToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, 
      path: '/'
    });

    const serializedUserId = serialize('userId', user.id.toString(), {
      httpOnly: false, // Permitir acceso desde el cliente
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, 
      path: '/'
    });

    res.setHeader('Set-Cookie', [serialized, serializedUserId]);
    return res.json({ user: { usuario: user.usuario, email: user.email } });
  } catch (error) {
    console.error('Error al autenticar el usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
 */

import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import connection from '@/libs/db';
import bcrypt from 'bcrypt';

export default async function loginHandler(req, res) {
  const { emailOrUsuario, password } = req.body;

  try {
    const [rows] = await connection.query(
      'SELECT * FROM usuarios WHERE email = ? OR usuario = ?', 
      [emailOrUsuario, emailOrUsuario]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: '¡ Correo o contraseña no existe !' });
    }

    const user = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: '¡ Correo o contraseña no existe !' });
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        id: user.id,
        usuario: user.usuario,
        email: user.email,
      },
      'secret'
    );

    const serialized = serialize('myToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, 
      path: '/'
    });

    const serializedUserId = serialize('userId', user.id.toString(), {
      httpOnly: false, // Permitir acceso desde el cliente
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, 
      path: '/'
    });

    // Agregar cookies para el nombre y el usuario
    const serializedUserName = serialize('userName', user.nombre, { // Asegúrate de que `nombre` existe en el objeto `user`
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });

    const serializedUserUsername = serialize('userUsername', user.usuario, { // Asegúrate de que `usuario` existe en el objeto `user`
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });

    // Establecer las cookies en la respuesta
    res.setHeader('Set-Cookie', [serialized, serializedUserId, serializedUserName, serializedUserUsername]);
    
    // Enviar respuesta con los datos del usuario
    return res.json({ user: { usuario: user.usuario, email: user.email, nombre: user.nombre } });
  } catch (error) {
    console.error('Error al autenticar el usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
