const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validação básica
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Normaliza o email
    const normalizedEmail = email.toLowerCase().trim();

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({ 
      where: { email: normalizedEmail } 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email já cadastrado',
        suggestion: 'Tente recuperar sua senha ou use outro email'
      });
    }
    
    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 12); // Salt aumentado para 12
    
    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name.trim(),
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      },
      select: { // Não retorna a senha
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true
      }
    });
    
    // Gera token JWT
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      success: true,
      user,
      token,
      message: 'Registro concluído com sucesso'
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ 
      error: 'Erro no servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Normaliza o email
    const normalizedEmail = email.toLowerCase().trim();

    // Debug: Log da tentativa de login
    console.log(`Tentativa de login para: ${normalizedEmail}`);

    // Encontra o usuário
    const user = await prisma.user.findUnique({ 
      where: { email: normalizedEmail } 
    });
    
    if (!user) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ 
        error: 'Credenciais inválidas',
        suggestion: 'Verifique seu email ou cadastre-se'
      });
    }
    
    // Verifica a senha
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Senha incorreta para usuário:', user.email);
      return res.status(401).json({ 
        error: 'Credenciais inválidas',
        suggestion: 'Verifique sua senha ou redefina-a'
      });
    }
    
    // Gera token JWT
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Remove a senha do objeto user
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      error: 'Erro no servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const me = async (req, res) => {
    try {
      // Obtém o usuário sem a senha
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      res.json({
        success: true,
        user,
        message: 'Informações do usuário obtidas com sucesso'
      });
  
    } catch (error) {
      console.error('Erro na rota /me:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao carregar perfil',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

module.exports = { register, login, me };