import React, { useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
          fetch('http://localhost:3001/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre_usuario: username, password }),
          })
          .then((response) => response.json())
          .then((result) => {
            if(result.jwt) {
              login(result.jwt);
              navigate('/admin/cargar-pedido');
            }
          })
        } catch (error) {
          console.error('Error de red', error);
        }
    };

    return isAuthenticated ? <Navigate to="/admin/cargar-pedido" /> : (
        <div className="contenedor-login">
          <h2 className="iniciar-sesion-titulo">Iniciar Sesion</h2>
          <label className="usuario"> 
            Usuario:
            <input className="usuario-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <br />
          <label className="password">
            Contraseña:
            <input className="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <br />
          <button className="iniciar-sesion-boton" onClick={handleLogin}>Aceptar</button>
        </div>
    );
}

export default Login;