// src/MapComponent.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import shp from 'shpjs';  // Importando a biblioteca shp.js

const biomesData = [
  { name: 'Amazônia', color: 'green', file: '/amazon_biome_border.zip' },
  { name: 'Caatinga', color: 'yellow', file: '/caatinga_biome_border.zip' },
  { name: 'Cerrado', color: 'orange', file: '/cerrado_biome_border.zip' },
  { name: 'Mata Atlântica', color: 'blue', file: '/mata_atlantica_biome_border.zip' },
  { name: 'Pampa', color: 'red', file: '/pampas_biome_border.zip' },
  { name: 'Pantanal', color: 'purple', file: '/pantanal_biome_border.zip' }
];

const MapComponent: React.FC = () => {
  const brazilCenter: LatLngExpression = [-14.235004, -51.92528]; // Coordenadas aproximadas do centro do Brasil
  const [biomes, setBiomes] = useState<any[]>([]);  // Estado para armazenar os dados GeoJSON dos biomas

  // Função para carregar os arquivos .zip dos biomas e converter para GeoJSON
  useEffect(() => {
    const loadBiomes = async () => {
      const loadedBiomes = await Promise.all(
        biomesData.map(async (biome) => {
          const response = await fetch(biome.file);  // Caminho para cada arquivo .zip
          const arrayBuffer = await response.arrayBuffer();  // Lê o arquivo como ArrayBuffer
          const geojson = await shp(arrayBuffer);  // Converte o shapefile para GeoJSON
          return { name: biome.name, color: biome.color, geojson };
        })
      );
      setBiomes(loadedBiomes);  // Armazena os dados GeoJSON no estado
    };

    loadBiomes();  // Carrega os biomas ao montar o componente
  }, []);

  // Função para aplicar estilos ao GeoJSON de cada bioma
  const styleFeature = (feature: any, biomeColor: string) => {
    return {
      fillColor: `url(#gradient-${biomeColor})`,  // Gradiente aplicado ao preenchimento
      color: biomeColor,                        // Cor da borda
      weight: 2,                                // Espessura da borda
      fillOpacity: 0.5,                         // Transparência do preenchimento
    };
  };

  // Função para exibir o nome do bioma no hover
  const onEachFeature = (biomeName: string) => (feature: any, layer: any) => {
    layer.bindPopup(`<strong>${biomeName}</strong>`);
    layer.on({
      mouseover: (e) => {
        e.target.openPopup();
        e.target.setStyle({
          weight: 4,  // Destaca a borda no hover
          fillOpacity: 0.8,  // Aumenta a opacidade no hover
        });
      },
      mouseout: (e) => {
        e.target.closePopup();
        e.target.setStyle({
          weight: 2,  // Restaura a espessura da borda
          fillOpacity: 0.5,  // Restaura a opacidade original
        });
      }
    });
  };

  return (
    <MapContainer
      center={brazilCenter}  // Centraliza o mapa no Brasil
      zoom={4}               // Ajuste de zoom inicial
      minZoom={2}            // Limitar zoom-out para que o Brasil ainda esteja visível
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
      className="leaflet-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Definição dos gradientes para cada cor */}
      <svg>
        {biomesData.map((biome) => (
          <defs key={biome.color}>
            <linearGradient id={`gradient-${biome.color}`} gradientTransform="rotate(90)">
              <stop offset="0%" stopColor={biome.color} />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
          </defs>
        ))}
      </svg>

      {/* Renderiza cada bioma com seu respectivo estilo */}
      {biomes.map((biome) => (
        <GeoJSON
          key={biome.name}
          data={biome.geojson}
          style={() => styleFeature(null, biome.color)}
          onEachFeature={onEachFeature(biome.name)}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent;
