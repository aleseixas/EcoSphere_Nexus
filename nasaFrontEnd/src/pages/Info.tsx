import './../App.css';
import './Info.css';
import tundraImage from './../assets/tundra.jpeg';
import savannahImage from './../assets/savana.jpeg';
import tropicalForestImage from './../assets/floresta_tropical.jpeg';
import temperateForestImage from './../assets/floresta_temperada.jpeg';
import desertImage from './../assets/deserto.jpeg';
import mangroveImage from './../assets/manguezal.jpeg';
import prairieImage from './../assets/pradaria.jpeg';
import oceanImage from './../assets/oceano.jpeg';
import coralImage from './../assets/coral.jpeg';
import 'leaflet/dist/leaflet.css';
import EcosystemProfile from '../components/EcosystemProfile';
import Navbar from '../components/Navbar';


const ecosystems = [
    {
        name: 'Tundras',
        image: tundraImage,
        description: 'Tundras are cold, dry regions with frozen soil and limited vegetation. They help regulate the global climate and store large amounts of carbon in the soil. They affect temperate forests and oceans due to their impact on the global climate.',
    },
    {
        name: 'Savannas',
        image: savannahImage,
        description: 'Savannahs are open areas with grasses and few trees, located in warm regions. They are habitats for large mammals and influence prairies and deserts, especially with changes in the rainfall regime.',
    },
    {
        name: 'Temperate Forests',
        image: temperateForestImage,
        description: 'Temperate forests have four distinct seasons and trees that lose their leaves in the fall. They produce oxygen and store carbon, affecting tundras and prairies by regulating temperature and climate.',
    },
    {
        name: 'Tropical Forests',
        image: tropicalForestImage,
        description: 'Tropical forests are warm and humid ecosystems that host a vast biodiversity. They are essential for oxygen production and carbon absorption. They influence mangroves and oceans by providing nutrients to these ecosystems.',
    },
    {
        name: 'Deserts',
        image: desertImage,
        description: 'Deserts are dry areas with little precipitation and vegetation adapted to aridity. They regulate Earth’s temperatures and can influence savannahs and prairies with the advance of desertification.',
    },
    {
        name: 'Prairies',
        image: prairieImage,
        description: 'Prairies are flat areas covered with grasses, experiencing cold winters and hot summers. They are important for agriculture and affect temperate forests and savannahs, especially with climate changes.',
    },
    {
        name: 'Mangroves',
        image: mangroveImage,
        description: 'Mangroves are coastal forests that grow in salt or brackish water. They protect coastlines from erosion and are nurseries for many marine species. They influence coral reefs and oceans with their nutrients.',
    }
];

function Info() {
  return (
    <div className="Info">
        <Navbar />
        {ecosystems.map((item) => (
          <EcosystemProfile 
            className={`ecosystem-profile ${item.name.replace(/\s+/g, '')}`} 
            name={item.name}
            image={item.image}
            description={item.description}
          />
        ))}
    </div>
  );
}

export default Info;
