/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import countriesJson from './../geojson/all_countries.geo.json';
import countriesBiomes from './../geojson/countryBiomes_with_new_biomes.json';
import { LatLngExpression } from 'leaflet';
import { FaTree, FaWater, FaMountain, FaSun, FaCloudShowersHeavy, FaUmbrellaBeach, FaLeaf, FaSeedling } from 'react-icons/fa'; // Importando ícones

const biomeColors = {
  'Tundras': 'darkgreen',
  'Tropical Forests': 'teal',
  'Temperate Forests': 'lightgreen',
  'Savannas': 'orange',
  'Desert': 'yellow',
  'Prairies': 'Khaki'
};

const biomeIcons = {
  'Tundras': <FaSeedling />,
  'Tropical Forests': <FaCloudShowersHeavy />,
  'Temperate Forests': <FaTree />,
  'Manguezais': <FaUmbrellaBeach />,
  'Coral Reef': <FaWater />,
  'Oceans': <FaWater />,
  'Savannas': <FaSun />,
  'Desert': <FaMountain />,
  'Prairies': <FaLeaf />,
};

const MapComponent: React.FC = () => {
  const worldCenter: LatLngExpression = [0, 0];
  const [countries, setCountries] = useState<any[]>([]);
  const [countryBiomes, setCountryBiomes] = useState<any>({});

  useEffect(() => {
    const fetchBiomes = async () => {
      setCountryBiomes(countriesBiomes);
    };

    fetchBiomes();
  }, []);

  useEffect(() => {
    const loadCountries = async () => {
      setCountries(countriesJson.features);
    };

    loadCountries();
  }, []);

  const styleCountryFeature = (countryName: string, neighbors: any[]) => {
    const biome = countryBiomes[countryName] || 'Indefinido';
    const biomeColor = biomeColors[biome] || 'gray';

    const allSameBiome = neighbors.every(neighbor => countryBiomes[neighbor] === biome);

    return {
      fillColor: biomeColor,
      color: allSameBiome ? biomeColor : 'black',
      weight: allSameBiome ? 0 : 1,
      fillOpacity: 0.7
    };
  };

  const onEachCountryFeature = (feature: { properties: { name: any; }; }, layer: { bindPopup: (arg0: string) => void; on: (arg0: { mouseover: (e: { target: { openPopup: () => void; setStyle: (arg0: { weight: number; fillOpacity: number; }) => void; }; }) => void; mouseout: (e: { target: { closePopup: () => void; setStyle: (arg0: { weight: number; fillOpacity: number; }) => void; }; }) => void; }) => void; }) => {
    const countryName = feature.properties.name;
    const biome = countryBiomes[countryName] || 'Indefinido';

    layer.bindPopup(`<strong>${countryName}</strong><br />Bioma predominante: ${biome}`);
    
    layer.on({
      mouseover: (e: { target: { openPopup: () => void; setStyle: (arg0: { weight: number; fillOpacity: number; }) => void; }; }) => {
        e.target.openPopup();
        e.target.setStyle({
          weight: 2,
          fillOpacity: 0.9
        });
      },
      mouseout: (e: { target: { closePopup: () => void; setStyle: (arg0: { weight: number; fillOpacity: number; }) => void; }; }) => {
        e.target.closePopup();
        e.target.setStyle({
          weight: 1,
          fillOpacity: 0.7
        });
      }
    });
  };

  const getCountryNeighbors = (feature: any) => {
    return feature.properties.neighbors || [];
  };

  return (
    <div className="map-container">
  <MapContainer
    center={worldCenter}
    zoom={2}
    minZoom={2}
    maxBounds={[[-90, -180], [90, 180]]}
    className="leaflet-container"
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />

    {countries.map((country, index) => (
      <GeoJSON
        key={index}
        data={country}
        style={() => styleCountryFeature(country.properties.name, getCountryNeighbors(country))}
        onEachFeature={onEachCountryFeature}
      />
    ))}
  </MapContainer>

  <div className="biome-buttons">
    {Object.keys(biomeColors).map((biome, index) => (
      <button
        key={index}
        className="biome-button"
        style={{ backgroundColor: biomeColors[biome] }}
        onClick={() => {
          alert(`O botão do bioma ${biome} está funcionando!`);
          // Aqui você pode adicionar a lógica que será executada quando o botão for clicado
        }}
      >
        {biomeIcons[biome]}
      </button>
    ))}
  </div>

  <style>{`
    .map-container {
      position: relative;
      height: 100vh;
    }

    .leaflet-container {
      z-index: 0; /* Garante que o mapa fique atrás dos botões */
    }

    .biome-buttons {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 1000; /* Garante que os botões fiquem acima do mapa */
    }

    .biome-button {
      width: 40px;
      height: 40px;
      border: 2px solid black;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      font-size: 24px;
      color: white;
      cursor: pointer; /* Mostra o cursor de mãozinha */
      transition: filter 0.2s ease; /* Transição suave para o efeito de hover */
    }

    .biome-button:hover {
      filter: brightness(0.85); /* Escurece um pouco o botão no hover */
    }
  `}</style>
</div>
  );
};

export default MapComponent;
