import { createContext, useContext, useState, useEffect, useCallback  } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode  } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedAuth = localStorage.getItem('isAuthenticated');
  const [isAuthenticated, setAuthenticated] = useState(storedAuth === 'true');
  const navigate = useNavigate();

  const login = useCallback((token) => {
    localStorage.setItem('jwt', token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', jwtDecode(token).username)
    setAuthenticated(true);
  }, [setAuthenticated]);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    setAuthenticated(false);
    navigate('/admin/login');
  }, [navigate, setAuthenticated]);

  const decode = (token) => {
    const tokenParts = token.split('.');

    if(tokenParts.length !== 3) {
        return false
    }

    return JSON.parse(atob(tokenParts[1]))
  }

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (token) {
      const decodedToken = decode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken){
        if(decodedToken.exp < currentTime) {
            logout();
        } else {
            login(token)
        } 
      } else {
          logout()
      }
    } else {
        logout();
    }
  }, [login, logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};