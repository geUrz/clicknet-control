import { v4 as uuidv4 } from 'uuid';
import { getConnection } from '@/libs/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const code = uuidv4();
      const connection = await getConnection();

      // Verificar si la conexión a la base de datos es exitosa
      if (!connection) {
        throw new Error('No se pudo conectar a la base de datos');
      }

      // Ejecutar la consulta para insertar el código
      await connection.execute('INSERT INTO visit_codes (code) VALUES (?)', [code]);
      res.status(200).json({ code });
    } catch (error) {
      console.error('Error en /api/generate-code:', error.message); // Imprime el mensaje de error en la consola
      res.status(500).json({ message: 'Error generando el código', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
