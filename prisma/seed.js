const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Criar um admin
  await prisma.user.create({
    data: {
      email: 'adminpecc@gmail.com',
      password: '$2a$10$H3zXbBxZ5Y5Z5Z5Z5Z5Z.5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', // senha: admin123
      name: 'admin Lunexx',
      role: 'ADMIN'
    }
  });

  // Criar um curso
  const course = await prisma.course.create({
    data: {
      title: 'Desenvolvimento para GTA SAMP',
      description: 'Aprenda a criar scripts e mods para GTA San Andreas Multiplayer'
    }
  });

  // Criar módulos
  const module1 = await prisma.module.create({
    data: {
      title: 'Introdução ao SAMP',
      order: 1,
      courseId: course.id
    }
  });

  const module2 = await prisma.module.create({
    data: {
      title: 'Programação em Pawn',
      order: 2,
      courseId: course.id
    }
  });

  // Criar aulas
  await prisma.lesson.createMany({
    data: [
      {
        title: 'O que é SAMP?',
        description: 'Introdução ao GTA San Andreas Multiplayer',
        videoUrl: 'https://www.youtube.com/embed/video1',
        order: 1,
        moduleId: module1.id
      },
      {
        title: 'Configurando o Ambiente',
        description: 'Como instalar e configurar o servidor',
        videoUrl: 'https://www.youtube.com/embed/video2',
        order: 2,
        moduleId: module1.id
      },
      {
        title: 'Sintaxe Básica do Pawn',
        description: 'Aprendendo os fundamentos da linguagem',
        videoUrl: 'https://www.youtube.com/embed/video3',
        order: 1,
        moduleId: module2.id
      }
    ]
  });

  // Criar categorias de ferramentas
  const category1 = await prisma.toolCategory.create({
    data: {
      name: 'Editores de Modelos',
      description: 'Ferramentas para edição de modelos 3D'
    }
  });

  const category2 = await prisma.toolCategory.create({
    data: {
      name: 'Editores de Texturas',
      description: 'Ferramentas para edição de texturas'
    }
  });

  // Criar ferramentas
  await prisma.tool.createMany({
    data: [
      {
        name: 'DFF Editor',
        description: 'Editor de arquivos .dff para modelos 3D',
        version: '1.2.0',
        fileSize: '15 MB',
        downloadUrl: 'http://example.com/download/dff-editor',
        categoryId: category1.id
      },
      {
        name: 'TXD Workshop',
        description: 'Editor completo de arquivos .txd',
        version: '2.1.3',
        fileSize: '25 MB',
        downloadUrl: 'http://example.com/download/txd-workshop',
        categoryId: category2.id
      }
    ]
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });