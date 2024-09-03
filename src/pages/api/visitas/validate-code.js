import { getConnection } from "@/libs/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Código no proporcionado' });
    }

    try {
      const connection = await getConnection();
      const [rows] = await connection.execute('SELECT * FROM visit_codes WHERE code = ?', [code]);

      if (rows.length === 0) {
        return res.status(400).json({ message: 'Código inválido' });
      }

      if (rows[0].visitor_info) {
        return res.status(400).json({ message: 'Código ya usado' });
      }

      await connection.execute('UPDATE visit_codes SET visitor_info = ? WHERE code = ?', ['Visitante', code]);
      res.status(200).json({ message: 'Código válido, autenticación exitosa' });
    } catch (error) {
      console.error('Error en /api/validate-code:', error.message);
      res.status(500).json({ message: 'Error validando el código', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
