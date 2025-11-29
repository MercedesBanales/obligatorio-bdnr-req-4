const { esClient } = require('./db-elasticsearch');

const threadTemplates = {
  spanish: [
    {
      title: "¿Cuándo usar 'ser' y cuándo 'estar'?",
      tags: ["grammar", "beginner", "verbs"],
      initialPost: "Siempre me confundo con estos dos verbos. ¿Pueden explicarme las diferencias básicas?"
    },
    {
      title: "Subjuntivo: ¿pesadilla o cuestión de práctica?",
      tags: ["grammar", "intermediate", "subjunctive"],
      initialPost: "He estudiado las reglas del subjuntivo pero aún me cuesta usarlo naturalmente en conversaciones..."
    },
    {
      title: "Diferencia entre pretérito e imperfecto",
      tags: ["grammar", "intermediate", "past-tenses"],
      initialPost: "Necesito ayuda para entender cuándo usar cada uno. Ejemplos prácticos serían geniales."
    },
    {
      title: "Palabras falsas amigas español-inglés",
      tags: ["vocabulary", "beginner"],
      initialPost: "Comparto una lista de palabras que parecen iguales en inglés pero significan otra cosa en español."
    },
    {
      title: "Mejorar pronunciación de la 'r' española",
      tags: ["pronunciation", "intermediate"],
      initialPost: "Como angloparlante, la 'r' fuerte española me resulta muy difícil. Tips?"
    }
  ],
  french: [
    {
      title: "Passé composé avec être ou avoir?",
      tags: ["grammar", "intermediate", "verbs"],
      initialPost: "Comment savoir quel auxiliaire utiliser? Y a-t-il une règle simple?"
    },
    {
      title: "Les articles: le/la/les/un/une/des",
      tags: ["grammar", "beginner"],
      initialPost: "Je ne comprends pas quand utiliser les articles définis vs indéfinis..."
    },
    {
      title: "Prononciation du 'r' français",
      tags: ["pronunciation", "beginner"],
      initialPost: "Le 'r' guttural français est très difficile pour moi. Des exercices?"
    },
    {
      title: "Expressions idiomatiques françaises",
      tags: ["vocabulary", "intermediate", "culture"],
      initialPost: "Partagez vos expressions françaises préférées avec leurs significations!"
    }
  ],
  german: [
    {
      title: "Los 4 casos alemanes explicados",
      tags: ["grammar", "intermediate", "cases"],
      initialPost: "Nominativo, acusativo, dativo, genitivo... ¿Alguien puede explicarlos con ejemplos simples?"
    },
    {
      title: "Verbos separables: ¿cómo funcionan?",
      tags: ["grammar", "beginner", "verbs"],
      initialPost: "No entiendo por qué el prefijo se separa del verbo. Ejemplos: aufstehen, einkaufen..."
    },
    {
      title: "Orden de palabras en alemán",
      tags: ["grammar", "intermediate", "word-order"],
      initialPost: "La posición del verbo en la frase me confunde mucho, especialmente en subordinadas."
    },
    {
      title: "Artículos: der/die/das ¿hay lógica?",
      tags: ["grammar", "beginner"],
      initialPost: "¿Existe algún patrón para saber el género de los sustantivos o hay que memorizarlos todos?"
    }
  ],
  english: [
    {
      title: "Phrasal verbs más comunes",
      tags: ["vocabulary", "intermediate"],
      initialPost: "Estoy haciendo una lista de phrasal verbs esenciales. ¿Cuáles agregarían?"
    },
    {
      title: "Diferencia entre present perfect y simple past",
      tags: ["grammar", "intermediate", "verbs"],
      initialPost: "Sé la teoría pero no sé cuándo usarlos en conversaciones reales."
    },
    {
      title: "Pronunciación de 'th' en inglés",
      tags: ["pronunciation", "beginner"],
      initialPost: "Mi lengua no coopera con este sonido. ¿Trucos para practicarlo?"
    }
  ]
};

const responseTemplates = [
  "La diferencia principal está en que...",
  "Según mi experiencia, lo que me ayudó fue...",
  "Existe una regla mnemotécnica: piensa en...",
  "Te recomiendo estos recursos que me sirvieron mucho:",
  "Yo tuve el mismo problema. Lo que hice fue...",
  "Una forma de recordarlo es asociarlo con...",
  "No te preocupes, es super común confundirse con esto al principio.",
  "Practicar con ejemplos reales ayuda mucho. Por ejemplo:",
  "Mira este video que explica el tema muy bien:",
  "En mi caso, mejoré cuando empecé a..."
];

const userNames = [
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

async function createIndices() {
  try {
    await esClient.indices.delete({ index: 'threads', ignore_unavailable: true });
    await esClient.indices.delete({ index: 'posts', ignore_unavailable: true });
  } catch (error) {
    // Ignorar errores si no existen
  }

  await esClient.indices.create({
    index: 'threads',
    body: {
      mappings: {
        properties: {
          thread_id: { type: 'keyword' },
          title: { 
            type: 'text',
            analyzer: 'standard',
            fields: {
              keyword: { type: 'keyword' }
            }
          },
          language: { type: 'keyword' },
          tags: { type: 'keyword' },
          author_id: { type: 'keyword' },
          author_name: { type: 'keyword' },
          created_at: { type: 'date' },
          updated_at: { type: 'date' },
          last_activity_at: { type: 'date' },
          reply_count: { type: 'integer' },
          view_count: { type: 'integer' },
          initial_post: {
            type: 'text',
            analyzer: 'standard'
          }
        }
      }
    }
  });

  await esClient.indices.create({
    index: 'posts',
    body: {
      mappings: {
        properties: {
          post_id: { type: 'keyword' },
          thread_id: { type: 'keyword' },
          author_id: { type: 'keyword' },
          author_name: { type: 'keyword' },
          content: {
            type: 'text',
            analyzer: 'standard'
          },
          created_at: { type: 'date' },
          edited_at: { type: 'date' },
          votes: { type: 'integer' },
          is_solution: { type: 'boolean' },
          reports: { type: 'integer' }
        }
      }
    }
  });

  console.log('✅ Índices creados con mappings');
}

async function seedThreads() {
  const threads = [];
  let threadCounter = 1;
  
  const languages = Object.keys(threadTemplates);
  
  for (const lang of languages) {
    const templates = threadTemplates[lang];
    
    for (const template of templates) {
      const authorIdx = Math.floor(Math.random() * userNames.length);
      const daysAgo = Math.floor(Math.random() * 180); // Últimos 6 meses
      const createdDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      
      const thread = {
        thread_id: `t${threadCounter++}`,
        title: template.title,
        language: lang === 'spanish' ? 'es' : lang === 'french' ? 'fr' : lang === 'german' ? 'de' : 'en',
        tags: template.tags,
        author_id: `u${authorIdx + 1}`,
        author_name: userNames[authorIdx],
        created_at: createdDate.toISOString(),
        updated_at: new Date(Date.now() - Math.floor(daysAgo * 0.5) * 24 * 60 * 60 * 1000).toISOString(),
        last_activity_at: new Date(Date.now() - Math.floor(daysAgo * 0.3) * 24 * 60 * 60 * 1000).toISOString(),
        reply_count: Math.floor(Math.random() * 25),
        view_count: Math.floor(Math.random() * 490) + 10,
        initial_post: template.initialPost
      };
      
      threads.push(thread);
    }
  }
  
  const body = threads.flatMap(doc => [
    { index: { _index: 'threads', _id: doc.thread_id } },
    doc
  ]);
  
  await esClient.bulk({ refresh: true, body });
  console.log(`✅ ${threads.length} hilos creados`);
  
  return threads;
}

async function seedPosts(threads) {
  const posts = [];
  let postCounter = 1;
  
  for (const thread of threads) {
    const numReplies = thread.reply_count;
    
    for (let i = 0; i < numReplies; i++) {
      const authorIdx = Math.floor(Math.random() * userNames.length);
      const hoursAfterThread = Math.floor(Math.random() * 48 * (i + 1));
      const createdDate = new Date(new Date(thread.created_at).getTime() + hoursAfterThread * 60 * 60 * 1000);
      
      const post = {
        post_id: `p${postCounter++}`,
        thread_id: thread.thread_id,
        author_id: `u${authorIdx + 1}`,
        author_name: userNames[authorIdx],
        content: responseTemplates[Math.floor(Math.random() * responseTemplates.length)],
        created_at: createdDate.toISOString(),
        votes: Math.floor(Math.random() * 18) - 2,
        is_solution: i === 0 && Math.random() > 0.7,
        reports: Math.random() > 0.95 ? 1 : 0
      };
      
      posts.push(post);
    }
  }
  
  if (posts.length > 0) {
    const body = posts.flatMap(doc => [
      { index: { _index: 'posts', _id: doc.post_id } },
      doc
    ]);
    
    await esClient.bulk({ refresh: true, body });
    console.log(`✅ ${posts.length} mensajes creados`);
  }
}

async function seed() {
  try {
    console.log('🗑️  Eliminando índices existentes...');
    console.log('📝 Creando índices con mappings...');
    await createIndices();
    
    console.log('👥 Poblando hilos...');
    const threads = await seedThreads();
    
    console.log('💬 Poblando mensajes...');
    await seedPosts(threads);
    
    const threadsCount = await esClient.count({ index: 'threads' });
    const postsCount = await esClient.count({ index: 'posts' });
    
    console.log('\n═══════════════════════════════════════');
    console.log('ELASTICSEARCH POBLADO:');
    console.log('═══════════════════════════════════════');
    console.log(`Hilos:    ${threadsCount.count}`);
    console.log(`Mensajes: ${postsCount.count}`);
    console.log('═══════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await esClient.close();
  }
}

seed();