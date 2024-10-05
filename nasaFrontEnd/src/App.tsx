import './App.css'
// import Home from './pages/Home'
// import Map from './pages/Map'
import MapComponent from './components/MapComponent';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <div className="App">
      <MapComponent />
    </div>
  );
}

export default App
