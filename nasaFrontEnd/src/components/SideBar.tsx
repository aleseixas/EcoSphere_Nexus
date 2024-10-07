import React, { useState } from 'react';
import { Slider, Typography, Box, Button } from '@mui/material';
import './Sidebar.css'; // Manter o estilo do sidebar
import axios from 'axios';

interface SidebarProps {
  biome: string;
  dangerLevel: number;
  onClose: () => void;
  onFetchData: (data: { [key: string]: number }) => void; // Função para atualizar o perigo dos biomas
}

const Sidebar: React.FC<SidebarProps> = ({ biome, dangerLevel, onClose, onFetchData }) => {
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [metricValue, setMetricValue] = useState({
    temperature: 20,
    airQuality: 50,
    waterQuality: 50,
    humidity: 60,
    biodiversity: 70,
    deforestation: 30,
  });
  const [isChatOpen, setIsChatOpen] = useState(false); // Controla a exibição do chat
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string, message: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (attributeToBeAltered: string, newValue: number, ecosystemName: string, numYears = 15) => {
    if (attributeToBeAltered != 'temperature'){
      newValue = newValue / 100;
    }
    console.log(attributeToBeAltered);
    console.log(newValue);
    console.log(ecosystemName);
    console.log(numYears);
    try {
      const response = await axios.get('https://apidocker2-902862667412.us-central1.run.app', {
        params: {
          numYears,
          newValue,
          attributeToBeAltered,
          ecosystemName,
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
  
      // Retorna os dados recebidos da API
      return response.data;
    } catch (error) {
      console.error('Error to get message of Alert.');
      return null;
    }
  };

  const handleExecute = async () => {
    const data = await fetchData(selectedMetric, metricValue[selectedMetric], biome);
    if (data) {
      onFetchData(data); // Atualiza o perigo dos biomas com a resposta da API
    }
  };

  // Função para atualizar o valor da métrica
  const handleSliderChange = (event: Event, value: number | number[]) => {
    setMetricValue({
      ...metricValue,
      [selectedMetric]: Array.isArray(value) ? value[0] : value,
    });
  };


  // Função para fechar o chat
  const handleCloseChat = () => {
    setIsChatOpen(false); // Fecha o chat
  };

  // Função para enviar mensagem para a IA
  const handleSendMessage = async () => {
    if (!userMessage) return;

    setLoading(true);

    // Adiciona a mensagem do usuário ao histórico
    setChatHistory([...chatHistory, { sender: 'user', message: userMessage }]);

    // Simula uma chamada para a IA "Gemini" (substitua pela sua lógica)
    try {
      const response = await fetch('SUA_URL_DO_BACKEND_OU_API', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer SUA_CHAVE_API`, // Substitua pela sua chave API
        },
        body: JSON.stringify({ message: userMessage, model: 'gemini-chat' }),
      });

      const data = await response.json();
      setChatHistory([...chatHistory, { sender: 'user', message: userMessage }, { sender: 'ia', message: data.reply }]);
      setUserMessage('');
    } catch (error) {
      console.error('Erro ao se comunicar com a IA:', error);
    }

    setLoading(false);
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
      <h3>{biome}</h3>
      <h3>🌍 Environmental Monitor</h3>

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

      <Box className="slider-container" sx={{ width: '100%' }}>
        <Typography gutterBottom>
          {selectedMetric === 'temperature'
            ? `🌡️ Temperature: ${metricValue[selectedMetric]}${suffix}`
            : `${selectedMetric}: ${metricValue[selectedMetric]}${suffix}`}
        </Typography>
        <Slider
          sx={{ fontFamily: 'Gloria Hallelujah, cursive' }}
          value={metricValue[selectedMetric]}
          onChange={handleSliderChange}
          min={min}
          max={max}
          aria-labelledby="input-slider"
          valueLabelDisplay="auto"
        />
      </Box>

      <Button
        variant="contained"
        color="success"
        onClick={handleExecute}
        className="execute-button"
        sx={{ marginTop: 2, width: '100%', fontFamily: 'Gloria Hallelujah, cursive'}}
      >
        Execute
      </Button>

      {/* Pop-up centralizado */}
      {isChatOpen && (
        <div className="popup-overlay">
          <div className="chat-popup">
            <div className="chat-header">
              <h2>Interação com a IA Gemini</h2>
              <Button onClick={handleCloseChat} variant="contained" color="error">
                Fechar
              </Button>
            </div>

            {/* Histórico de mensagens */}
            <div className="chat-history">
              {chatHistory.map((chat, index) => (
                <div key={index} className={chat.sender === 'user' ? 'user-message' : 'ia-message'}>
                  <strong>{chat.sender === 'user' ? 'Você' : 'Gemini'}:</strong> {chat.message}
                </div>
              ))}
            </div>

            {/* Input e botão de enviar mensagem alinhados */}
            <div className="input-container" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Digite sua mensagem"
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', outline: 'none', fontSize: '16px' }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading}
                variant="contained"
                color="primary"
                sx={{ marginLeft: 1, height: '100%' }}
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
