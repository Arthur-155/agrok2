import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Estatistica from "./Estatistica";
import Home from "./Home";
import Mockup from './Mockup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Estatistica" element={<Estatistica />} />
        <Route path="/Mockup" element={<Mockup />} />
      </Routes>
    </Router>
  );
}

export default App;
