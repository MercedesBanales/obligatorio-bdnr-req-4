const { driver } = require('./db');

const courses = ['es_en', 'fr_en', 'de_en'];
const skillsData = {
  'es_en': ['presente', 'ser_estar', 'subjuntivo', 'preposiciones', 'preterito'],
  'fr_en': ['articles', 'passe_compose', 'subjonctif', 'pronouns'],
  'de_en': ['cases', 'separable_verbs', 'word_order', 'adjective_endings']
};

const skillDescriptions = {
  // Español a Inglés
  'presente': 'Tiempo presente simple: acciones que ocurren ahora o son hábitos.',
  'ser_estar': 'Diferencia entre "ser" y "estar": identidad vs estado temporal.',
  'subjuntivo': 'Modo subjuntivo: expresiones de duda, deseo o emoción.',
  'preposiciones': 'Preposiciones de lugar, tiempo y dirección (en, a, de, con, por, etc.).',
  'preterito': 'Tiempo pasado (pretérito): acciones completadas en el pasado.',
  
  // Francés a Inglés
  'articles': 'Artículos definidos e indefinidos (le, la, les, un, une, des).',
  'passe_compose': 'Tiempo pasado compuesto: acciones completadas.',
  'subjonctif': 'Modo subjuntivo: expresiones de duda, deseo y emoción.',
  'pronouns': 'Pronombres personales, posesivos y demostrativos.',
  
  // Alemán a Inglés
  'cases': 'Casos gramaticales: nominativo, acusativo, dativo y genitivo.',
  'separable_verbs': 'Verbos separables: verbos con prefijos que se separan.',
  'word_order': 'Orden de palabras: posición del verbo en oraciones.',
  'adjective_endings': 'Terminaciones de adjetivos según caso y género.'
};

const tagsData = ['beginner', 'intermediate', 'advanced', 'grammar', 'vocabulary', 'conversation'];
const achievementsData = ['first_lesson', 'week_streak', 'perfect_score', 'polyglot', 'dedicated_learner'];

const nombres = [
  'Ana García', 'Carlos López', 'María Rodríguez', 'Juan Martínez', 'Laura Fernández',
  'Pedro Sánchez', 'Sofía González', 'Diego Torres', 'Carmen Ruiz', 'Miguel Álvarez',
  'Elena Díaz', 'Javier Moreno', 'Paula Jiménez', 'Alberto Castro', 'Lucía Romero',
  'Fernando Navarro', 'Isabel Ramos', 'Roberto Gil', 'Natalia Ortiz', 'Daniel Serrano',
  'Marta Molina', 'Andrés Delgado', 'Cristina Vega', 'Raúl Herrera', 'Beatriz Mendoza',
  'Francisco Iglesias', 'Sandra Campos', 'Manuel Flores', 'Alicia Vargas', 'Jorge Cruz',
  'Patricia Herrero', 'Ricardo Cabrera', 'Silvia Márquez', 'Antonio Soto', 'Rosa Domínguez',
  'Luis Rubio', 'Clara Montero', 'Sergio Méndez', 'Pilar Guerrero', 'Óscar León',
  'Julia Pascual', 'Alejandro Blanco', 'Teresa Santana', 'Víctor Ibáñez', 'Irene Peña',
  'Pablo Nieto', 'Marina Aguilar', 'Enrique Cortés', 'Eva Medina', 'Rafael Reyes'
];

async function seed() {
  const session = driver.session();
  
  try {
    console.log('🗑️  Limpiando base de datos...');
    await session.run('MATCH (n) DETACH DELETE n');
    
    // ==================== USUARIOS ====================
    console.log('👥 Creando 50 usuarios...');
    for (let i = 0; i < 50; i++) {
      await session.run(`
        CREATE (u:User {
          user_id: $user_id,
          name: $name,
          level: $level,
          xp_total: $xp,
          streak: $streak
        })
      `, {
        user_id: `u${i + 1}`,
        name: nombres[i],
        level: Math.floor(Math.random() * 25) + 1,
        xp: Math.floor(Math.random() * 49900) + 100,
        streak: Math.floor(Math.random() * 366)
      });
    }
    
    // ==================== CURSOS ====================
    console.log('📚 Creando cursos...');
    for (const course of courses) {
      await session.run(`
        CREATE (c:Course {
          course_id: $cid,
          language_from: $from,
          language_to: $to
        })
      `, {
        cid: course,
        from: course.substring(3),
        to: course.substring(0, 2)
      });
    }
    
    // ==================== SKILLS ====================
    console.log('🎯 Creando skills...');
    for (const course of courses) {
      for (const skill of skillsData[course]) {
        await session.run(`
          CREATE (s:Skill {
            skill_id: $sid,
            name: $name,
            area: 'grammar',
            course: $course
          })
        `, {
          sid: `${course}_${skill}`,
          name: skill,
          course: course
        });
      }
    }
    
    // ==================== LECCIONES ====================
    console.log('📝 Creando lecciones...');
    let lessonCounter = 1;
    for (const course of courses) {
      const skills = skillsData[course];
      for (let i = 0; i < skills.length; i++) {
        const skillName = skills[i];
        const skillDescription = skillDescriptions[skillName] || 'Lección de gramática y vocabulario.';
        
        const numLessons = Math.floor(Math.random() * 2) + 2;
        for (let j = 0; j < numLessons; j++) {
          const lessonNum = j + 1;
          let description = skillDescription;
          if (lessonNum > 1) {
            description = `${skillDescription} Parte ${lessonNum}: práctica avanzada y ejercicios.`;
          }
          
          await session.run(`
            CREATE (l:Lesson {
              lesson_id: $lid,
              course_id: $cid,
              unit_id: $uid,
              topic: $topic,
              difficulty: $diff,
              description: $description
            })
          `, {
            lid: `L${lessonCounter++}`,
            cid: course,
            uid: `U${Math.floor(i / 2) + 1}`,
            topic: `${skillName}_${lessonNum}`,
            diff: Math.floor(Math.random() * 5) + 1,
            description: description
          });
        }
      }
    }
    
    // ==================== TAGS ====================
    console.log('🏷️  Creando tags...');
    for (const tag of tagsData) {
      await session.run(`
        CREATE (t:Tag {name: $tag})
      `, { tag });
    }
    
    // ==================== ACHIEVEMENTS ====================
    console.log('🏆 Creando achievements...');
    for (const achievement of achievementsData) {
      await session.run(`
        CREATE (a:Achievement {
          achievement_id: $aid,
          type: $type
        })
      `, {
        aid: achievement,
        type: achievement.replace('_', ' ')
      });
    }
    
    // ==================== RELACIÓN: ENROLLED_IN ====================
    console.log('🔗 Creando relaciones ENROLLED_IN...');
    for (let i = 1; i <= 50; i++) {
      const numCourses = Math.floor(Math.random() * 2) + 1;
      const shuffled = [...courses].sort(() => 0.5 - Math.random());
      const selectedCourses = shuffled.slice(0, numCourses);
      
      for (const course of selectedCourses) {
        await session.run(`
          MATCH (u:User {user_id: $uid}), (c:Course {course_id: $cid})
          CREATE (u)-[:ENROLLED_IN]->(c)
        `, { uid: `u${i}`, cid: course });
      }
    }
    
    // ==================== RELACIÓN: TEACHES ====================
    console.log('🔗 Creando relaciones TEACHES (Lesson -> Skill)...');
    const lessons = await session.run(`
      MATCH (l:Lesson) 
      RETURN l.lesson_id as lid, l.course_id as cid, l.topic as topic
    `);
    
    for (const record of lessons.records) {
      const lid = record.get('lid');
      const cid = record.get('cid');
      const topic = record.get('topic');
      
      const skillBase = topic.split('_')[0];
      const sid = `${cid}_${skillBase}`;
      
      await session.run(`
        MATCH (l:Lesson {lesson_id: $lid}), (s:Skill {skill_id: $sid})
        MERGE (l)-[:TEACHES]->(s)
      `, { lid, sid });
    }
    
    // ==================== RELACIÓN: COMPLETED ====================
    console.log('🔗 Creando relaciones COMPLETED...');
    for (let i = 1; i <= 50; i++) {
      const userCourses = await session.run(`
        MATCH (u:User {user_id: $uid})-[:ENROLLED_IN]->(c:Course)
        RETURN c.course_id as cid
      `, { uid: `u${i}` });
      
      for (const courseRecord of userCourses.records) {
        const cid = courseRecord.get('cid');
        
        const courseLessons = await session.run(`
          MATCH (l:Lesson {course_id: $cid})
          RETURN l.lesson_id as lid
          ORDER BY rand()
          LIMIT ${Math.floor(Math.random() * 5) + 2}
        `, { cid });
        
        for (const lessonRecord of courseLessons.records) {
          const lid = lessonRecord.get('lid');
          
          await session.run(`
            MATCH (u:User {user_id: $uid}), (l:Lesson {lesson_id: $lid})
            CREATE (u)-[:COMPLETED {
              score: $score,
              attempts: $attempts,
              last_completed_at: datetime()
            }]->(l)
          `, {
            uid: `u${i}`,
            lid,
            score: Math.round((Math.random() * 0.4 + 0.6) * 100) / 100,
            attempts: Math.floor(Math.random() * 3) + 1
          });
        }
      }
    }
    
    // ==================== RELACIÓN: STRUGGLES_WITH ====================
    console.log('🔗 Creando relaciones STRUGGLES_WITH...');
    for (let i = 1; i <= 50; i++) {
      if (Math.random() < 0.6) {
        const userCourses = await session.run(`
          MATCH (u:User {user_id: $uid})-[:ENROLLED_IN]->(c:Course)
          RETURN c.course_id as cid
          LIMIT 1
        `, { uid: `u${i}` });
        
        if (userCourses.records.length > 0) {
          const cid = userCourses.records[0].get('cid');
          const courseSkills = await session.run(`
            MATCH (s:Skill {course: $cid})
            RETURN s.skill_id as sid
            ORDER BY rand()
            LIMIT ${Math.floor(Math.random() * 3) + 1}
          `, { cid });
          
          for (const skillRecord of courseSkills.records) {
            const sid = skillRecord.get('sid');
            await session.run(`
              MATCH (u:User {user_id: $uid}), (s:Skill {skill_id: $sid})
              CREATE (u)-[:STRUGGLES_WITH {weight: $w}]->(s)
            `, 
            {
              uid: `u${i}`,
              sid,
              w: Math.round((Math.random() * 0.5 + 0.5) * 100) / 100 // 0.5 a 1.0
            });
          }
        }
      }
    }
    
    // ==================== RELACIÓN: SIMILAR_TO ====================
    console.log('🔗 Creando relaciones SIMILAR_TO entre lecciones...');
    for (const course of courses) {
      const courseLessons = await session.run(`
        MATCH (l:Lesson {course_id: $cid})
        RETURN l.lesson_id as lid
      `, { cid: course });
      
      const lessonIds = courseLessons.records.map(r => r.get('lid'));
      
      for (let i = 0; i < Math.min(10, lessonIds.length); i++) {
        const l1 = lessonIds[Math.floor(Math.random() * lessonIds.length)];
        let l2 = lessonIds[Math.floor(Math.random() * lessonIds.length)];
        
        if (l1 !== l2) {
          await session.run(`
            MATCH (l1:Lesson {lesson_id: $l1}), (l2:Lesson {lesson_id: $l2})
            MERGE (l1)-[:SIMILAR_TO {weight: $w, source: 'coocurrencia_errores'}]->(l2)
          `, {
            l1, l2,
            w: Math.round((Math.random() * 0.4 + 0.5) * 100) / 100 // 0.5 a 0.9
          });
        }
      }
    }
    
    // ==================== RELACIÓN: TAGGED_AS ====================
    console.log('🔗 Creando relaciones TAGGED_AS...');
    const allLessons = await session.run(`MATCH (l:Lesson) RETURN l.lesson_id as lid, l.difficulty as diff`);
    
    for (const record of allLessons.records) {
      const lid = record.get('lid');
      const diff = record.get('diff');
      
      let difficultyTag = 'beginner';
      if (diff >= 4) difficultyTag = 'advanced';
      else if (diff >= 2) difficultyTag = 'intermediate';
      
      await session.run(`
        MATCH (l:Lesson {lesson_id: $lid}), (t:Tag {name: $tag})
        CREATE (l)-[:TAGGED_AS]->(t)
      `, { lid, tag: difficultyTag });
      
      await session.run(`
        MATCH (l:Lesson {lesson_id: $lid}), (t:Tag {name: 'grammar'})
        CREATE (l)-[:TAGGED_AS]->(t)
      `, { lid });
    }
    
    // ==================== RELACIÓN: FRIEND_WITH ====================
    console.log('🔗 Creando relaciones FRIEND_WITH...');
    for (let i = 0; i < 60; i++) {
      const u1 = Math.floor(Math.random() * 50) + 1;
      let u2 = Math.floor(Math.random() * 50) + 1;
      while (u2 === u1) u2 = Math.floor(Math.random() * 50) + 1;
      
      await session.run(`
        MATCH (u1:User {user_id: $u1}), (u2:User {user_id: $u2})
        MERGE (u1)-[:FRIEND_WITH]-(u2)
      `, { u1: `u${u1}`, u2: `u${u2}` });
    }
    
    // ==================== RELACIÓN: UNLOCKED ====================
    console.log('🔗 Creando relaciones UNLOCKED...');
    for (let i = 1; i <= 50; i++) {
      const numAchievements = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...achievementsData].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, numAchievements);
      
      for (const achievement of selected) {
        await session.run(`
          MATCH (u:User {user_id: $uid}), (a:Achievement {achievement_id: $aid})
          CREATE (u)-[:UNLOCKED]->(a)
        `, { uid: `u${i}`, aid: achievement });
      }
    }
    
    // ==================== ESTADÍSTICAS ====================
    const stats = {
      users: await session.run('MATCH (u:User) RETURN count(u) as c'),
      courses: await session.run('MATCH (c:Course) RETURN count(c) as c'),
      lessons: await session.run('MATCH (l:Lesson) RETURN count(l) as c'),
      skills: await session.run('MATCH (s:Skill) RETURN count(s) as c'),
      tags: await session.run('MATCH (t:Tag) RETURN count(t) as c'),
      achievements: await session.run('MATCH (a:Achievement) RETURN count(a) as c'),
      enrollments: await session.run('MATCH ()-[r:ENROLLED_IN]->() RETURN count(r) as c'),
      completed: await session.run('MATCH ()-[r:COMPLETED]->() RETURN count(r) as c'),
      struggles: await session.run('MATCH ()-[r:STRUGGLES_WITH]->() RETURN count(r) as c'),
      teaches: await session.run('MATCH ()-[r:TEACHES]->() RETURN count(r) as c'),
      similar: await session.run('MATCH ()-[r:SIMILAR_TO]->() RETURN count(r) as c'),
      tagged: await session.run('MATCH ()-[r:TAGGED_AS]->() RETURN count(r) as c'),
      friendships: await session.run('MATCH ()-[r:FRIEND_WITH]-() RETURN count(r) as c'),
      unlocked: await session.run('MATCH ()-[r:UNLOCKED]->() RETURN count(r) as c')
    };
    
    console.log('\n BASE DE DATOS POBLADA:');
    console.log('═══════════════════════════════════════');
    console.log('NODOS:');
    console.log(`  Usuarios:      ${stats.users.records[0].get('c')}`);
    console.log(`  Cursos:        ${stats.courses.records[0].get('c')}`);
    console.log(`  Lecciones:     ${stats.lessons.records[0].get('c')}`);
    console.log(`  Skills:        ${stats.skills.records[0].get('c')}`);
    console.log(`  Tags:          ${stats.tags.records[0].get('c')}`);
    console.log(`  Achievements:  ${stats.achievements.records[0].get('c')}`);
    console.log('\nRELACIONES:');
    console.log(`  ENROLLED_IN:   ${stats.enrollments.records[0].get('c')}`);
    console.log(`  COMPLETED:     ${stats.completed.records[0].get('c')}`);
    console.log(`  STRUGGLES_WITH: ${stats.struggles.records[0].get('c')}`);
    console.log(`  TEACHES:       ${stats.teaches.records[0].get('c')}`);
    console.log(`  SIMILAR_TO:    ${stats.similar.records[0].get('c')}`);
    console.log(`  TAGGED_AS:     ${stats.tagged.records[0].get('c')}`);
    console.log(`  FRIEND_WITH:   ${stats.friendships.records[0].get('c').toNumber() / 2}`);
    console.log(`  UNLOCKED:      ${stats.unlocked.records[0].get('c')}`);
    console.log('═══════════════════════════════════════');
    console.log('\n ¡Base de datos completamente poblada!');
    
  } catch (error) {
    console.error(' Error:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();