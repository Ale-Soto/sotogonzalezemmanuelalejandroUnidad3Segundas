import { useForm } from "react-hook-form"
import { useAuth } from "../context/AuthContext"
import { useState } from 'react'

function PaginaRegistro() {

 const { register, handleSubmit, reset, formState: { errors }, clearErrors, setError } = useForm()
 const { signup, errors: RegisterErrors = [] } = useAuth()
 const [successMessage, setSuccessMessage] = useState("")
 const [selectedRole, setSelectedRole] = useState(null)
 const [isOptionsVisible, setIsOptionsVisible] = useState(false)

 const toggleOptions = () => {
  setIsOptionsVisible(!isOptionsVisible);
 };

 const selectRole = (role) => {
  setSelectedRole(Number(role)) // Asigna el texto correspondiente
  setIsOptionsVisible(false) // Cierra las opciones al seleccionar
  clearErrors("rol") // Limpia errores al seleccionar
 }

 const onSubmit = handleSubmit(async (values) => {
  setSuccessMessage("")
  clearErrors(); // Limpiar errores de cualquier campo

  if (!selectedRole) {
   setError("rol", { message: "Selecciona un rol" })
   return
  }

  values.rol = selectedRole
  const { success, message } = await signup(values)

  if (success) {
   setSuccessMessage(message || "¡Usuario registrado correctamente!");
   reset()
   // Resetear el rol a "Selecciona un rol"
   setSelectedRole(null)
  }
 })

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
   <div className="w-full max-w-md bg-white/10 backdrop-blur shadow-2xl rounded-2xl p-8 border border-zinc-700">
    <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">Registro de usuario</h2>
    {successMessage && (
     <div className="bg-green-500 text-white px-4 py-2 rounded-lg mb-2 text-center">
      {successMessage}
     </div>
    )}
    {RegisterErrors.length > 0 && RegisterErrors.map((error, i) => (
     <div key={i} className="bg-red-500 text-white px-4 py-2 rounded-lg mb-2 text-center">
      {typeof error === 'string' ? error : JSON.stringify(error)}
     </div>
    ))}
    <form onSubmit={onSubmit} className="space-y-5">
     <input
      type="text"
      {...register("name", { required: "Nombre completo requerido" })}
      className="w-full py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
      placeholder="Nombre Completo"
      autoFocus
     />
     {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
     <input
      type="text"
      {...register("username", { required: "Nombre de usuario requerido" })}
      className="w-full py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
      placeholder="Nombre de usuario"
      autoFocus
     />
     {errors.username && <p className="text-red-400 text-sm">{errors.username.message}</p>}
     <div className="relative w-full">
      <label className="block text-white mb-2" htmlFor="rol">Rol</label>
      <input
       type="text"
       id="rol"
       value={selectedRole === null ? "Elige un rol" : selectedRole === 1 ? "Admin" : "Monitor"} // Muestra el rol seleccionado o la leyenda
       onClick={toggleOptions} // Función para abrir las opciones
       readOnly
       className="w-full py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
      />
      {isOptionsVisible && (
       <div className="absolute left-0 w-full mt-1 bg-zinc-800 border border-zinc-600 rounded-lg shadow-lg">
        <div
         className="px-4 py-2 text-white hover:bg-green-500 cursor-pointer"
         onClick={() => selectRole(1)}
        >
         Admin
        </div>
        <div
         className="px-4 py-2 text-white hover:bg-green-500 cursor-pointer"
         onClick={() => selectRole(2)}
        >
         Monitor
        </div>
       </div>
      )}
     </div>
     {errors.rol && <p className="text-red-400 text-sm">{errors.rol.message}</p>}
     <input
      type="email"
      {...register("email", { required: "Correo electrónico requerido" })}
      className="w-full py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
      placeholder="Correo Electrónico"
     />
     {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
     <input
      type="password"
      {...register("password", { required: "Contraseña requerida" })}
      className="w-full py-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
      placeholder="Contraseña"
     />
     {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
     {errors.root && <p className="text-red-500">{errors.root.message}</p>}
     <button
      type="submit"
      className="w-full py-2 mt-4 bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition transform hover:scale-105 active:scale-95"
     >
      Registrar
     </button>
    </form>
   </div>
  </div>
 );
}

export default PaginaRegistro