import './App.css';
import MapComponent from './components/MapComponent';
import Sidebar from './components/SideBar'; // Importa o Sidebar
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <div className="App">
      {/* Adiciona o Sidebar ao lado do Mapa */}
      {/* <Sidebar /> */}
      <MapComponent />
    </div>
  );
}

export default App;
