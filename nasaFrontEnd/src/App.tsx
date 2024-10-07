import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import your Navbar component
import Informations from './pages/Info'; // Import your components for pages
import WorldSimulation from './pages/MapaInterativo';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/informations" element={<Informations />} />
        <Route path="/world-simulation" element={<WorldSimulation />} />
      </Routes>
    </Router>
  );
};

export default App;
