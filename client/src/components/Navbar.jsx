import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
 const { signout } = useAuth()
 return (
  <nav className="bg-zinc-900 px-6 py-3 flex items-center justify-between shadow-lg">
   <div>
    <Link to="/" className="text-xl font-bold text-white hover:text-blue-400 transition">Lista QR</Link>
   </div>
   <div className="flex gap-4">
    <Link to="/eventos" className="text-white hover:text-blue-400 transition">Eventos</Link>
    <Link to="/crear-evento" className="text-white hover:text-blue-400 transition">Crear Evento</Link>
    <Link to="/estudiantes" className="text-white hover:text-blue-400 transition">Estudiantes</Link>
    <Link to="/registro" className="text-white hover:text-blue-400 transition">Registrar</Link>
    <Link to="/" onClick={async (e) => { e.preventDefault(); await signout(); }} className="text-white hover:text-blue-400 transition">Salir</Link>
   </div>
  </nav>
 );
}

export default Navbar;
