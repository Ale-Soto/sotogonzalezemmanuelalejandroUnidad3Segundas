import mongoose from 'mongoose';

const invitadoSchema = new mongoose.Schema({
  id_evento:      { type: mongoose.Schema.Types.ObjectId, ref: 'Evento', required: true },
  id_estudiante:  { type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante', required: true },
  asistencia:     { type: Boolean, default: false },
  hora_llegada:   { type: Date, default: null },
  id_monitor:     { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', default: null }
}, { timestamps: true });

export default mongoose.model('invitado', invitadoSchema);
