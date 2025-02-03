import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    console.log("User registered:", { username, password });
    navigate("/");
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4">Sign Up</Typography>
      <TextField fullWidth label="Username" onChange={(e) => setUsername(e.target.value)} />
      <TextField fullWidth label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <Button fullWidth variant="contained" onClick={handleSignup}>Sign Up</Button>
    </Container>
  );
};

export default Signup;