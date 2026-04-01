import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">Resume Master</span>
          </Link>
          
          <div className="flex space-x-4">
            {token ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">Dashboard</Link>
                <Link to="/analyze" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">Analyze Resume</Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-600 px-3 py-2 rounded-md font-medium transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
