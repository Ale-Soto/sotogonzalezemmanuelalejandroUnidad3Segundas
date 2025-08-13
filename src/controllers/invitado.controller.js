import nodemailer from 'nodemailer'
import Invitado from "../models/invitado.model.js"
import Estudiante from "../models/estudiante.model.js"
import Eventos from "../models/event.model.js"
import QRCode from 'qrcode'
import fs from 'fs'
import path from 'path'
import {
 fileURLToPath
} from 'url'

const transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
  user: process.env.MAIL_USER, // Asegúrate de que esta variable esté correctamente definida
  pass: process.env.MAIL_PASS // Asegúrate de que esta variable también esté bien definida
 }
})

// Configuración para manejar rutas de archivos en ES modules
const __filename = fileURLToPath(
 import.meta.url)
const __dirname = path.dirname(__filename)

// Obtener todos los invitados de un evento
export const getInvitadosPorEvento = async (req, res) => {
 try {
  const {
   id_evento
  } = req.params
  const invitados = await Invitado.find({
   id_evento
  }).populate('id_estudiante')
  res.json(invitados)
 } catch (error) {
  res.status(500).json({
   error: error.message
  })
 }
}

const generateQR = async (data) => {
 try {
  // Crear directorio temporal si no existe
  const tempDir = path.join(__dirname, '../temp')
  if (!fs.existsSync(tempDir)) {
   fs.mkdirSync(tempDir)
  }

  // Generar nombre único para el archivo QR
  const qrFileName = `qr_${Date.now()}.png`
  const qrFilePath = path.join(tempDir, qrFileName)

  // Generar el código QR
  await QRCode.toFile(qrFilePath, data, {
   color: {
    dark: '#000000', // Puntos oscuros
    light: '#ffffff' // Fondo
   },
   width: 300,
   margin: 2
  });

  return qrFilePath
 } catch (err) {
  console.error('Error generando QR:', err)
  throw err
 }
}

// Crear invitaciones en lote

// Crear invitaciones en lote y enviar correos
export const crearInvitacionesLote = async (req, res) => {
 try {
  const {
   id_evento,
   id_estudiantes
  } = req.body; // array de ids de estudiantes
  const invitaciones = id_estudiantes.map(id_estudiante => ({
   id_evento,
   id_estudiante,
   asistencia: false
  }))

  // Obtener el nombre y detalles del evento usando el id_evento
  const evento = await Eventos.findById(id_evento)

  if (!evento) {
   return res.status(404).json({
    mensaje: "Evento no encontrado."
   })
  }

  const result = await Invitado.insertMany(invitaciones, {
   ordered: false
  })

  //GENERAR 1 QR POR CADA ID DE INVIDATO

  // Enviar el correo a cada estudiante invitado
  for (let i = 0; i < result.length; i++) {
   const invitacion = result[i];
   const estudiante = await Estudiante.findById(invitacion.id_estudiante)

   if (estudiante && estudiante.correo) {
    try {

     // Generar QR con el ID de la invitación
     const qrData = JSON.stringify({
      id_invitado: invitacion._id.toString(),
      id_evento: id_evento.toString()
     })

     const qrFilePath = await generateQR(qrData);

     await transporter.sendMail({
      from: `"Control de Acceso" <${process.env.MAIL_USER}>`,
      to: estudiante.correo,
      subject: `¡Tienes una invitación al evento "${evento.nombre}"!`,
      text: `
            Hola ${estudiante.nombre},\n\n
            Has sido invitado al evento escolar "${evento.nombre}". Aquí están los detalles:
            \n\n
            Nombre del evento: ${evento.nombre}
            \nDescripción: ${evento.descripcion}
            \nFecha: ${evento.fecha}
            \nHora: ${evento.hora}
            \nLugar: ${evento.lugar}
            \n\nConsulta la plataforma para más detalles.
          `,
      html: `
            <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                    color: #333;
                  }
                  .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                  }
                  .header h1 {
                    margin: 0;
                    font-size: 24px;
                  }
                  .content {
                    padding: 20px;
                    text-align: left;
                  }
                  .content h2 {
                    color: #333;
                    font-size: 22px;
                    margin-bottom: 10px;
                  }
                  .content p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #555;
                  }
                  .cta-button {
                    display: inline-block;
                    background-color: #4CAF50;
                    color: white;
                    padding: 12px 30px;
                    font-size: 16px;
                    text-decoration: none;
                    border-radius: 4px;
                    margin-top: 20px;
                    text-align: center;
                  }
                  .cta-button:hover {
                    background-color: #45a049;
                  }
                  .footer {
                    background-color: #f9f9f9;
                    padding: 15px;
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                  }
                  @media (max-width: 600px) {
                    .container {
                      width: 100%;
                      padding: 15px;
                    }
                    .content {
                      padding: 15px;
                    }
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>¡Estás invitado al evento "${evento.nombre}"!</h1>
                  </div>
                  <div class="content">
                    <h2>Hola ${estudiante.nombre},</h2>
                    <p>Nos complace informarte que has sido invitado al evento <b>"${evento.nombre}"</b>. Queremos que formes parte de esta experiencia.</p>
                    <p><b>Detalles del evento:</b></p>
                    <ul>
                      <li><b>Nombre del evento:</b> ${evento.nombre}</li>
                      <li><b>Descripción:</b> ${evento.descripcion}</li>
                      <li><b>Fecha:</b> ${evento.fecha}</li>
                      <li><b>Hora:</b> ${evento.hora}</li>
                      <li><b>Lugar:</b> ${evento.lugar}</li>
                    </ul>
                    <p>Para más información, consulta al organizador del evento o al coordinador de tu Edificio. ¡Esperamos verte allí!</p>
                  </div>
                  <div class="footer">
                    <p>El código QR recibido es único e intransferible.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
      attachments: [{
       filename: 'invitacion-qr.png',
       path: qrFilePath,
       cid: 'unique@qrcode' // ID para incrustar en el HTML
      }]
     })
     console.log(`Correo enviado a ${estudiante.nombre}`)

     // Eliminar el archivo QR temporal después de enviar el correo
     fs.unlink(qrFilePath, (err) => {
      if (err) console.error('Error eliminando QR temporal:', err)
     })

    } catch (error) {
     console.error(`Error procesando invitación para ${estudiante.nombre}:`, error);
    }

   }
  }

  res.status(201).json(result);
 } catch (error) {
  console.error("Error al enviar correos:", error);
  res.status(500).json({
   error: error.message
  });
 }
};



// Crear invitaciones para un solo estudiante
export const enviarCorreoDePrueba = async (req, res) => {
 try {
  const {
   id_estudiante
  } = req.body; // Un solo id de estudiante
  const estudiante = await Estudiante.findById(id_estudiante);

  if (!estudiante || !estudiante.correo) {
   return res.status(404).json({
    mensaje: "Estudiante no encontrado o sin correo."
   });
  }

  // Enviar correo
  await transporter.sendMail({
   from: `"Control de Acceso" <${process.env.MAIL_USER}>`,
   to: estudiante.correo,
   subject: "¡Tienes una invitación a un evento escolar!",
   text: `Hola ${estudiante.nombre},\n\nHas sido invitado a un evento escolar. Consulta la plataforma para más detalles.`,
   html: `<b>Hola ${estudiante.nombre}</b>,<br><br>Has sido invitado a un evento escolar.<br>Consulta la plataforma para más detalles.`
  })

  res.status(200).json({
   mensaje: "Correo enviado exitosamente a un estudiante."
  })
 } catch (error) {
  console.error("Error al enviar correo:", error);
  res.status(500).json({
   mensaje: "Error al enviar correo"
  })
 }
}