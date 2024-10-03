import { parseISO, isSameDay, format } from 'date-fns';
import connection from "@/libs/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { codigo } = req.body;

    // Validar si el código fue proporcionado
    if (!codigo) {
      return res.status(400).json({ message: 'Código no proporcionado' });
    }

    try {
      // Obtener la visita asociada al código proporcionado
      const [rows] = await connection.execute(`
        SELECT visitas.id, visitas.usuario_id, visitas.codigo, visitas.visita, visitas.tipovisita, 
               visitas.tipoacceso, visitas.nota, visitas.date, visitas.fromDate, visitas.toDate, visitas.hora, visitas.estado, visitas.dias, visitas.countAcc, 
               usuarios.nombre AS usuario_nombre, usuarios.privada AS usuario_privada, usuarios.calle AS usuario_calle, usuarios.casa AS usuario_casa
        FROM visitas
        JOIN usuarios ON visitas.usuario_id = usuarios.id
        WHERE visitas.codigo = ?
      `, [codigo]);

      // Si no se encuentran filas, significa que el código es inválido
      if (rows.length === 0) {
        return res.status(400).json({ message: 'Código inválido' });
      }

      // Verificar el estado de la visita
      const visita = rows[0];
      const today = format(new Date(), 'yyyy-MM-dd')
      const visitaDate = parseISO(visita.date);

      const msjTipoAcceso = visita.tipoacceso === 'eventual' || visita.tipoacceso === 'frecuente'
        ? `${visita.tipoacceso}`
        : 'Código inválido';

      if (visita.estado === 'Sin ingresar') {
        if (visita.tipoacceso === 'frecuente') {
          // Validar acceso frecuente
          const fromDate = parseISO(visita.fromDate);
          const toDate = parseISO(visita.toDate);
          if (isWithinInterval(today, { start: fromDate, end: toDate })) {
            const diasSeleccionados = visita.dias ? visita.dias.split(', ').map(d => d.trim()) : [];
            const diaActual = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][today.getDay()];

            if (diasSeleccionados.includes(diaActual)) {
              return res.status(200).json({
                message: `¡ Código ${msjTipoAcceso} válido !\n El visitante no ha ingresado`,
                visita
              });
            } else {
              return res.status(400).json({ message: `¡ Código ${msjTipoAcceso} no válido !\n Hoy no es un día permitido para ingresar` });
            }
          } else {
            return res.status(400).json({ message: `¡ Código ${msjTipoAcceso} no válido !\n La fecha de ingreso no está disponible` });
          }
        } else if (visita.tipoacceso === 'eventual') {
          // Validar acceso eventual
          if (isSameDay(visitaDate, today)) {
            return res.status(200).json({
              message: `¡ Código ${msjTipoAcceso} válido !\n El visitante no ha ingresado`,
              visita
            });
          } else {
            return res.status(400).json({ message: `¡ Código ${msjTipoAcceso} no válido !\n La fecha de ingreso no está disponible` });
          }
        }
      } else if (visita.estado === 'Ingresado') {
        if (visita.tipoacceso === 'frecuente') {
          const fromDate = parseISO(visita.fromDate);
          const toDate = parseISO(visita.toDate);
          if (isWithinInterval(today, { start: fromDate, end: toDate })) {
            const diasSeleccionados = visita.dias ? visita.dias.split(', ').map(d => d.trim()) : [];
            const diaActual = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][today.getDay()];

            if (diasSeleccionados.includes(diaActual)) {
              return res.status(200).json({
                message: `¡ Código ${msjTipoAcceso} válido !\n El visitante ha ingresado ${visita.countAcc} veces`,
                visita
              });
            } else {
              return res.status(400).json({ message: `¡ Código ${msjTipoAcceso} no válido !\n Hoy no es un día permitido para ingresar` });
            }
          } else {
            return res.status(400).json({ message: `¡ Código ${msjTipoAcceso} no válido !\n La fecha de ingreso no está disponible` });
          }
        } else if (visita.tipoacceso === 'eventual') {
          return res.status(400).json({ message: `¡ Código ${msjTipoAcceso} utilizado !\n El visitante ya ingresó` });
        }
      } else if (visita.estado === 'Retirado') {
        return res.status(400).json({ message: `¡ Código ${msjTipoAcceso} caducado !\n El visitante ya se retiró` });
      } else {
        return res.status(400).json({ message: `Código ${msjTipoAcceso}\n Estado del código no reconocido` });
      }

    } catch (error) {
      console.error('Error en /api/visitas/consultar-codigo:', error.message);
      res.status(500).json({ message: 'Error al consultar el código', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
