const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Rota de pesquisa unificada
router.get('/', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 3) {
      return res.status(400).json({
        error: 'Termo de busca deve ter pelo menos 3 caracteres'
      });
    }

    const [courses, lessons, tools] = await Promise.all([
      // Pesquisa em cursos
      prisma.course.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          title: true,
          description: true,
          thumbnailUrl: true
        }
      }),

      // Pesquisa em aulas
      prisma.lesson.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          title: true,
          description: true,
          module: {
            select: {
              course: {
                select: {
                  title: true
                }
              }
            }
          }
        }
      }),

      // Pesquisa em ferramentas
      prisma.tool.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        }
      })
    ]);

    res.json({
      success: true,
      results: {
        courses,
        lessons,
        tools
      }
    });

  } catch (error) {
    console.error('Erro na pesquisa:', error);
    res.status(500).json({
      error: 'Erro ao realizar pesquisa',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Exportação no formato CommonJS
module.exports = router;