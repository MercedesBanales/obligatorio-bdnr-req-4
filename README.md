# Motor de Recomendaciones - Duolingo con Neo4j

## 📋 Descripción

Sistema de recomendaciones para Duolingo implementado con **Node.js + Express** y **Neo4j** como base de datos de grafos.

**Obligatorio 2 - Bases de Datos No Relacionales**

### ✨ Características

- **Backend REST API** con Express.js
- **Base de datos Neo4j** (grafos)
- **Frontend moderno** con Vite + React + Tailwind CSS
- **4 tipos de recomendaciones:**
  - Por dificultad detectada
  - Colaborativas (usuarios similares)
  - Sociales (amigos activos)
  - Red de amigos (hasta 2 grados)

---

## 🛠️ Requisitos Previos

### 1. Node.js y npm

Verifica que tengas Node.js instalado:

```bash
node --version
npm --version
```

Si no lo tienes, descárgalo de [nodejs.org](https://nodejs.org/)

### 2. Neo4j Desktop

1. Descarga **Neo4j Desktop** desde [neo4j.com/download](https://neo4j.com/download/)
2. Instala y abre Neo4j Desktop
3. Crea un nuevo proyecto
4. Crea una nueva base de datos (DBMS):
   - **Name:** duolingo-recommendations
   - **Password:** (elige una contraseña, ej: "password123")
   - **Version:** 5.x o superior
5. **Inicia la base de datos** (botón Start)

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
- `neo4j-driver` - Driver de Neo4j
- `cors` - Para permitir requests del frontend
- `dotenv` - Variables de entorno
- `nodemon` - Auto-reload en desarrollo

### Paso 3: Configurar conexión a Neo4j

Abre el archivo `backend/.env` y completa tu contraseña:

```env
NEO4J_URI=neo4j://127.0.0.1:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=tu-password-aqui    # ← CAMBIA ESTO
PORT=3000
```

**⚠️ IMPORTANTE:** Reemplaza `tu-password-aqui` con la contraseña que configuraste en Neo4j Desktop.

---

## 🚀 Ejecución

### 1. Poblar la base de datos (SOLO LA PRIMERA VEZ)

Este script crea 50 usuarios, 3 cursos, skills y todas las relaciones:

```bash
cd backend
npm run seed
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

### 2. Iniciar el servidor backend

En la terminal del backend:

```bash
npm start
```

O en modo desarrollo (auto-reload):

```bash
npm run dev
```

El servidor correrá en **http://localhost:3000**

Verás:

```
✅ Conexión exitosa
📍 Conectado a Neo4j en: neo4j://127.0.0.1:7687
🚀 Servidor corriendo en http://localhost:3000
```

### 3. Iniciar el frontend (en otra terminal)

Abre **otra terminal** y ve a la carpeta frontend:

```bash
cd frontend
npm run dev
```

El frontend correrá en **http://localhost:5173**

Abre tu navegador en **http://localhost:5173**

**✅ Listo! La aplicación está corriendo.**

### 3. Instalar dependencias del frontend

Abre otra terminal y ve a la carpeta frontend:

```bash
cd frontend
npm install
```

### 4. Iniciar el frontend (Vite + React)

```bash
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

---

## 📡 API REST - Endpoints

Base URL: `http://localhost:3000/api`

### Usuarios

- **GET** `/users` - Listar todos los usuarios
- **GET** `/users/:userId` - Obtener un usuario específico

### Recomendaciones

- **GET** `/recommendations/struggles/:userId` - Recomendaciones por dificultad
- **GET** `/recommendations/collaborative/:userId` - Usuarios con dificultades similares
- **GET** `/recommendations/social/:userId` - Amigos más activos
- **GET** `/network/:userId` - Red social del usuario

### Cursos

- **GET** `/courses` - Listar cursos disponibles
- **GET** `/courses/:courseId/skills` - Skills de un curso

### Estadísticas

- **GET** `/stats` - Estadísticas generales del sistema

### Health Check

- **GET** `/health` - Verificar estado del servidor

---

## 🧪 Probar la API

### Con curl (Terminal)

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

### Con el navegador

Abre directamente las URLs:

- http://localhost:3000/api/users
- http://localhost:3000/api/stats
- http://localhost:3000/api/recommendations/struggles/u1

---

## 🎯 Uso del Frontend

1. **Visualizar estadísticas generales** (arriba)
2. **Seleccionar un usuario** haciendo click en una tarjeta
3. **Ver recomendaciones** en las pestañas:
   - **Por Dificultad:** Skills donde tiene problemas
   - **Colaborativas:** Usuarios similares para estudiar juntos
   - **Sociales:** Amigos activos para motivarse
   - **Red de Amigos:** Conexiones directas e indirectas
4. **Explorar cursos** disponibles en la parte inferior

---

## 🗄️ Estructura del Proyecto

```
motor-recomendaciones-neo4j/
├── backend/
│   ├── package.json        # Dependencias del proyecto
│   ├── .env                # Configuración de conexión
│   ├── server.js           # Servidor Express + API REST
│   ├── db.js               # Conexión a Neo4j
│   └── seed.js             # Script para poblar la BD
└── frontend/
    ├── package.json        # Dependencias de React
    ├── vite.config.js      # Configuración de Vite
    ├── tailwind.config.js  # Configuración de Tailwind
    ├── index.html          # HTML principal
    └── src/
        ├── main.jsx        # Entry point
        ├── App.jsx         # Componente principal
        ├── index.css       # Estilos globales + Tailwind
        └── components/     # Componentes React
            ├── Header.jsx
            ├── Stats.jsx
            ├── UsersList.jsx
            ├── Recommendations.jsx
            └── Courses.jsx
```

---

## 🔍 Visualizar el Grafo en Neo4j Browser

Neo4j Desktop incluye un navegador para visualizar el grafo:

1. En Neo4j Desktop, click en **"Open"** → **"Neo4j Browser"**
2. Ejecuta queries Cypher:

### Ver el grafo completo (limitado)
```cypher
MATCH (n)
RETURN n
LIMIT 100
```

### Ver un usuario y sus conexiones
```cypher
MATCH (u:User {user_id: 'u1'})-[r]->(n)
RETURN u, r, n
LIMIT 25
```

### Ver usuarios con dificultades similares
```cypher
MATCH (u1:User)-[:STRUGGLES_WITH]->(s:Skill)<-[:STRUGGLES_WITH]-(u2:User)
WHERE u1.user_id = 'u1' AND u1 <> u2
RETURN u1, s, u2
LIMIT 10
```

### Ver red de amigos
```cypher
MATCH path = (u1:User {user_id: 'u1'})-[:FRIEND_WITH*1..2]-(u2:User)
RETURN path
LIMIT 20
```

---

## 🛑 Detener el Servidor

Presiona **Ctrl + C** en la terminal donde corre el servidor.

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to Neo4j"

1. Verifica que Neo4j Desktop esté corriendo (botón "Start" debe estar activo)
2. Revisa que el password en `.env` sea correcto
3. Confirma que el puerto sea 7687 (default de Neo4j)

### Error: "EADDRINUSE: address already in use"

El puerto 3000 ya está ocupado. Cambia el puerto en `.env`:

```env
PORT=3001
```

Y actualiza la URL en `frontend/app.js`:

```javascript
const API_URL = 'http://localhost:3001/api';
```

### Error: "Failed to fetch"

1. Asegúrate de que el backend esté corriendo
2. Verifica que la URL en `frontend/app.js` sea correcta
3. Revisa la consola del navegador (F12) para más detalles

### La base de datos está vacía

Ejecuta el script de seed:

```bash
cd backend
npm run seed
```

---

## 📊 Decisiones de Diseño

### ¿Por qué Neo4j?

- **Relaciones naturales:** Las recomendaciones se basan en conexiones entre usuarios, skills y cursos
- **Consultas de caminos:** Encontrar amigos de amigos es trivial con Cypher
- **Rendimiento:** Las consultas de grafo son muy rápidas (milisegundos)
- **Flexibilidad:** Fácil agregar nuevos tipos de relaciones

### ¿Por qué REST API?

- **Separación de concerns:** Backend y frontend independientes
- **Escalabilidad:** El frontend puede ser React, Vue, mobile app, etc.
- **Testeable:** Fácil probar endpoints con curl o Postman

### Trade-offs

- **Consistencia eventual:** Neo4j no es ACID estricto
- **No es OLAP:** Para análisis masivos de datos, usar otra BD
- **Actualizaciones:** Modificar el grafo puede ser costoso a gran escala

---

## 📚 Recursos

- [Neo4j Cypher Manual](https://neo4j.com/docs/cypher-manual/current/)
- [Neo4j Driver JavaScript](https://neo4j.com/docs/javascript-manual/current/)
- [Express.js Documentation](https://expressjs.com/)

---

## ✅ Checklist de Entrega

- [x] Backend con Node.js + Express
- [x] Integración con Neo4j
- [x] API REST con endpoints documentados
- [x] Frontend moderno con Vite + React + Tailwind CSS
- [x] Datos sintéticos generados
- [x] 4 patrones de acceso implementados
- [x] README con instrucciones claras

---

## 👤 Autor

**Obligatorio 2 - BDNR**  
Motor de Recomendaciones - Duolingo