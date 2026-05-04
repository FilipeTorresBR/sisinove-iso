import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { modules } from '../config/resources';

export default function AppLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('sisq_user') || '{}');

  const logout = () => {
    localStorage.removeItem('sisq_token');
    localStorage.removeItem('sisq_user');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-box">
            <div className="brand-mark">S+</div>
            <div>
              <strong>SISQ+</strong>
              <p>Gestão da Qualidade Sisinove</p>
            </div>
          </div>

          <nav className="nav-menu">
            <NavLink to="/" end>Dashboard</NavLink>
            {Object.entries(modules).map(([path, item]) => (
              <NavLink key={path} to={`/modulo/${path}`}>{item.label}</NavLink>
            ))}
          </nav>
        </div>

        <div className="profile-box">
          <strong>{user.name || 'Usuário'}</strong>
          <span>{user.role || 'perfil'}</span>
          <button onClick={logout}>Sair</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
