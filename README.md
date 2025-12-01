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

#### 2.2. Poblar Elasticsearch (Subsistema 2)

Este script crea hilos de discusión, posts y datos de foros:

```bash
cd backend
npm run seed:es
```

### Paso 3: Iniciar los servidores backend

Necesitas **dos terminales** para correr ambos servidores:

#### Terminal 1: Servidor Neo4j (Recomendaciones)

```bash
cd backend
npm run start:neo4j
```

El servidor correrá en **http://localhost:3000**

#### Terminal 2: Servidor Elasticsearch (Foros)

```bash
cd backend
npm run start:es
```

El servidor correrá en **http://localhost:3002**

### Paso 4: Iniciar el frontend

Abre **una tercera terminal** y ve a la carpeta frontend:

```bash
cd frontend
npm install  # Solo la primera vez
npm run dev
```

El frontend correrá en **http://localhost:5173**

### 📝 Resumen de Puertos

- **Frontend:** http://localhost:5173
- **Backend Neo4j (Recomendaciones):** http://localhost:3000
- **Backend Elasticsearch (Foros):** http://localhost:3002
- **Elasticsearch API:** http://localhost:9200
- **Kibana Dashboard:** http://localhost:5601

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
2. Ejecuta queries Cypher

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