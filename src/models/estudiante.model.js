import mongoose from 'mongoose';

const estudianteSchema = new mongoose.Schema({
  nombre:      { type: String, required: true },
  correo:      { type: String, required: true, unique: true },
  matricula:   { type: String, required: true, unique: true },
  carrera:     { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('estudiante', estudianteSchema);
