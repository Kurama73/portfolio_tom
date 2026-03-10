import React, { useState, useEffect } from 'react';
import Home from './presentation/pages/Home';
import Contact from './presentation/pages/Contact';
import AdminDashboard from './presentation/pages/AdminDashboard';
import Navbar from './presentation/components/Navbar';

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // Si l'URL contient #override, on ouvre la porte dérobée
    const checkHash = () => setIsAdminMode(window.location.hash === '#override');
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  if (isAdminMode) {
    return <AdminDashboard />;
  }

  return (
    <>
      <Navbar />
      <Home />
      {/* C'est ici qu'il manquait le composant Contact ! */}
      <Contact />
    </>
  );
}

export default App;