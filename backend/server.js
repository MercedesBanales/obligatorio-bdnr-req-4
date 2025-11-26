const express = require('express');
const cors = require('cors');
const { driver, verifyConnection } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

verifyConnection();

// ==================== VALIDACIÓN ====================
function validateUserId(req, res, next) {
  const { userId } = req.params;
  if (!userId || !userId.match(/^u\d+$/)) {
    return res.status(400).json({ 
      success: false, 
      error: 'ID de usuario inválido. Formato esperado: u1, u2, etc.' 
    });
  }
  next();
}

// ==================== ENDPOINTS DE RECOMENDACIONES ====================

// (a) Refuerzo por dificultad detectada - CONSULTA DEL DOCUMENTO
app.get('/api/recommendations/struggles/:userId', validateUserId, async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (u:User {user_id: $uid})-[:STRUGGLES_WITH]->(s:Skill)<-[:TEACHES]-(l:Lesson)
      RETURN l.lesson_id AS lesson, 
             l.topic AS topic, 
             l.difficulty AS difficulty,
             l.description AS description
      ORDER BY coalesce(l.difficulty, 1) DESC
      LIMIT 5
    `, { uid: req.params.userId });
    
    const recommendations = result.records.map(record => {
      const lesson = record.get('lesson');
      const topic = record.get('topic');
      const difficulty = record.get('difficulty');
      const description = record.get('description');
      
      // Convertir difficulty a número si es un Integer de Neo4j o ya es un número
      let difficultyNum = null;
      if (difficulty !== null && difficulty !== undefined) {
        difficultyNum = typeof difficulty.toNumber === 'function' ? difficulty.toNumber() : Number(difficulty);
      }
      
      return {
        lesson_id: lesson || null,
        topic: topic || null,
        difficulty: difficultyNum,
        description: description || null
      };
    }).filter(rec => rec.lesson_id !== null || rec.topic !== null); // Solo incluir si tiene al menos lesson_id o topic
    
    res.json({ 
      success: true, 
      userId: req.params.userId,
      type: 'struggles',
      description: 'Lecciones recomendadas para reforzar skills con dificultad',
      data: recommendations 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await session.close();
  }
});

// (b) Contenido relacionado - CONSULTA DEL DOCUMENTO
app.get('/api/recommendations/similar/:userId', validateUserId, async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (u:User {user_id: $uid})-[:COMPLETED]->(l:Lesson)
      WITH u, l
      ORDER BY l.last_completed_at DESC
      LIMIT 1
      MATCH (l)-[r:SIMILAR_TO]->(l2:Lesson)
      RETURN l2.lesson_id AS lesson, 
             l2.topic AS topic, 
             l2.description AS description,
             r.weight AS similarity
      ORDER BY r.weight DESC
      LIMIT 5
    `, { uid: req.params.userId });
    
    const recommendations = result.records.map(record => {
      const lesson = record.get('lesson');
      const topic = record.get('topic');
      const description = record.get('description');
      const similarity = record.get('similarity');
      
      // Convertir similarity a número si es un Integer de Neo4j o ya es un número
      let similarityNum = null;
      if (similarity !== null && similarity !== undefined) {
        similarityNum = typeof similarity.toNumber === 'function' ? similarity.toNumber() : Number(similarity);
      }
      
      return {
        lesson_id: lesson || null,
        topic: topic || null,
        description: description || null,
        similarity: similarityNum
      };
    }).filter(rec => rec.lesson_id !== null || rec.topic !== null);
    
    res.json({ 
      success: true, 
      userId: req.params.userId,
      type: 'similar_content',
      description: 'Lecciones similares a la última completada',
      data: recommendations 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await session.close();
  }
});

// (c) Sugerencia colaborativa simple - CONSULTA DEL DOCUMENTO
app.get('/api/recommendations/collaborative/:userId', validateUserId, async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (u:User {user_id: $uid})-[:STRUGGLES_WITH]->(s:Skill)<-[:STRUGGLES_WITH]-(o:User),
            (o)-[:COMPLETED]->(l:Lesson)
      WHERE NOT (u)-[:COMPLETED]->(l)
      RETURN l.lesson_id AS lesson, 
             l.topic AS topic,
             l.description AS description,
             count(*) AS votes
      ORDER BY votes DESC
      LIMIT 5
    `, { uid: req.params.userId });
    
    const recommendations = result.records.map(record => {
      const lesson = record.get('lesson');
      const topic = record.get('topic');
      const description = record.get('description');
      const votes = record.get('votes');
      
      return {
        lesson_id: lesson || null,
        topic: topic || null,
        description: description || null,
        votes: votes ? votes.toNumber() : 0
      };
    }).filter(rec => rec.lesson_id !== null || rec.topic !== null);
    
    res.json({ 
      success: true, 
      userId: req.params.userId,
      type: 'collaborative',
      description: 'Lecciones que ayudaron a usuarios con dificultades similares',
      data: recommendations 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await session.close();
  }
});

// Recomendaciones sociales (amigos)
app.get('/api/recommendations/social/:userId', validateUserId, async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (u:User {user_id: $uid})-[:FRIEND_WITH]-(friend:User)-[:COMPLETED]->(l:Lesson)
      WHERE NOT (u)-[:COMPLETED]->(l)
      RETURN l.lesson_id AS lesson,
             l.topic AS topic,
             l.description AS description,
             COUNT(DISTINCT friend) AS friend_count
      ORDER BY friend_count DESC
      LIMIT 5
    `, { uid: req.params.userId });
    
    const recommendations = result.records.map(record => {
      const lesson = record.get('lesson');
      const topic = record.get('topic');
      const description = record.get('description');
      const friendCount = record.get('friend_count');
      
      return {
        lesson_id: lesson || null,
        topic: topic || null,
        description: description || null,
        friend_count: friendCount ? friendCount.toNumber() : 0,
        friends_completed: friendCount ? friendCount.toNumber() : 0
      };
    }).filter(rec => rec.lesson_id !== null || rec.topic !== null);
    
    res.json({ 
      success: true, 
      userId: req.params.userId,
      type: 'social',
      description: 'Lecciones que tus amigos han completado',
      data: recommendations 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await session.close();
  }
});

// ==================== ENDPOINTS DE DATOS ====================

// Obtener usuario específico
app.get('/api/users/:userId', validateUserId, async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (u:User {user_id: $userId})
      OPTIONAL MATCH (u)-[:ENROLLED_IN]->(c:Course)
      OPTIONAL MATCH (u)-[:COMPLETED]->(l:Lesson)
      OPTIONAL MATCH (u)-[:STRUGGLES_WITH]->(s:Skill)
      OPTIONAL MATCH (u)-[:FRIEND_WITH]-(friend:User)
      RETURN u,
             collect(DISTINCT c.course_id) AS courses,
             count(DISTINCT l) AS lessons_completed,
             collect(DISTINCT s.name) AS struggles,
             count(DISTINCT friend) AS friends_count
    `, { userId: req.params.userId });
    
    if (result.records.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
    
    const record = result.records[0];
    const user = {
      ...record.get('u').properties,
      courses: record.get('courses'),
      lessons_completed: record.get('lessons_completed').toNumber(),
      struggles: record.get('struggles'),
      friends_count: record.get('friends_count').toNumber()
    };
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await session.close();
  }
});

// Listar todos los usuarios
app.get('/api/users', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (u:User)
      OPTIONAL MATCH (u)-[:ENROLLED_IN]->(c:Course)
      RETURN u, collect(DISTINCT c.course_id) AS courses
      ORDER BY u.user_id
      LIMIT 50
    `);
    
    const users = result.records.map(record => ({
      ...record.get('u').properties,
      courses: record.get('courses')
    }));
    
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await session.close();
  }
});

// Red de amigos (caminos en el grafo)
app.get('/api/network/:userId', validateUserId, async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH path = (u1:User {user_id: $userId})-[:FRIEND_WITH*1..2]-(u2:User)
      WHERE u1 <> u2
      RETURN DISTINCT u2.user_id AS user_id, 
             u2.name AS name, 
             length(path) AS distance
      ORDER BY distance, u2.name
      LIMIT 20
    `, { userId: req.params.userId });
    
    const network = result.records.map(record => ({
      user_id: record.get('user_id'),
      name: record.get('name'),
      distance: record.get('distance').toNumber(),
      relationship: record.get('distance').toNumber() === 1 ? 'amigo directo' : 'amigo de amigo'
    }));
    
    res.json({ 
      success: true, 
      userId: req.params.userId,
      data: network 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await session.close();
  }
});

// Cursos disponibles
app.get('/api/courses', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (c:Course)
      OPTIONAL MATCH (c)<-[:ENROLLED_IN]-(u:User)
      OPTIONAL MATCH (l:Lesson {course_id: c.course_id})
      RETURN c.course_id AS course_id, 
             c.language_from AS language_from,
             c.language_to AS language_to,
             COUNT(DISTINCT u) AS enrolled_count,
             COUNT(DISTINCT l) AS lessons_count
      ORDER BY c.course_id
    `);
    
    const courses = result.records.map(record => ({
      course_id: record.get('course_id'),
      language_from: record.get('language_from'),
      language_to: record.get('language_to'),
      enrolled_count: record.get('enrolled_count').toNumber(),
      lessons_count: record.get('lessons_count').toNumber()
    }));
    
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await session.close();
  }
});

// Lecciones de un curso
app.get('/api/courses/:courseId/lessons', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (l:Lesson {course_id: $courseId})
      OPTIONAL MATCH (l)-[:TEACHES]->(s:Skill)
      OPTIONAL MATCH (u:User)-[:COMPLETED]->(l)
      RETURN l.lesson_id AS lesson_id,
             l.topic AS topic,
             l.difficulty AS difficulty,
             l.unit_id AS unit_id,
             l.description AS description,
             collect(DISTINCT s.name) AS skills,
             count(DISTINCT u) AS completions
      ORDER BY l.lesson_id
    `, { courseId: req.params.courseId });
    
    const lessons = result.records.map(record => {
      const difficulty = record.get('difficulty');
      const completions = record.get('completions');
      
      return {
        lesson_id: record.get('lesson_id'),
        topic: record.get('topic'),
        difficulty: difficulty !== null && difficulty !== undefined 
          ? (typeof difficulty.toNumber === 'function' ? difficulty.toNumber() : Number(difficulty))
          : null,
        unit_id: record.get('unit_id'),
        description: record.get('description') || null,
        skills: record.get('skills') || [],
        completions: completions !== null && completions !== undefined
          ? (typeof completions.toNumber === 'function' ? completions.toNumber() : Number(completions))
          : 0
      };
    });
    
    res.json({ 
      success: true, 
      courseId: req.params.courseId, 
      count: lessons.length,
      data: lessons 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await session.close();
  }
});

// Estadísticas generales
app.get('/api/stats', async (req, res) => {
  try {
    // Ejecutar queries secuencialmente para evitar problemas de transacciones
    const usersResult = await (async () => {
      const session = driver.session();
      try {
        return await session.run('MATCH (u:User) RETURN count(u) as count');
      } finally {
        await session.close();
      }
    })();

    const coursesResult = await (async () => {
      const session = driver.session();
      try {
        return await session.run('MATCH (c:Course) RETURN count(c) as count');
      } finally {
        await session.close();
      }
    })();

    const lessonsResult = await (async () => {
      const session = driver.session();
      try {
        return await session.run('MATCH (l:Lesson) RETURN count(l) as count');
      } finally {
        await session.close();
      }
    })();

    const skillsResult = await (async () => {
      const session = driver.session();
      try {
        return await session.run('MATCH (s:Skill) RETURN count(s) as count');
      } finally {
        await session.close();
      }
    })();

    const friendshipsResult = await (async () => {
      const session = driver.session();
      try {
        return await session.run('MATCH ()-[r:FRIEND_WITH]-() RETURN count(r) as count');
      } finally {
        await session.close();
      }
    })();

    const completedResult = await (async () => {
      const session = driver.session();
      try {
        return await session.run('MATCH ()-[r:COMPLETED]->() RETURN count(r) as count');
      } finally {
        await session.close();
      }
    })();
    
    res.json({
      success: true,
      data: {
        users: usersResult.records[0]?.get('count')?.toNumber() || 0,
        courses: coursesResult.records[0]?.get('count')?.toNumber() || 0,
        lessons: lessonsResult.records[0]?.get('count')?.toNumber() || 0,
        skills: skillsResult.records[0]?.get('count')?.toNumber() || 0,
        friendships: friendshipsResult.records[0]?.get('count')?.toNumber() / 2 || 0,
        lessons_completed: completedResult.records[0]?.get('count')?.toNumber() || 0
      }
    });
  } catch (error) {
    console.error('Error en /api/stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Motor de Recomendaciones - Duolingo',
    timestamp: new Date().toISOString()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint no encontrado',
    availableEndpoints: {
      recommendations: [
        'GET /api/recommendations/struggles/:userId',
        'GET /api/recommendations/similar/:userId',
        'GET /api/recommendations/collaborative/:userId',
        'GET /api/recommendations/social/:userId'
      ],
      data: [
        'GET /api/users',
        'GET /api/users/:userId',
        'GET /api/network/:userId',
        'GET /api/courses',
        'GET /api/courses/:courseId/lessons',
        'GET /api/stats'
      ]
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 MOTOR DE RECOMENDACIONES - DUOLINGO`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📍 Servidor: http://localhost:${PORT}`);
  console.log(`🏥 Health:   http://localhost:${PORT}/health`);
  console.log(`\n📚 ENDPOINTS DE RECOMENDACIONES:`);
  console.log(`   GET /api/recommendations/struggles/:userId`);
  console.log(`   GET /api/recommendations/similar/:userId`);
  console.log(`   GET /api/recommendations/collaborative/:userId`);
  console.log(`   GET /api/recommendations/social/:userId`);
  console.log(`\n📊 ENDPOINTS DE DATOS:`);
  console.log(`   GET /api/users`);
  console.log(`   GET /api/users/:userId`);
  console.log(`   GET /api/network/:userId`);
  console.log(`   GET /api/courses`);
  console.log(`   GET /api/courses/:courseId/lessons`);
  console.log(`   GET /api/stats`);
  console.log(`${'='.repeat(60)}\n`);
});

// Cierre graceful
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Cerrando servidor...');
  await driver.close();
  console.log('✅ Conexión a Neo4j cerrada');
  process.exit(0);
});