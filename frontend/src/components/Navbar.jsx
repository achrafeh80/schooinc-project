import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

export default function Navbar() {
  const { auth, setAuth } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">
        <Link to="/">SchooInc</Link>
      </h1>
      
      <div className="flex items-center">
        {auth ? (
          <>
            <Link to="/" className="mr-4">Dashboard</Link>
            <Link to="/profil" className="mr-4">Mon Profil</Link>
            {auth?.role !== 'professor' && (
              <Link to="/grades" className="mr-4">Mes Notes</Link>
            )}
            {auth?.role === 'professor' && (
              <>
                <Link to="/courses" className="mr-4">Cours</Link>
                <Link to="/classes" className="mr-4">Classes</Link>
                <Link to="/grade-manager" className="mr-4">Notes</Link>
                <Link to="/stats" className="mr-4">Stats</Link>
              </>
            )}
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded ml-4">Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register" className="mr-4">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
