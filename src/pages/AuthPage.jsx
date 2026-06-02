import { useState } from 'react'
import { Icon, ThreadSpool } from '../components/Icons'
import { getUsers, saveUsers } from '../db/storage'

export default function AuthPage({ onLogin }) {
  const [form,      setForm]      = useState({ username: '', password: '' })
  const [error,     setError]     = useState('')
  const [busy,      setBusy]      = useState(false)
  const [showPass,  setShowPass]  = useState(false)

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.username.trim() || !form.password)
      return setError('Completá todos los campos.')

    setBusy(true)
    try {
      const users = await getUsers()
      const user  = users.find(
        (u) => u.username.toLowerCase() === form.username.toLowerCase() && u.password === form.password
      )
      if (!user) return setError('Usuario o contraseña incorrectos.')
      onLogin(user)
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

        <div className="auth-title">Bienvenido de vuelta</div>
        <div className="auth-sub">Iniciá sesión para gestionar el inventario</div>

        {error && <div className="error-msg"><Icon name="warning" size={16} /> {error}</div>}

        <div className="field">
          <label>Nombre de usuario</label>
          <div className="field-inner">
            <span className="field-icon"><Icon name="user" size={16} /></span>
            <input
              name="username"
              placeholder="Ej: joel..."
              value={form.username}
              onChange={handle}
              autoComplete="username"
            />
          </div>
        </div>

        <div className="field">
          <label>Contraseña</label>
          <div className="field-inner">
            <span className="field-icon"><Icon name="lock" size={16} /></span>
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={handle}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              autoComplete="current-password"
              style={{ paddingRight: 44 }}
            />
            <button
              onClick={() => setShowPass((v) => !v)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: showPass ? 'var(--accent)' : 'var(--muted)', padding: 0,
                display: 'flex', alignItems: 'center',
              }}
            >
              {showPass ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button className="btn-primary" onClick={submit} disabled={busy}>
          {busy ? 'Conectando...' : 'Iniciar sesión'}
        </button>
      </div>
    </div>
  )
}