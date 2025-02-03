import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import axios from "axios";
import Login from "./components/Login";
import Signup from "./components/Signup";
// import Summarizer from "./components/Summarize";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [auth, setAuth] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={auth ? <Navigate to="/dashboard" /> : <Login setAuth={setAuth} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
