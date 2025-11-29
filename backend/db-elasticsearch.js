const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  requestTimeout: 30000,
  maxRetries: 3
});

async function verifyConnection() {
  try {
    const health = await esClient.cluster.health();
    console.log('Conexión a Elasticsearch exitosa');
    console.log(`   Estado del cluster: ${health.status}`);
  } catch (error) {
    console.error('Error de conexión a Elasticsearch:', error.message);
  }
}

module.exports = { esClient, verifyConnection };