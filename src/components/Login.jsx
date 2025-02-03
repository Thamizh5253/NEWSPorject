import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const users = { thamz: "password" };

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (users[username] && users[username] === password) {
      setAuth(true);
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, textAlign: 'center', width: '100%' }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField fullWidth label="Username" variant="outlined" onChange={(e) => setUsername(e.target.value)} />
          <TextField fullWidth label="Password" type="password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
          {error && <Typography color="error">{error}</Typography>}
          <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>Login</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
