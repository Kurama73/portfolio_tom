import React from 'react';
import { AdminService } from '../../domain/services/admin.service';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'projects', label: 'Projets' },
    { id: 'experiences', label: 'Expériences Pro' },
    { id: 'formations', label: 'Formations' },
    { id: 'skills', label: 'Skills Teknik' },
    { id: 'competences', label: 'Compétences IUT' },
    { id: 'passions', label: 'Passions' },
  ];

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          TERMINAL <span className="dot">ADMIN</span>
        </div>

        <nav className="admin-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button className="admin-logout" onClick={() => AdminService.logout()}>
          Déconnexion
        </button>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
