const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

async function verifyConnection() {
  const session = driver.session();
  try {
    const result = await session.run('RETURN "Conexión exitosa" AS message');
    console.log('✅', result.records[0].get('message'));
    console.log('📍 Conectado a Neo4j en:', process.env.NEO4J_URI);
  } catch (error) {
    console.error('❌ Error de conexión a Neo4j:', error.message);
    process.exit(1);
  } finally {
    await session.close();
  }
}

module.exports = { driver, verifyConnection };