const express = require('express');
const { authenticate } = require('../middleware/auth');
const { 
  getAllCourses, 
  getCourseModules, 
  getLesson, 
  completeLesson 
} = require('../controllers/courseController');

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:courseId/modules', authenticate, getCourseModules);
router.get('/lessons/:lessonId', authenticate, getLesson);
router.post('/lessons/:lessonId/complete', authenticate, completeLesson);

module.exports = router;