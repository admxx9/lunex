// src/routes/adminRoutes.js
import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, isAdmin);

// Rotas existentes...
router.post('/courses', (req, res) => {
  // Lógica para criar curso
});

// Novo endpoint para uploads
router.post('/upload', (req, res) => {
  // Lógica para upload de vídeos
});

export default router;