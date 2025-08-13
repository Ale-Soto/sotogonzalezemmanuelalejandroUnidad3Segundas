import mongoose from 'mongoose';

const eventoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  lugar: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Evento', eventoSchema);
