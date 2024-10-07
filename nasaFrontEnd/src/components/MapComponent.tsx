/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import countriesJson from './../geojson/all_countries.geo.json';
import countriesBiomes from './../geojson/countryBiomes_with_new_biomes.json';
import Sidebar from './SideBar'; // Importando a Sidebar
import { LatLngExpression } from 'leaflet';
import { FaTree, FaMountain, FaSun, FaCloudShowersHeavy, FaWater, FaLeaf, FaSeedling, FaUndo, FaInfoCircle } from 'react-icons/fa'; // Importando ícones
import Navbar from './Navbar';
import axios from 'axios';

const biomeColors = {
  'Tundras': 'darkgreen',
  'Tropical Forests': 'teal',
  'Temperate Forests': 'lightgreen',
  'Savannas': 'orange',
  'mangroves': 'blue',
  'Deserts': 'yellow',
  'Grasslands': 'Khaki'
};

const biomeIcons = {
  'Tundras': <FaSeedling />,
  'Tropical Forests': <FaCloudShowersHeavy />,
  'Temperate Forests': <FaTree />,
  'mangroves': <FaWater />,
  'Savannas': <FaSun />,
  'Deserts': <FaMountain />,
  'Grasslands': <FaLeaf />,
};

const dangerLevels = ['#ffffff', '#ffcccc', '#ff9999', '#ff6666', '#ff3333', '#ff0000']; // Cores de gradiente de vermelho

const MapComponent: React.FC = () => {
  const worldCenter: LatLngExpression = [0, 0];
  const [countries, setCountries] = useState<any[]>([]);
  const [countryBiomes, setCountryBiomes] = useState<any>({});
  const [biomeDanger, setBiomeDanger] = useState<{ [key: string]: number }>({
    'Tundras': 0,
    'Tropical Forests': 0,
    'Temperate Forests': 0,
    'Savannas': 0,
    'Deserts': 0,
    'Grasslands': 0
  });
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false); // Estado para a visibilidade da Sidebar
  const [selectedBiome, setSelectedBiome] = useState<string | null>(null); // Estado para armazenar o bioma selecionado
  const [popupVisible, setPopupVisible] = useState<boolean>(false); // Estado para visibilidade do popup
  const [popupText, setPopupText] = useState<string>('Carregando informações...'); // Texto do popup que será carregado pela API

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
    const dangerLevel = biomeDanger[biome] || 0;
    const biomeColor = biomeColors[biome] || 'gray';

    const finalColor = dangerLevel > 0 ? dangerLevels[dangerLevel] : biomeColor;

    const allSameBiome = neighbors.every(neighbor => countryBiomes[neighbor] === biome);

    return {
      fillColor: finalColor,
      color: allSameBiome ? finalColor : 'black',
      weight: allSameBiome ? 0 : 1,
      fillOpacity: 0.7
    };
  };

  const onEachCountryFeature = (feature: { properties: { name: any; }; }, layer: { bindPopup: (arg0: string) => void; on: (arg0: { mouseover: (e: { target: { openPopup: () => void; setStyle: (arg0: { weight: number; fillOpacity: number; }) => void; }; }) => void; mouseout: (e: { target: { closePopup: () => void; setStyle: (arg0: { weight: number; fillOpacity: number; }) => void; }; }) => void; }) => void; }) => {
    const countryName = feature.properties.name;
    const biome = countryBiomes[countryName] || 'Indefinido';

    layer.bindPopup(`<strong>${countryName}</strong><br />Predominant biome: ${biome}`);
    
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

  // Função para fazer a requisição para a API
  const fetchPopupText = async (incOrDec: boolean, att: string, ecosystemName: string) => {
    try {
      const response = await axios.get('https://apidocker1-902862667412.us-central1.run.app', {
        params: {
          incOrDec,
          att,
          ecosystemName,
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });


      // Retorna os dados recebidos da API
      const message = response.data;
      setPopupText(message); // Atualiza o texto do popup com a resposta da API
    } catch (error) {
      console.error('Error to get message from API', error);
      setPopupText('Error to get message information.'); // Em caso de erro
    }
  };

  const updateBiomeDanger = (dangerData: { [key: string]: number }, att: string, ecosystemName: string, sliderValue: number, initialValue: number) => {
    setBiomeDanger(dangerData); // Atualiza o estado com os novos valores de perigo
    const incOrDec = sliderValue > initialValue; // Verifica se o valor aumentou ou diminuiu
    fetchPopupText(incOrDec, att, ecosystemName); // Chama a função que busca o texto do popup com os parâmetros corretos
    setPopupVisible(true); // Mostra o popup ao exibir as camadas vermelhas
  };

  // Função para reiniciar o estado de perigo dos biomas e fechar o popup
  const resetBiomeDanger = () => {
    setBiomeDanger({
      'Tundras': 0,
      'Tropical Forests': 0,
      'Temperate Forests': 0,
      'Savannas': 0,
      'Deserts': 0,
      'Grasslands': 0
    });
    setPopupVisible(false); // Esconde o popup ao resetar as camadas
  };

  const openSidebar = (biome: string) => {
    setSelectedBiome(biome); // Define o bioma selecionado
    setSidebarOpen(true); // Abre a Sidebar
  };

  const closeSidebar = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('.sidebar') === null) { // Apenas fecha se o clique for fora da Sidebar
      setSidebarOpen(false); // Fecha a Sidebar ao clicar fora
      setSelectedBiome(null); // Reseta o bioma selecionado
    }
  };

  return (
    <div className="map-container" onClick={closeSidebar}>
      <Navbar />
      <MapContainer
        center={worldCenter}
        zoom={2}
        minZoom={2}
        zoomControl={false}
        maxBounds={[[-90, -180], [90, 180]]}
        className="leaflet-container"
        onClick={(e) => e.stopPropagation()} // Evita fechar a sidebar ao clicar no mapa
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
            onClick={(e) => {
              e.stopPropagation(); // Evita fechar a Sidebar ao clicar no botão
              openSidebar(biome);
            }}
          >
            {biomeIcons[biome]}
          </button>
        ))}

        {/* Botão de rollback */}
        <button
          className="biome-button"
          style={{ backgroundColor: 'gray' }} // Cor do botão de reset
          onClick={() => resetBiomeDanger()} // Função para reiniciar as camadas
        >
          <FaUndo />
        </button>
      </div>

      {sidebarOpen && selectedBiome && (
        <div className="sidebar" onClick={(e) => e.stopPropagation()}>
          <Sidebar
            biome={selectedBiome}
            dangerLevel={biomeDanger[selectedBiome]}
            onClose={closeSidebar}
            onFetchData={updateBiomeDanger} // Função para atualizar os perigos dos biomas
          />
        </div>
      )}

      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <FaInfoCircle className="popup-icon" />
            <p>{popupText}</p>
            <button className="close-popup-btn" onClick={() => setPopupVisible(false)}>Fechar</button>
          </div>
        </div>
      )}

      <style>{`
        .map-container {
          position: relative;
          height: 100vh;
        }

        .leaflet-container {
          z-index: 0; /* Garante que o mapa fique atrás dos botões */
        }

        .leaflet-control-attribution {
          font-size: 3px; /* Reduz o tamanho da fonte */
          bottom: 5px; /* Ajusta a posição do texto */
          right: 5px; /* Ajusta a posição do texto */
        }

        .biome-buttons {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 1000;
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
          transition: filter 0.2s ease;
        }

        .biome-button:hover {
          filter: brightness(0.85);
        }

        .popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          border: 1px solid #ccc;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          z-index: 10000;
          padding: 20px;
          width: 300px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .popup-icon {
          font-size: 40px;
          color: #007bff;
        }

        .close-popup-btn {
          margin-top: 15px;
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .close-popup-btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
