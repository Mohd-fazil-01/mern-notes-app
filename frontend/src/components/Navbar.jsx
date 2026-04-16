import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutContext } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My Notes App</h1>
        
        <div className="flex items-center gap-4">
          <span className="font-medium hidden sm:block">Hello, {user?.name}</span>
          <button 
            onClick={logoutContext}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;