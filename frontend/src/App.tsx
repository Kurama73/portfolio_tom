import { useState, useEffect } from 'react';
import Home from './presentation/pages/Home';
import Contact from './presentation/pages/Contact';
import AdminDashboard from './presentation/pages/AdminDashboard';
import Navbar from './presentation/components/Navbar';

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
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
      <Contact />
    </>
  );
}

export default App;