import Estudiante from "../models/estudiante.model.js";
import Invitado from "../models/invitado.model.js";

// Obtener todos los estudiantes
// estudiante.controller.js
export const getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.find();
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Crear estudiante (por si quieres desde backend)
export const createEstudiante = async (req, res) => {
  try {
    const nuevo = new Estudiante(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEstudiantesNoInvitados = async (req, res) => {
  try {
    const { id_evento } = req.params;

    // 1. Encuentra los IDs de estudiantes ya invitados a este evento
    const invitados = await Invitado.find({ id_evento });
    const idsInvitados = invitados.map(i => i.id_estudiante.toString());

    // 2. Trae todos los estudiantes que NO están en esa lista
    const estudiantesNoInvitados = await Estudiante.find({
      _id: { $nin: idsInvitados }
    });

    res.json(estudiantesNoInvitados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};