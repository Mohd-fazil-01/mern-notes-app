import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    // fatch the user data
    const verifyUser = async () => {
      try {
         const res = await api.get('/auth/getuserdata'); 
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log("No active session found");
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };
    verifyUser();
  }, []);

  const loginContext = (userData) => {
    setUser(userData);
    navigate('/'); 
  };

  return (
<AuthContext.Provider value={{ user, setUser, loginContext, loading }}>
      {!loading ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;