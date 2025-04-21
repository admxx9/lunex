const express = require('express');
const { 
  getToolCategories, 
  getTools, 
  getToolsByCategory 
} = require('../controllers/toolController');

const router = express.Router();

router.get('/categories', getToolCategories);
router.get('/', getTools);
router.get('/category/:categoryId', getToolsByCategory);

module.exports = router;