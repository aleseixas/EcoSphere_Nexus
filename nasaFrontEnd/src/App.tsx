import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Informations from './pages/Info'; // Import your components for pages
import WorldSimulation from './pages/MapaInterativo';
import './App.css';
import 'leaflet/dist/leaflet.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/informations" element={<Informations />} />
        <Route path="/" element={<WorldSimulation />} />
        <Route path="/world-simulation" element={<WorldSimulation />} />
      </Routes>
    </Router>
  );
};

export default App;
