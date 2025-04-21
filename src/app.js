require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const toolRoutes = require('./routes/toolRoutes');
const searchRoutes = require('./routes/searchRoutes');  // ← Adicionado
const swaggerConfig = require('./utils/swagger');  // ← Renomeado para evitar conflito

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tools', toolRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do Pecc Studio!' });
});

swaggerConfig(app);  // ← Agora usando swaggerConfig

// Manipulador de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;