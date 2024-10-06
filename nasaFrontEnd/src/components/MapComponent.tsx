import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

const biomeColors = {
  'Tundra': 'darkgreen',
  'Florestas Tropicais': 'teal',
  'Florestas Temperadas': 'lightgreen',
  'Manguezais': 'darkcyan',
  'Recife de Corais': 'lightblue',
  'Oceanos': 'blue',
  'Savanas': 'orange',
  'Desertos': 'yellow',
  'Pradarias': 'Khaki',
  'Indefinido': 'gray'
};

const MapComponent: React.FC = () => {
  const worldCenter: LatLngExpression = [0, 0];
  const [countries, setCountries] = useState<any[]>([]);
  const [countryBiomes, setCountryBiomes] = useState<any>({});

  useEffect(() => {
    const fetchBiomes = async () => {
      const response = await fetch('/countryBiomes_with_new_biomes.json');
      const data = await response.json();
      setCountryBiomes(data);
    };

    fetchBiomes();
  }, []);

  useEffect(() => {
    const loadCountries = async () => {
      const response = await fetch('/all_countries.geo.json');
      if (!response.ok) {
        console.error('Error to load GeoJSON file');
        return;
      }
      const data = await response.json();
      setCountries(data.features);
    };

    loadCountries();
  }, []);

  const styleCountryFeature = (countryName: string, neighbors: any[]) => {
    const biome = countryBiomes[countryName] || 'Undefined';
    const biomeColor = biomeColors[biome] || 'gray';

    const allSameBiome = neighbors.every(neighbor => countryBiomes[neighbor] === biome);

    return {
      fillColor: biomeColor,
      color: allSameBiome ? biomeColor : 'black',
      weight: allSameBiome ? 0 : 1,
      fillOpacity: 0.7
    };
  };

  const onEachCountryFeature = (feature: any, layer: any) => {
    const countryName = feature.properties.name;
    const biome = countryBiomes[countryName] || 'Undefined';

    layer.bindPopup(`<strong>${countryName}</strong><br />Predominant biome: ${biome}`);
    
    layer.on({
      mouseover: (e) => {
        e.target.openPopup();
        e.target.setStyle({
          weight: 2,
          fillOpacity: 0.9
        });
      },
      mouseout: (e) => {
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
  );
};

export default MapComponent;
