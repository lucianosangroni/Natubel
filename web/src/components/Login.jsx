import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        login("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzAwMTcxMTU2LCJleHAiOjE3MDAyMDcxNTZ9.n7uYo1HXo10M4tyoyv11sVJRcFxMz9LBGXW15Yvlkbg")
        navigate('/admin/cargar-pedido');
        //try {
        //  fetch('http://localhost:3001/api/auth', {
        //    method: 'POST',
        //    headers: {
        //      'Content-Type': 'application/json',
        //    },
        //    body: JSON.stringify({ nombre_usuario: username, password }),
        //  })
        //  .then((response) => response.json())
        //  .then((result) => {
        //    console.log(result)
        //    if (response.ok) {
        //      const { token } = result.jwt;
        //      login(token);
        //    } else {
        //      console.error('Error de autenticación');
        //    }
        //  })
        //} catch (error) {
        //  console.error('Error de red', error);
        //}
    };

    return (
        <div>
          <h2>Iniciar Sesion</h2>
          <label>
            Usuario:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <br />
          <label>
            Contraseña:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <br />
          <button onClick={handleLogin}>Iniciar Sesión</button>
        </div>
    );
}

export default Login;