import Invitado from "../models/invitado.model.js";

export const marcarAsistencia = async (req, res) => {
  try {
    const { id_invitado } = req.body;
    console.log("ID recibido:", id_invitado);

    const invitado = await Invitado.findById(id_invitado);
    console.log("Invitado encontrado:", invitado);

    if (!invitado) {
      return res.status(404).json({ mensaje: "Invitación no encontrada o código incorrecto." });
    }

    if (invitado.asistencia) {
      return res.status(400).json({ mensaje: "Este código ya fue escaneado anteriormente." });
    }

    invitado.asistencia = true;
    invitado.hora_llegada = new Date();
    await invitado.save();

    res.json({ mensaje: "¡Asistencia registrada exitosamente!" });
  } catch (error) {
    console.error("Error al marcar asistencia:", error); // <--- esto te dará el error real
    res.status(500).json({ mensaje: "Error al registrar asistencia." });
  }
};

