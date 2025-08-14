// src/utils/transporter.js
import nodemailer from 'nodemailer';
import 'dotenv/config'; // Carga las variables de entorno

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  // Opciones adicionales para debug en desarrollo:
  logger: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
});

export default transporter;