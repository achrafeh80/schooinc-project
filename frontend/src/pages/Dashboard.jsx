import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { auth } = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');



  const quickLinks = auth.role === 'student' 
    ? [
        { name: 'Mes Notes', path: '/grades', color: 'bg-blue-500' },
        { name: 'Mes Cours', path: '/courses', color: 'bg-green-500' }
      ]
    : [
        { name: 'Gestion des Notes', path: '/grade-manager', color: 'bg-purple-500' },
        { name: 'Classes', path: '/classes', color: 'bg-indigo-500' },
        { name: 'Statistiques', path: '/stats', color: 'bg-blue-500' }
      ];
  

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting('Bonjour');
    } else if (hour < 18) {
      setGreeting('Bon après-midi');
    } else {
      setGreeting('Bonsoir');
    }
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white p-8 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{greeting}, {auth.pseudo} 👋</h1>
            <p className="text-blue-100">
              Vous êtes connecté en tant que <span className="font-semibold">{auth.role === 'student' ? 'Étudiant' : 'Professeur'}</span>
            </p>
            <p className="text-blue-100 text-sm mt-1">
              {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Accès rapide</h2>
            
            <div className="grid grid-cols-1 gap-3">
              {quickLinks.map((link, index) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`${link.color} text-white p-4 rounded-lg flex items-center justify-between hover:opacity-90 transition-opacity`}
                >
                  <span className="font-medium">{link.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}