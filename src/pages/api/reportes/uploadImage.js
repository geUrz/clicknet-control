import multer from 'multer';
import fs from 'fs';
import path from 'path';
import connection from '@/libs/db'; // Importa la conexión desde db.js

const uploadFolder = './public/uploads';

// Crear el directorio si no existe
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configuración de multer para guardar las imágenes en /public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // La carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para evitar colisiones
  },
});

// Configuración de multer con límite de tamaño de archivo
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
});

export const config = {
  api: {
    bodyParser: false, // Desactivar el body parser para manejar el archivo con multer
  },
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const uploadHandler = upload.single('file');

    uploadHandler(req, res, async (err) => {
      if (err) {
        console.error('Error al subir la imagen:', err);
        return res.status(500).json({ error: 'Error al subir la imagen', details: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' });
      }

      const filePath = `/uploads/${req.file.filename}`;
      const { id, imageKey } = req.body;

      if (!id || !imageKey) {
        return res.status(400).json({ error: 'ID del reporte o key de la imagen no proporcionados' });
      }

      try {
        const updateQuery = `
          UPDATE reportes
          SET ${imageKey} = ?
          WHERE id = ?;
        `;
        const [result] = await connection.execute(updateQuery, [filePath, id]);

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Reporte no encontrado' });
        }

        return res.status(200).json({ filePath }); // Siempre responde al cliente
      } catch (dbError) {
        console.error('Error al actualizar el reporte:', dbError);
        return res.status(500).json({ error: 'Error al actualizar el reporte', details: dbError.message });
      }
    });
  } else if (req.method === 'DELETE') {
    const { id, imageKey } = req.query;

    if (!id || !imageKey) {
      return res.status(400).json({ error: 'ID del reporte o key de la imagen no proporcionados' });
    }

    try {
      // Obtener la ruta de la imagen desde la base de datos
      const selectQuery = `
        SELECT ${imageKey} AS filePath
        FROM reportes
        WHERE id = ?;
      `;
      const [rows] = await connection.execute(selectQuery, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Reporte no encontrado' });
      }

      const { filePath } = rows[0];

      // Eliminar el archivo del sistema si existe
      if (filePath) {
        const fullPath = path.join(uploadFolder, path.basename(filePath));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }

      // Actualizar el campo en la base de datos a NULL
      const updateQuery = `
        UPDATE reportes
        SET ${imageKey} = NULL
        WHERE id = ?;
      `;
      const [result] = await connection.execute(updateQuery, [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No se pudo actualizar el reporte' });
      }

      return res.status(200).json({ message: 'Imagen eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      return res.status(500).json({ error: 'Error al eliminar la imagen', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
};

export default handler;
