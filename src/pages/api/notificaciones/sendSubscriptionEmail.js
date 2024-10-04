import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { playerId, userId } = req.body;

  // Configurar transporte de correo
  const transporter = nodemailer.createTransport({
    service: 'gmail', // O utiliza un proveedor como SendGrid o Mailgun
    auth: {
      user: process.env.EMAIL_USER, // Tu correo
      pass: process.env.EMAIL_PASS, // Tu contraseña o clave de aplicación
    },
  });

  // Configurar correo
  const mailOptions = {
    from: process.env.EMAIL_USER, // Remitente
    to: 'gerardourzua20@gmail.com',   // Correo donde recibirás la notificación
    subject: 'Nuevo dispositivo suscrito a notificaciones',
    text: `Un nuevo dispositivo se ha suscrito. Player ID: ${playerId}, User ID: ${userId}`,
  };

  try {

    console.log('Intentando enviar correo a:', mailOptions.to)
    // Enviar correo
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error enviando correo:', error);
    res.status(500).json({ message: 'Error enviando correo', error: error.message });
  }
}
