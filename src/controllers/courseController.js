const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                progress: {
                  where: { userId: req.user?.id }
                }
              }
            }
          }
        }
      }
    });
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cursos' });
  }
};

const getCourseModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const modules = await prisma.module.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        lessons: {
          include: {
            progress: {
              where: { userId: req.user?.id }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
    
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar módulos' });
  }
};

const getLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: {
        resources: true,
        progress: {
          where: { userId: req.user?.id }
        }
      }
    });
    
    if (!lesson) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }
    
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aula' });
  }
};

const completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;
    
    // Verifica se já está concluída
    const existingProgress = await prisma.progress.findFirst({
      where: { userId, lessonId: parseInt(lessonId) }
    });
    
    if (existingProgress?.completed) {
      return res.json({ message: 'Aula já concluída' });
    }
    
    // Atualiza ou cria o progresso
    const progress = await prisma.progress.upsert({
      where: { 
        userId_lessonId: {
          userId,
          lessonId: parseInt(lessonId)
        }
      },
      update: { completed: true, completedAt: new Date() },
      create: {
        completed: true,
        completedAt: new Date(),
        userId,
        lessonId: parseInt(lessonId)
      }
    });
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao marcar aula como concluída' });
  }
};

module.exports = { getAllCourses, getCourseModules, getLesson, completeLesson };