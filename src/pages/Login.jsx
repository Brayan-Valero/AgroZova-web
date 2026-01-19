import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signIn } from '../services/auth'

const Login = () => {
    const navigate = useNavigate()
    const { demoMode, demoSignIn } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Use demo auth if in demo mode
        if (demoMode) {
            const result = demoSignIn(email, password)
            if (result.error) {
                setError(result.error.message)
                setLoading(false)
                return
            }
            navigate('/')
            return
        }

        // Real Supabase auth
        const { data, error: signInError } = await signIn(email, password)

        if (signInError) {
            setError('Credenciales incorrectas. Por favor, intenta de nuevo.')
            setLoading(false)
            return
        }

        if (data) {
            navigate('/')
        }
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
            <div className="relative flex h-screen w-full flex-col overflow-x-hidden">
                {/* Top App Bar / Brand Header */}
                <div className="flex items-center bg-white dark:bg-[#1a2e16] p-4 pb-2 justify-between border-b border-[#dde6db] dark:border-[#2a3f28]">
                    <div className="text-[#121811] dark:text-white flex size-12 shrink-0 items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">agriculture</span>
                    </div>
                    <h2 className="text-[#121811] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
                        Gosén AgroZova
                    </h2>
                </div>

                <div className="flex flex-col flex-1 items-center justify-center px-4 max-w-md mx-auto w-full">
                    {/* Logo / Visual Identity */}
                    <div className="w-full mb-6">
                        <div className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-white dark:bg-[#1a2e16] rounded-xl min-h-[160px] border border-[#dde6db] dark:border-[#2a3f28] shadow-sm"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url("/logo.jpg")'
                            }}>
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="w-full mb-2">
                        <h2 className="text-[#121811] dark:text-white tracking-light text-[28px] font-bold leading-tight text-center pb-1">
                            Bienvenido
                        </h2>
                        <p className="text-[#121811] dark:text-gray-300 text-base font-normal leading-normal text-center pb-6">
                            Gestión agropecuaria profesional
                        </p>
                        {demoMode && (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-4 py-3 rounded-lg text-sm text-center mb-4">
                                <p className="font-bold">🎭 MODO DEMO</p>
                                <p className="text-xs mt-1">
                                    Email: <span className="font-mono">demo@agrozova.com</span><br />
                                    Password: <span className="font-mono">demo123</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Login Form */}
                    <form className="w-full space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="flex flex-col w-full">
                            <label className="flex flex-col w-full">
                                <p className="text-[#121811] dark:text-white text-sm font-semibold leading-normal pb-2 ml-1">
                                    Correo electrónico
                                </p>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input flex w-full rounded-lg text-[#121811] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#dde6db] dark:border-[#2a3f28] bg-white dark:bg-[#1a2e16] h-14 placeholder:text-[#688961] p-[15px] pl-11 text-base font-normal leading-normal"
                                        placeholder={demoMode ? "demo@agrozova.com" : "usuario@gosena.com"}
                                        required
                                    />
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#688961]">
                                        mail
                                    </span>
                                </div>
                            </label>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col w-full">
                            <label className="flex flex-col w-full">
                                <div className="flex justify-between items-center pb-2 ml-1">
                                    <p className="text-[#121811] dark:text-white text-sm font-semibold leading-normal">
                                        Contraseña
                                    </p>
                                    {!demoMode && (
                                        <a className="text-xs font-bold text-[#2d6a4f] dark:text-primary" href="#">
                                            ¿Olvidó su contraseña?
                                        </a>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-input flex w-full rounded-lg text-[#121811] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#dde6db] dark:border-[#2a3f28] bg-white dark:bg-[#1a2e16] h-14 placeholder:text-[#688961] p-[15px] pl-11 text-base font-normal leading-normal"
                                        placeholder={demoMode ? "demo123" : "••••••••"}
                                        required
                                    />
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#688961]">
                                        lock
                                    </span>
                                </div>
                            </label>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-opacity-90 text-[#132210] font-bold text-lg py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Ingresando...' : 'Ingresar'}
                            </button>
                        </div>
                    </form>

                    {/* Footer / Create Account */}
                    <div className="mt-auto py-8 text-center">
                        <p className="text-sm text-[#688961] dark## text-gray-400">
                            {demoMode ? (
                                <span>Modo demostración - Para producción, <a href="https://supabase.com" target="_blank" rel="noopener" className="font-bold text-primary">configura Supabase</a></span>
                            ) : (
                                <>
                                    ¿No tiene una cuenta?{' '}
                                    <a className="font-bold text-[#121811] dark:text-primary" href="#">
                                        Contactar a soporte
                                    </a>
                                </>
                            )}
                        </p>
                        <div className="mt-4 flex items-center justify-center space-x-2 text-[#688961] opacity-50">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            <span className="text-[10px] uppercase tracking-widest font-bold">
                                Gosén AgroZova SAS © 2024
                            </span>
                        </div>
                    </div>
                </div>

                {/* Safe area padding for iOS */}
                <div className="h-8 bg-transparent"></div>
            </div>
        </div>
    )
}

export default Login
