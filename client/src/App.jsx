import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom" // ojo: router-dom, no solo router
import { AuthProvider } from "./components/AuthProvider"
import Navbar from "./components/Navbar"
import PaginaRegistro from "./pages/PaginaRegistro"
import PaginaLogin from "./pages/PaginaLogin"
import PaginaEscanearQR from "./pages/PaginaEscanearQR"
import PaginaCrearEvento from "./pages/PaginaCrearEvento"
import PaginaListaEventos from "./pages/PaginaListaEventos"
import PaginaCatalogoEstudiantes from './pages/PaginaCatalogoEstudiantes'
import PaginaGestionEvento from "./pages/PaginaGestionEvento"
import PaginaAgregarEstudiante from "./pages/PaginaAgregarEstudiante"
import ProtectedRoute from "./components/ProtectedRoute"
import RoleProtectedRoute from "./components/RoleProtectedRoute"
import PaginaNoAutorizado from "./pages/PaginaNoAutorizado"

function AppContent() {
 const location = useLocation();
 // Rutas donde NO quieres navbar
 const hideNavbarRoutes = ["/"];
 const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

 return (
  <>
   {shouldShowNavbar && <Navbar />}
   <Routes>
    <Route path="/" element={<PaginaLogin />} />
    <Route path="/no-autorizado" element={<PaginaNoAutorizado />} />

    <Route element={<ProtectedRoute />}>
     <Route
      path="/escanear"
      element={
       <RoleProtectedRoute allowedRoles={[2]} >
        <PaginaEscanearQR />
       </RoleProtectedRoute>
      }
     />

     <Route path="/registro" element={
      <RoleProtectedRoute allowedRoles={[1]} >
       <PaginaRegistro />
      </RoleProtectedRoute>} />
     <Route path="/eventos" element={
      <RoleProtectedRoute allowedRoles={[1]} >
       <PaginaListaEventos />
      </RoleProtectedRoute>} />
     <Route path="/crear-evento" element={
      <RoleProtectedRoute allowedRoles={[1]} >
       <PaginaCrearEvento />
      </RoleProtectedRoute>
     } />
     <Route path="/estudiantes" element={
      <RoleProtectedRoute allowedRoles={[1]} >
       <PaginaCatalogoEstudiantes />
      </RoleProtectedRoute>
     } />
     <Route path="/eventos/:id" element={
      <RoleProtectedRoute allowedRoles={[1]} >
       <PaginaGestionEvento />
      </RoleProtectedRoute>
     } />
     <Route path="/agregar-estudiante" element={
      <RoleProtectedRoute allowedRoles={[1]} >
       <PaginaAgregarEstudiante />
      </RoleProtectedRoute>
     } />
    </Route>
  </Routes >
  </>
 );
}

export default function App() {
 return (
  <BrowserRouter>
   <AuthProvider>
    <AppContent />
   </AuthProvider>
  </BrowserRouter>
 );
}
