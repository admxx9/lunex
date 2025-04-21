const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getToolCategories = async (req, res) => {
  try {
    const categories = await prisma.toolCategory.findMany({
      include: { tools: true }
    });
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};

const getTools = async (req, res) => {
  try {
    const tools = await prisma.tool.findMany({
      include: { category: true }
    });
    
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ferramentas' });
  }
};

const getToolsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const tools = await prisma.tool.findMany({
      where: { categoryId: parseInt(categoryId) },
      include: { category: true }
    });
    
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ferramentas' });
  }
};

module.exports = { getToolCategories, getTools, getToolsByCategory };