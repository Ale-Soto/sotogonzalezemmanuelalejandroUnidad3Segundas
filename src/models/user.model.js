import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Asegúrate de que el nombre completo sea obligatorio
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Aseguramos que el correo sea único
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  rol: {
    type: Number,
    required: true, // El rol es obligatorio y lo proveemos desde el frontend
  },
  estado: {
    type: Number,
    default: 1, // El estado es siempre 1 de forma predeterminada
  }
}, {
  timestamps: true,
});

export default mongoose.model('Usuarios', userSchema);