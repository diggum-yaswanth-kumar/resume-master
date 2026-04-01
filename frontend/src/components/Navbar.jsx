import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" onClick={closeMenu} className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">Resume Master</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-2 pt-2 pb-4 space-y-1 shadow-lg absolute w-full">
          {token ? (
            <>
              <Link to="/dashboard" onClick={closeMenu} className="block text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Dashboard</Link>
              <Link to="/analyze" onClick={closeMenu} className="block text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Analyze Resume</Link>
              <button onClick={handleLogout} className="block w-full text-left text-red-500 hover:bg-red-50 px-3 py-2 rounded-md font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="block text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Login</Link>
              <Link to="/register" onClick={closeMenu} className="block text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md font-bold">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
