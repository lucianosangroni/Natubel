import React, { useState } from "react";
//import { useAuth } from './AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //const { login } = useAuth();

    const handleLogin = async () => {
        console.log(username)
        console.log(password)
        //try {
        //  // Hacer la solicitud de autenticación al servidor
        //  const response = await fetch('/api/auth', {
        //    method: 'POST',
        //    headers: {
        //      'Content-Type': 'application/json',
        //    },
        //    body: JSON.stringify({ username, password }),
        //  });
    //
        //  if (response.ok) {
        //    const { token } = await response.json();
        //    // Llamar a la función login para establecer la autenticación
        //    login(token);
        //  } else {
        //    // Manejar errores de autenticación
        //    console.error('Error de autenticación');
        //  }
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