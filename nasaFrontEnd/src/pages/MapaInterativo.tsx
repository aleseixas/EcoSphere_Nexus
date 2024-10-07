import './../App.css'; 
import 'leaflet/dist/leaflet.css';
import { Map } from 'leaflet';
import Sidebar from './../components/SideBar';
import MapComponent from './../components/MapComponent';

function App() {
  return (
    <div className="App">
      <MapComponent/>
    </div>
  );
}

export default App;