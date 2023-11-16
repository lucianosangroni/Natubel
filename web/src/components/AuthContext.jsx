import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedAuth = localStorage.getItem('isAuthenticated');
  const [isAuthenticated, setAuthenticated] = useState(storedAuth === 'true');

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
  }, []);

  const decode = (token) => {
    const tokenParts = token.split('.');

    if(tokenParts.length !== 3) {
        return false
    }

    return JSON.parse(atob(tokenParts[1]))
  }

  const login = (token) => {
    localStorage.setItem('jwt', token);
    localStorage.setItem('isAuthenticated', 'true');
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('isAuthenticated');
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};