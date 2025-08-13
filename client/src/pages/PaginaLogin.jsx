import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function PaginaLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, errors: signinErrors } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

 const onSubmit = handleSubmit(data => {
  signin(data)
 })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="w-full max-w-md bg-white/10 backdrop-blur shadow-2xl rounded-2xl p-6 border border-zinc-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">Login</h2>
        {signinErrors.map((error, i) => (
          <div key={i} className="bg-red-500 text-white px-4 py-2 rounded-lg mb-2 text-center">
            {error}
          </div>
        ))}
        <form onSubmit={onSubmit}>
          <input
            type="text"
            {...register("username", { required: "Nombre de usuario requerido" })}
            className="w-full py-3 my-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition"
            placeholder="Nombre de Usuario"
            autoFocus
          />
          {errors.username && <p className="text-red-400 text-sm">{errors.username.message}</p>}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Contraseña requerida" })}
              className="w-full py-3 my-2 px-4 bg-transparent border border-zinc-600 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition pr-12"
              placeholder="Contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-zinc-400 hover:text-blue-400 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                // 👁️‍🗨️ (cerrado)
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.18-3.284m2.205-2.164A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.432 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.364 6.364L17.657 6.343" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
          {errors.root && <p className="text-red-500">{errors.root.message}</p>}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition transform hover:scale-105 active:scale-95"
          >
            Comenzar
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaginaLogin;
