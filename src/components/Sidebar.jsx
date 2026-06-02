import { Icon, ThreadSpool } from './Icons'

export default function Sidebar({ user, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><ThreadSpool size={20} /></div>
        <div className="sidebar-logo-name">
          <div className="sidebar-logo-top">Hilos <span>Joel</span></div>
          <div className="sidebar-logo-bottom">Inventario</div>
        </div>
      </div>

      <div className="nav-section">Menú</div>
      <button className="nav-item active">
        <Icon name="spool" size={17} /> Inventario
      </button>

      <div className="sidebar-user">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="sidebar-user-name">{user?.username}</div>
            <div className="sidebar-user-role">Empleado</div>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          <Icon name="logout" size={15} /> Cerrar sesión
        </button>
      </div>
    </div>
  )
}