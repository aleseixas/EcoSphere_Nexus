// server.js

const express = require('express');
const app = express();
const port = 3000;
const url = 'https://api.meteomatics.com/2024-10-05T00:00:00Z/t_2m:C/52.520551,13.461804/html';


// Middleware para permitir o uso de JSON
app.use(express.json());

// Rota de exemplo - Requisição GET
app.get('/', (req, res) => {
  res.send('Bem-vindo à API criada com Node.js e Express!');
});

app.get('/weather', async (req, res) => {
    const { lat, lng } = req.query;
    //const apiUrl = `https://api.meteomatics.com/2024-10-05T00:00:00Z/t_2m:C/${lat},${lng}/json`;
    const apiUrl = 'https://api.meteomatics.com/2024-10-05T00:00:00Z/t_2m:C/52.520551,13.461804/html';
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Basic ' + Buffer.from('unicamp_seixas_alexandre:yONsXt63s5').toString('base64'),
        },
      });
      const data = await response;
      // res.json(data);
      console.log(data);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      res.status(500).send('Erro ao buscar dados meteorológicos');
    }
  });

// Rota de exemplo - Requisição POST
app.post('/data', (req, res) => {
  const { name, age } = req.body;  // Pegando os dados do corpo da requisição
  res.json({ message: `Olá ${name}, você tem ${age} anos!` });
});

// Rota com parâmetros dinâmicos
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;  // Pegando o parâmetro dinâmico da URL
  res.json({ message: `Usuário ID: ${userId}` });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});