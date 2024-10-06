import './App.css';
import './components/EcosystemProfile'
// import MapComponent from './components/MapComponent';
// import Sidebar from './components/SideBar'; // Importa o Sidebar
import 'leaflet/dist/leaflet.css';
import EcosystemProfile from './components/EcosystemProfile';
import Info from './pages/Info';

// function App() {
//   return (
//     <div className="App">
//       {/* Adiciona o Sidebar ao lado do Mapa */}
//       <Sidebar />
//       <MapComponent />
//     </div>
//   );
// }

// export default App;

function App() {
  return (
    <div className="App">
      {/* Adiciona o Sidebar ao lado do Mapa */}
      <Info />
    </div>
  );
}

export default App;