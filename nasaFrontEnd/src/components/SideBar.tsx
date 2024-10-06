import React, { useState } from 'react';
import { Slider, Typography, Box, Button } from '@mui/material';
import './Sidebar.css'; // Manter o estilo do sidebar

const Sidebar = () => {
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [metricValue, setMetricValue] = useState({
    temperature: 20,
    airQuality: 50,
    waterQuality: 50,
    humidity: 60,
    biodiversity: 70,
    deforestation: 30,
  });

  // Função para atualizar o valor da métrica
  const handleSliderChange = (event: Event, value: number | number[]) => {
    setMetricValue({
      ...metricValue,
      [selectedMetric]: Array.isArray(value) ? value[0] : value,
    });
  };

  const handleExecute = () => {
    alert(`
      Selected values:
      Temperature: ${metricValue.temperature}°C
      Air Quality: ${metricValue.airQuality}%
      Water Quality: ${metricValue.waterQuality}%
      Humidity: ${metricValue.humidity}%
      Biodiversity: ${metricValue.biodiversity}%
      Deforestation: ${metricValue.deforestation}%
    `);
  };

  // Define os valores mínimo e máximo do slider conforme a métrica
  const getMinMaxValues = () => {
    switch (selectedMetric) {
      case 'temperature':
        return { min: -10, max: 100, suffix: '°C' };
      case 'airQuality':
      case 'waterQuality':
      case 'humidity':
      case 'biodiversity':
      case 'deforestation':
        return { min: 0, max: 100, suffix: '%' };
      default:
        return { min: 0, max: 100, suffix: '' };
    }
  };

  const { min, max, suffix } = getMinMaxValues();

  return (
    <div className="sidebar">
      <h2>🌍 Environmental Monitor</h2>

      {/* Dropdown para selecionar a métrica */}
      <div className="dropdown-container">
        <label htmlFor="metric">Select Metric:</label>
        <select
          id="metric"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
        >
          <option value="temperature">🌡️ Temperature</option>
          <option value="airQuality">🌬️ Air Quality</option>
          <option value="waterQuality">💧 Water Quality</option>
          <option value="humidity">💦 Humidity</option>
          <option value="biodiversity">🌱 Biodiversity</option>
          <option value="deforestation">🌳 Deforestation</option>
        </select>
      </div>

      {/* Slider do MUI */}
      <Box className="slider-container" sx={{ width: '100%' }}>
        <Typography gutterBottom>    
          {selectedMetric === 'temperature'
            ? `🌡️ Temperature: ${metricValue[selectedMetric]}${suffix}`
            : `${selectedMetric}: ${metricValue[selectedMetric]}${suffix}`}
        </Typography>
        <Slider
          sx={{fontFamily: 'Gloria Hallelujah, cursive'}}      
          value={metricValue[selectedMetric]}
          onChange={handleSliderChange}
          min={min}
          max={max}
          aria-labelledby="input-slider"
          valueLabelDisplay="auto" /* Exibe o valor ao lado do thumb */
        />
      </Box>

      {/* Botão de execução */}
      <Button
        variant="contained"
        color="success"
        onClick={handleExecute}
        className="execute-button"
        sx={{ marginTop: 2, width: '100%', fontFamily: 'Gloria Hallelujah, cursive'}}
      >
        Execute
      </Button>
    </div>
  );
};

export default Sidebar;
