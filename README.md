# Duolingo BDNR - Plataforma de Aprendizaje

## 📋 Descripción

Plataforma completa de aprendizaje de idiomas implementada con **Node.js + Express**, **Neo4j** (base de datos de grafos) y **Elasticsearch** (búsqueda y foros).

**Obligatorio 2 - Bases de Datos No Relacionales**

### 🏗️ Arquitectura del Sistema

La plataforma está dividida en **dos subsistemas independientes**:

#### **Subsistema 1: Motor de Recomendaciones (Neo4j)**
- **Base de datos:** Neo4j (grafos)
- **Servidor:** `server-neo4j.js` (puerto 3000)
- **Funcionalidad:** Sistema de recomendaciones inteligente
  - Recomendaciones por dificultad detectada
  - Recomendaciones colaborativas (usuarios similares)
  - Recomendaciones sociales (amigos activos)
  - Red de amigos (hasta 2 grados)
  - Contenido similar

#### **Subsistema 2: Foros y Comunidad (Elasticsearch)**
- **Base de datos:** Elasticsearch (búsqueda full-text)
- **Servidor:** `server-elasticsearch.js` (puerto 3002)
- **Funcionalidad:** Sistema de foros y comunidad
  - Hilos de discusión por idioma
  - Búsqueda full-text avanzada
  - Comentarios y respuestas
  - Sistema de votos y soluciones aceptadas
  - Hilos trending y filtros por idioma/tags

### ✨ Características Generales

- **Backend REST API** con Express.js (dos servidores independientes)
- **Base de datos Neo4j** (grafos) - Motor de recomendaciones
- **Base de datos Elasticsearch** - Foros y búsqueda
- **Frontend moderno** con Vite + React + Tailwind CSS
- **Navegación integrada** entre ambos subsistemas

---

## 🛠️ Requisitos Previos

### 1. Node.js y npm

Verifica que tengas Node.js instalado:

```bash
node --version
npm --version
```

Si no lo tienes, descárgalo de [nodejs.org](https://nodejs.org/)

### 2. Neo4j Desktop (Subsistema 1)

1. Descarga **Neo4j Desktop** desde [neo4j.com/download](https://neo4j.com/download/)
2. Instala y abre Neo4j Desktop
3. Crea un nuevo proyecto
4. Crea una nueva base de datos (DBMS):
   - **Name:** duolingo-recommendations
   - **Password:** (elige una contraseña, ej: "password123")
   - **Version:** 5.x o superior
5. **Inicia la base de datos** (botón Start)

### 3. Docker (Subsistema 2)

Necesitas Docker instalado para ejecutar Elasticsearch y Kibana:

1. Descarga **Docker Desktop** desde [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. Instala y abre Docker Desktop
3. Verifica que Docker esté corriendo (ícono de Docker en la barra de tareas)

---

## 📦 Instalación

### Paso 1: Descomprimir el proyecto

Descomprime el archivo ZIP y abre la terminal en la carpeta `motor-recomendaciones-neo4j`.

### Paso 2: Instalar dependencias del backend

```bash
cd backend
npm install
```

Esto instalará:
- `express` - Framework web
- `neo4j-driver` - Driver de Neo4j (Subsistema 1)
- `@elastic/elasticsearch` - Cliente de Elasticsearch (Subsistema 2)
- `cors` - Para permitir requests del frontend
- `dotenv` - Variables de entorno
- `nodemon` - Auto-reload en desarrollo

### Paso 3: Configurar variables de entorno

Abre el archivo `backend/.env` (o créalo si no existe) y completa la configuración:

```env
# Subsistema 1: Neo4j (Recomendaciones)
NEO4J_URI=neo4j://127.0.0.1:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=tu-password-aqui    # ← CAMBIA ESTO
PORT=3000

# Subsistema 2: Elasticsearch (Foros)
ELASTICSEARCH_URL=http://localhost:9200
PORT_ES=3002
```

**⚠️ IMPORTANTE:** 
- Reemplaza `tu-password-aqui` con la contraseña que configuraste en Neo4j Desktop.
- El puerto 3000 es para el servidor de Neo4j
- El puerto 3002 es para el servidor de Elasticsearch

---

## 🚀 Ejecución

### Paso 1: Iniciar Elasticsearch y Kibana (Subsistema 2)

Abre una terminal en la carpeta `backend` y ejecuta:

```bash
cd backend
docker-compose up -d
```

Esto iniciará:
- **Elasticsearch** en `http://localhost:9200`
- **Kibana** en `http://localhost:5601`

Verifica que estén corriendo:

```bash
docker-compose ps
```

Deberías ver ambos servicios como "Up".

### Paso 2: Poblar las bases de datos (SOLO LA PRIMERA VEZ)

#### 2.1. Poblar Neo4j (Subsistema 1)

Este script crea 50 usuarios, 3 cursos, skills y todas las relaciones:

```bash
cd backend
npm run seed:neo4j
```

Verás algo como:

```
✅ Base de datos limpia
👥 Creando 50 usuarios...
📚 Creando cursos y skills...
🔗 Creando relaciones ENROLLED_IN...
🔗 Creando relaciones STRUGGLES_WITH...
🔗 Creando relaciones FRIEND_WITH...

📊 DATOS CREADOS:
  👥 Usuarios: 50
  📚 Cursos: 3
  🎯 Skills: 13

✅ Base de datos poblada exitosamente!
```

#### 2.2. Poblar Elasticsearch (Subsistema 2)

Este script crea hilos de discusión, posts y datos de foros:

```bash
cd backend
npm run seed:es
```

Verás algo como:

```
✅ Índices creados con mappings
👥 Poblando hilos...
✅ 20 hilos creados
💬 Poblando mensajes...
✅ 150 mensajes creados

═══════════════════════════════════════
ELASTICSEARCH POBLADO:
═══════════════════════════════════════
Hilos:    20
Mensajes: 150
═══════════════════════════════════════
```

### Paso 3: Iniciar los servidores backend

Necesitas **dos terminales** para correr ambos servidores:

#### Terminal 1: Servidor Neo4j (Recomendaciones)

```bash
cd backend
npm run start:neo4j
```

El servidor correrá en **http://localhost:3000**

Verás:

```
✅ Conexión exitosa
📍 Conectado a Neo4j en: neo4j://127.0.0.1:7687
🚀 Servidor corriendo en http://localhost:3000
```

#### Terminal 2: Servidor Elasticsearch (Foros)

```bash
cd backend
npm run start:es
```

El servidor correrá en **http://localhost:3002**

Verás:

```
============================================================
🚀 FOROS Y COMUNIDAD - ELASTICSEARCH
============================================================
📍 Servidor: http://localhost:3002
🏥 Health:   http://localhost:3002/health
============================================================
```

### Paso 4: Iniciar el frontend

Abre **una tercera terminal** y ve a la carpeta frontend:

```bash
cd frontend
npm install  # Solo la primera vez
npm run dev
```

El frontend correrá en **http://localhost:5173**

Verás:

```
  VITE v4.4.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Abre tu navegador en **http://localhost:5173**

**✅ Listo! La aplicación está corriendo.**

### 📝 Resumen de Puertos

- **Frontend:** http://localhost:5173
- **Backend Neo4j (Recomendaciones):** http://localhost:3000
- **Backend Elasticsearch (Foros):** http://localhost:3002
- **Elasticsearch API:** http://localhost:9200
- **Kibana Dashboard:** http://localhost:5601

---

## 📡 API REST - Endpoints

### Subsistema 1: Recomendaciones (Neo4j)

Base URL: `http://localhost:3000/api`

#### Usuarios

- **GET** `/users` - Listar todos los usuarios
- **GET** `/users/:userId` - Obtener un usuario específico

#### Recomendaciones

- **GET** `/recommendations/struggles/:userId` - Recomendaciones por dificultad
- **GET** `/recommendations/collaborative/:userId` - Usuarios con dificultades similares
- **GET** `/recommendations/social/:userId` - Amigos más activos
- **GET** `/network/:userId` - Red social del usuario

#### Cursos

- **GET** `/courses` - Listar cursos disponibles
- **GET** `/courses/:courseId/skills` - Skills de un curso

#### Estadísticas

- **GET** `/stats` - Estadísticas generales del sistema

#### Health Check

- **GET** `/health` - Verificar estado del servidor

---

### Subsistema 2: Foros y Comunidad (Elasticsearch)

Base URL: `http://localhost:3002/api`

#### Búsqueda y Exploración

- **GET** `/threads/search` - Búsqueda de hilos
  - Query params:
    - `q` - Término de búsqueda (opcional)
    - `language` - Filtrar por idioma: `es`, `fr`, `de`, `en` (opcional)
    - `tags` - Filtrar por tags separados por coma (opcional)
    - `sort` - Orden: `relevance` (default), `recent`, `popular` (opcional)
    - `from` - Paginación: offset (default: 0)
    - `size` - Cantidad de resultados (default: 20)
  - Ejemplo: `/api/threads/search?q=subjuntivo&language=es&sort=recent`

- **GET** `/threads/trending` - Hilos trending (últimos 7 días)
  - Query params:
    - `language` - Filtrar por idioma (opcional)
    - `limit` - Cantidad de resultados (default: 20)
  - Ejemplo: `/api/threads/trending?limit=10`

- **GET** `/threads/:threadId` - Obtener un hilo específico con sus posts
  - Incrementa automáticamente el contador de vistas
  - Retorna el hilo y todos sus posts ordenados por:
    1. Soluciones aceptadas primero
    2. Más votados
    3. Más antiguos primero

#### Estadísticas

- **GET** `/stats/languages` - Estadísticas por idioma
  - Retorna cantidad de hilos y promedio de respuestas por idioma

- **GET** `/stats/tags` - Top 15 tags más usados
  - Retorna tags con su frecuencia

#### Health Check

- **GET** `/health` - Verificar estado del servidor de Elasticsearch

---

## 🧪 Probar la API

### Subsistema 1: Recomendaciones (Neo4j)

#### Con curl (Terminal)

```bash
# Obtener todos los usuarios
curl http://localhost:3000/api/users

# Recomendaciones por dificultad para usuario u1
curl http://localhost:3000/api/recommendations/struggles/u1

# Recomendaciones colaborativas
curl http://localhost:3000/api/recommendations/collaborative/u1

# Estadísticas generales
curl http://localhost:3000/api/stats
```

#### Con el navegador

Abre directamente las URLs:

- http://localhost:3000/api/users
- http://localhost:3000/api/stats
- http://localhost:3000/api/recommendations/struggles/u1

---

### Subsistema 2: Foros (Elasticsearch)

#### Con curl (Terminal)

```bash
# Buscar todos los hilos
curl http://localhost:3002/api/threads/search?size=10

# Buscar hilos por término
curl http://localhost:3002/api/threads/search?q=subjuntivo

# Hilos trending
curl http://localhost:3002/api/threads/trending?limit=5

# Obtener un hilo específico
curl http://localhost:3002/api/threads/t1

# Estadísticas por idioma
curl http://localhost:3002/api/stats/languages

# Top tags
curl http://localhost:3002/api/stats/tags
```

#### Con el navegador

Abre directamente las URLs:

- http://localhost:3002/api/threads/search?size=10
- http://localhost:3002/api/threads/trending
- http://localhost:3002/api/stats/languages
- http://localhost:3002/api/stats/tags

---

## 🎯 Uso del Frontend

El frontend tiene **dos secciones principales** accesibles desde la navegación superior:

### Sección 1: Recomendaciones (Neo4j)

1. **Visualizar estadísticas generales** (arriba)
2. **Seleccionar un usuario** haciendo click en una tarjeta
3. **Ver recomendaciones** en las pestañas:
   - **Por Dificultad:** Skills donde tiene problemas
   - **Colaborativas:** Usuarios similares para estudiar juntos
   - **Sociales:** Amigos activos para motivarse
   - **Red de Amigos:** Conexiones directas e indirectas
4. **Explorar cursos** disponibles en la parte inferior

### Sección 2: Foros y Comunidad (Elasticsearch)

1. **Navegar a "Foros y Comunidad"** desde el menú superior
2. **Explorar hilos** con filtros:
   - **Todos:** Todos los hilos disponibles
   - **Trending:** Hilos más activos en los últimos 7 días
   - **Recientes:** Hilos ordenados por fecha de última actividad
3. **Buscar hilos** por término, idioma o tags
4. **Abrir un hilo** para ver:
   - Detalles completos del hilo
   - Todas las respuestas y comentarios
   - Sistema de votos
   - Soluciones aceptadas destacadas
5. **Navegar entre hilos** usando el botón "Volver a la lista"

---

## 🗄️ Estructura del Proyecto

```
obligatorio-req-4/
├── backend/
│   ├── package.json              # Dependencias del proyecto
│   ├── .env                      # Configuración de conexión (Neo4j + Elasticsearch)
│   ├── docker-compose.yml        # Configuración de Docker (Elasticsearch + Kibana)
│   │
│   ├── # Subsistema 1: Recomendaciones (Neo4j)
│   ├── server-neo4j.js           # Servidor Express para Neo4j (puerto 3000)
│   ├── db-neo4j.js               # Conexión a Neo4j
│   ├── seed-neo4j.js             # Script para poblar Neo4j
│   │
│   └── # Subsistema 2: Foros (Elasticsearch)
│       ├── server-elasticsearch.js  # Servidor Express para Elasticsearch (puerto 3002)
│       ├── db-elasticsearch.js      # Conexión a Elasticsearch
│       └── seed-elasticsearch.js    # Script para poblar Elasticsearch
│
└── frontend/
    ├── package.json              # Dependencias de React
    ├── vite.config.js            # Configuración de Vite
    ├── index.html                # HTML principal
    └── src/
        ├── main.jsx              # Entry point
        ├── App.jsx               # Componente principal (navegación entre subsistemas)
        ├── index.css             # Estilos globales + Tailwind
        └── components/
            ├── # Componentes compartidos
            ├── Header.jsx        # Header principal
            ├── Navigation.jsx    # Navegación entre subsistemas
            ├── Modal.jsx         # Modal para recomendaciones
            │
            ├── # Subsistema 1: Recomendaciones
            ├── Stats.jsx         # Estadísticas generales
            ├── UsersList.jsx      # Lista de usuarios
            ├── Recommendations.jsx  # Panel de recomendaciones
            └── Courses.jsx        # Lista de cursos
            │
            └── # Subsistema 2: Foros
                ├── ThreadList.jsx    # Lista de hilos de discusión
                └── ThreadDetail.jsx  # Detalle de un hilo con posts
```

---

## 🔍 Visualizar los Datos

### Subsistema 1: Visualizar el Grafo en Neo4j Browser

Neo4j Desktop incluye un navegador para visualizar el grafo:

1. En Neo4j Desktop, click en **"Open"** → **"Neo4j Browser"**
2. Ejecuta queries Cypher:

#### Ver el grafo completo (limitado)
```cypher
MATCH (n)
RETURN n
LIMIT 100
```

#### Ver un usuario y sus conexiones
```cypher
MATCH (u:User {user_id: 'u1'})-[r]->(n)
RETURN u, r, n
LIMIT 25
```

#### Ver usuarios con dificultades similares
```cypher
MATCH (u1:User)-[:STRUGGLES_WITH]->(s:Skill)<-[:STRUGGLES_WITH]-(u2:User)
WHERE u1.user_id = 'u1' AND u1 <> u2
RETURN u1, s, u2
LIMIT 10
```

#### Ver red de amigos
```cypher
MATCH path = (u1:User {user_id: 'u1'})-[:FRIEND_WITH*1..2]-(u2:User)
RETURN path
LIMIT 20
```

---

### Subsistema 2: Visualizar Datos en Kibana

Kibana es la interfaz visual para explorar datos de Elasticsearch:

1. Abre tu navegador y ve a: **http://localhost:5601**
2. Ve a **Discover** (menú izquierdo)
3. Crea un **Data View**:
   - Index pattern: `threads`
   - Time field: `created_at`
4. Ahora verás todos los hilos en una tabla interactiva
5. Puedes buscar, filtrar y explorar los datos

#### Ver datos directamente en Elasticsearch

```bash
# Ver todos los hilos
curl http://localhost:9200/threads/_search?pretty

# Contar hilos
curl http://localhost:9200/threads/_count?pretty

# Ver un hilo específico
curl http://localhost:9200/threads/_doc/t1?pretty
```

**📖 Para más detalles, consulta:** `ELASTICSEARCH_VIEW_DATA.md`

---

## 🛑 Detener los Servidores

### Detener servidores backend

Presiona **Ctrl + C** en cada terminal donde corren los servidores:
- Terminal 1: Servidor Neo4j (puerto 3000)
- Terminal 2: Servidor Elasticsearch (puerto 3002)

### Detener Elasticsearch y Kibana (Docker)

```bash
cd backend
docker-compose down
```

Para detener y eliminar los volúmenes (borra los datos):

```bash
docker-compose down -v
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to Neo4j"

1. Verifica que Neo4j Desktop esté corriendo (botón "Start" debe estar activo)
2. Revisa que el password en `.env` sea correcto
3. Confirma que el puerto sea 7687 (default de Neo4j)

### Error: "Cannot connect to Elasticsearch"

1. Verifica que Docker esté corriendo
2. Verifica que los contenedores estén activos:
   ```bash
   cd backend
   docker-compose ps
   ```
3. Si no están corriendo, inícialos:
   ```bash
   docker-compose up -d
   ```
4. Verifica que Elasticsearch responda:
   ```bash
   curl http://localhost:9200
   ```

### Error: "EADDRINUSE: address already in use"

El puerto ya está ocupado. Verifica qué proceso lo está usando:

```bash
# Para puerto 3000 (Neo4j)
lsof -i :3000

# Para puerto 3002 (Elasticsearch)
lsof -i :3002
```

O cambia el puerto en `.env` y actualiza las URLs correspondientes.

### Error: "Failed to fetch" en el frontend

1. Asegúrate de que **ambos servidores backend** estén corriendo:
   - Servidor Neo4j en puerto 3000
   - Servidor Elasticsearch en puerto 3002
2. Verifica las URLs en `frontend/src/App.jsx`:
   - `API_NEO4J = 'http://localhost:3000/api'`
   - Los componentes de foros usan `http://localhost:3002/api`
3. Revisa la consola del navegador (F12) para más detalles

### La base de datos está vacía

Ejecuta los scripts de seed correspondientes:

```bash
cd backend

# Para Neo4j (Subsistema 1)
npm run seed:neo4j

# Para Elasticsearch (Subsistema 2)
npm run seed:es
```

### Docker no inicia Elasticsearch

1. Verifica que Docker Desktop esté corriendo
2. Verifica los logs:
   ```bash
   cd backend
   docker-compose logs elasticsearch
   ```
3. Si hay problemas de memoria, ajusta `ES_JAVA_OPTS` en `docker-compose.yml`

---

## 📊 Decisiones de Diseño

### Arquitectura de Dos Subsistemas

La plataforma está dividida en dos subsistemas independientes para aprovechar las fortalezas de cada base de datos:

#### Subsistema 1: Neo4j (Recomendaciones)

**¿Por qué Neo4j?**
- **Relaciones naturales:** Las recomendaciones se basan en conexiones entre usuarios, skills y cursos
- **Consultas de caminos:** Encontrar amigos de amigos es trivial con Cypher
- **Rendimiento:** Las consultas de grafo son muy rápidas (milisegundos)
- **Flexibilidad:** Fácil agregar nuevos tipos de relaciones

**Trade-offs:**
- **Consistencia eventual:** Neo4j no es ACID estricto
- **No es OLAP:** Para análisis masivos de datos, usar otra BD
- **Actualizaciones:** Modificar el grafo puede ser costoso a gran escala

#### Subsistema 2: Elasticsearch (Foros)

**¿Por qué Elasticsearch?**
- **Búsqueda full-text:** Búsqueda avanzada con fuzzy matching, highlighting, y relevancia
- **Escalabilidad:** Diseñado para búsquedas en grandes volúmenes de texto
- **Agregaciones:** Estadísticas y análisis en tiempo real (por idioma, tags, etc.)
- **Rendimiento:** Búsquedas complejas en milisegundos
- **Analizadores:** Soporte para múltiples idiomas y análisis de texto

**Trade-offs:**
- **Eventual consistency:** Los datos pueden no estar inmediatamente disponibles después de escritura
- **Recursos:** Requiere más memoria que bases de datos tradicionales
- **Complejidad:** Configuración de índices y mappings requiere conocimiento específico

### ¿Por qué REST API?

- **Separación de concerns:** Backend y frontend independientes
- **Escalabilidad:** El frontend puede ser React, Vue, mobile app, etc.
- **Testeable:** Fácil probar endpoints con curl o Postman
- **Dos servidores independientes:** Permite escalar cada subsistema según necesidad

---

## 📚 Recursos

### Subsistema 1: Neo4j
- [Neo4j Cypher Manual](https://neo4j.com/docs/cypher-manual/current/)
- [Neo4j Driver JavaScript](https://neo4j.com/docs/javascript-manual/current/)

### Subsistema 2: Elasticsearch
- [Elasticsearch JavaScript Client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
- [Elasticsearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
- [Kibana User Guide](https://www.elastic.co/guide/en/kibana/current/index.html)

### General
- [Express.js Documentation](https://expressjs.com/)

---

## ✅ Checklist de Entrega

### Subsistema 1: Recomendaciones (Neo4j)
- [x] Backend con Node.js + Express
- [x] Integración con Neo4j
- [x] API REST con endpoints documentados
- [x] Sistema de recomendaciones implementado
- [x] Datos sintéticos generados (usuarios, cursos, skills, relaciones)
- [x] 4 patrones de acceso implementados

### Subsistema 2: Foros y Comunidad (Elasticsearch)
- [x] Backend con Node.js + Express
- [x] Integración con Elasticsearch
- [x] API REST con endpoints documentados
- [x] Búsqueda full-text avanzada
- [x] Sistema de hilos y posts
- [x] Estadísticas y agregaciones
- [x] Datos sintéticos generados (hilos, posts)

### Frontend
- [x] Frontend moderno con Vite + React + Tailwind CSS
- [x] Navegación entre ambos subsistemas
- [x] Componentes para Recomendaciones
- [x] Componentes para Foros y Comunidad
- [x] Interfaz de usuario moderna y responsive

### Documentación
- [x] README con instrucciones claras
- [x] Documentación de ambos subsistemas
- [x] Instrucciones de instalación y ejecución

---

## 👤 Autor

**Obligatorio 2 - BDNR**  
Duolingo BDNR - Plataforma de Aprendizaje con Neo4j y Elasticsearch