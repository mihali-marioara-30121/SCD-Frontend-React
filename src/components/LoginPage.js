// components/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import extractRoleFromToken from '../services/JwtDecoder';
import { useNavigate  } from 'react-router-dom'; // Import useHistory

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate (); // Initialize history

  const handleLogin = async () => {
    try {
      const requestBody = {
        "username": username,
        "password": password
      }
       const result = await axios.post("http://localhost:8080/api/v1/users/login", requestBody);
       const jwt = result?.data?.token;
       localStorage.setItem("jwt", jwt);


      const token = result?.data?.token;
      const role = extractRoleFromToken(token);

      localStorage.setItem("jwt", jwt);
 
      if (role === "DIRECTOR") {
        // Redirect catre pagina de vizualizare a angajatilor
        console.log('ROLE IS DIRECTOR ---- OK');
        navigate('/employeeManagement');

      } else {
        // afisare mesaj eroare
      }
      

      // Now you can use the 'role' in your application logic
      console.log('User Role:', role);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };



  return (
    <div>
      <h1>Login</h1>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
