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
  const [isChatOpen, setIsChatOpen] = useState(false); // Controla a exibição do chat
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string, message: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Função para atualizar o valor da métrica
  const handleSliderChange = (event: Event, value: number | number[]) => {
    setMetricValue({
      ...metricValue,
      [selectedMetric]: Array.isArray(value) ? value[0] : value,
    });
  };

  // Função para abrir o chat quando o botão "EXECUTE" for clicado
  const handleExecute = () => {
    setIsChatOpen(true); // Abre o chat
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
          sx={{ fontFamily: 'Gloria Hallelujah, cursive' }}
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

            {/* Input para o usuário digitar sua mensagem */}
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Digite sua mensagem"
            />
            <Button onClick={handleSendMessage} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
