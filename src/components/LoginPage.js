import React, { useState } from 'react';
import axios from 'axios';
import extractRoleFromToken from '../services/JwtDecoder';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, CssBaseline, Typography } from '@mui/material';
import { styled } from '@mui/system';

const useStyles = styled((theme) => ({
  paper: {
    marginTop: theme.spacing(80),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Add this line
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const requestBody = {
        username: username,
        password: password,
      };
      const result = await axios.post("http://localhost:8080/api/v1/users/login", requestBody);
      const jwt = result?.data?.token;
      localStorage.setItem("jwt", jwt);

      const token = result?.data?.token;
      const role = extractRoleFromToken(token);

      localStorage.setItem("jwt", jwt);

      if (role === "DIRECTOR") {
        // Redirect to the employee management page
        console.log('ROLE IS DIRECTOR ---- OK');
        navigate('/employeeManagement');
      } else {
        // Display error message
      }

      console.log('User Role:', role);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
<Container component="main" maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleLogin}
          >
            Login
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default LoginPage;
