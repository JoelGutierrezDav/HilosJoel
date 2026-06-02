import { useState } from 'react'
import { Icon, ThreadSpool } from '../components/Icons'
import { getUsers, saveUsers } from '../db/storage'

export default function AuthPage({ onLogin }) {
  const [tab,   setTab]   = useState('login')
  const [form,  setForm]  = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [busy,  setBusy]  = useState(false)

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.username.trim() || !form.password)
      return setError('Completá todos los campos.')

    setBusy(true)
    try {
      const users = await getUsers()

      if (tab === 'register') {
        if (form.password.length < 6)
          return setError('La contraseña debe tener al menos 6 caracteres.')
        if (users.find((u) => u.username.toLowerCase() === form.username.toLowerCase()))
          return setError('Ese nombre de usuario ya existe.')
        const newUser = {
          id:       Date.now().toString(),
          username: form.username.trim(),
          password: form.password,
        }
        await saveUsers([...users, newUser])
        onLogin(newUser)
      } else {
        const user = users.find(
          (u) => u.username.toLowerCase() === form.username.toLowerCase() && u.password === form.password
        )
        if (!user) return setError('Usuario o contraseña incorrectos.')
        onLogin(user)
      }
    } catch {
      setError('Error de conexión. Revisá tu internet.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-bg" />
      <div className="auth-grid" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><ThreadSpool size={22} /></div>
          <div className="auth-logo-name">
            <div className="auth-logo-top">Hilos <span>Joel</span></div>
            <div className="auth-logo-sub">Gestión de inventario</div>
          </div>
        </div>

        <div className="auth-title">{tab === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta'}</div>
        <div className="auth-sub">{tab === 'login' ? 'Iniciá sesión para gestionar el inventario' : 'Registrate para empezar'}</div>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError('') }}>
            Iniciar sesión
          </button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError('') }}>
            Registrarse
          </button>
        </div>

        {error && <div className="error-msg"><Icon name="warning" size={16} /> {error}</div>}

        <div className="field">
          <label>Nombre de usuario</label>
          <div className="field-inner">
            <span className="field-icon"><Icon name="user" size={16} /></span>
            <input name="username" placeholder="Ej: joel, maria123..." value={form.username} onChange={handle} autoComplete="username" />
          </div>
        </div>
        <div className="field">
          <label>Contraseña</label>
          <div className="field-inner">
            <span className="field-icon"><Icon name="lock" size={16} /></span>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} onKeyDown={(e) => e.key === 'Enter' && submit()} autoComplete="current-password" />
          </div>
        </div>

        <button className="btn-primary" onClick={submit} disabled={busy}>
          {busy ? 'Conectando...' : tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </button>
      </div>
    </div>
  )
}