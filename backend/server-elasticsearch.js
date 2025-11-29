const express = require('express');
const cors = require('cors');
const { esClient, verifyConnection } = require('./db-elasticsearch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT_ES || 3002;

app.use(cors());
app.use(express.json());

verifyConnection();

// ==================== BÚSQUEDA Y EXPLORACIÓN ====================

app.get('/api/threads/search', async (req, res) => {
  const { q, language, tags, sort = 'relevance', from = 0, size = 20 } = req.query;
  
  const must = [];
  const filter = [];
  
  if (q) {
    must.push({
      multi_match: {
        query: q,
        fields: ['title^2', 'initial_post'],
        type: 'best_fields',
        fuzziness: 'AUTO'
      }
    });
  }
  
  if (language) {
    filter.push({ term: { language } });
  }
  
  if (tags) {
    const tagArray = tags.split(',');
    filter.push({ terms: { tags: tagArray } });
  }
  
  let sortClause;
  switch(sort) {
    case 'recent':
      sortClause = [{ last_activity_at: 'desc' }];
      break;
    case 'popular':
      sortClause = [{ reply_count: 'desc' }, { view_count: 'desc' }];
      break;
    case 'relevance':
    default:
      sortClause = ['_score'];
  }
  
  try {
    const result = await esClient.search({
      index: 'threads',
      from: parseInt(from),
      size: parseInt(size),
      body: {
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter
          }
        },
        sort: sortClause,
        highlight: {
          fields: {
            title: {},
            initial_post: {}
          }
        }
      }
    });
    
    const threads = result.hits.hits.map(hit => ({
      ...hit._source,
      score: hit._score,
      highlights: hit.highlight
    }));
    
    res.json({
      success: true,
      total: result.hits.total.value,
      threads
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/threads/trending', async (req, res) => {
  const { language, limit = 20 } = req.query;
  
  const filter = [];
  if (language) {
    filter.push({ term: { language } });
  }
  
  filter.push({
    range: {
      last_activity_at: {
        gte: 'now-7d/d'
      }
    }
  });
  
  try {
    const result = await esClient.search({
      index: 'threads',
      size: parseInt(limit),
      body: {
        query: {
          bool: { filter }
        },
        sort: [
          { reply_count: 'desc' },
          { last_activity_at: 'desc' }
        ]
      }
    });
    
    res.json({
      success: true,
      threads: result.hits.hits.map(hit => hit._source)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/threads/:threadId', async (req, res) => {
  const { threadId } = req.params;
  
  try {
    const threadResult = await esClient.get({
      index: 'threads',
      id: threadId
    });
    
    await esClient.update({
      index: 'threads',
      id: threadId,
      body: {
        script: {
          source: 'ctx._source.view_count++',
          lang: 'painless'
        }
      }
    });
    
    const postsResult = await esClient.search({
      index: 'posts',
      size: 100,
      body: {
        query: {
          term: { thread_id: threadId }
        },
        sort: [
          { is_solution: 'desc' },
          { votes: 'desc' },
          { created_at: 'asc' }
        ]
      }
    });
    
    res.json({
      success: true,
      thread: threadResult._source,
      posts: postsResult.hits.hits.map(hit => hit._source),
      post_count: postsResult.hits.total.value
    });
  } catch (error) {
    if (error.meta?.statusCode === 404) {
      return res.status(404).json({ success: false, error: 'Hilo no encontrado' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ESTADÍSTICAS ====================

app.get('/api/stats/languages', async (req, res) => {
  try {
    const result = await esClient.search({
      index: 'threads',
      size: 0,
      body: {
        aggs: {
          languages: {
            terms: {
              field: 'language',
              size: 10
            },
            aggs: {
              avg_replies: {
                avg: {
                  field: 'reply_count'
                }
              }
            }
          }
        }
      }
    });
    
    const languages = result.aggregations.languages.buckets.map(bucket => ({
      language: bucket.key,
      thread_count: bucket.doc_count,
      avg_replies: Math.round(bucket.avg_replies.value * 10) / 10
    }));
    
    res.json({
      success: true,
      languages
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/stats/tags', async (req, res) => {
  try {
    const result = await esClient.search({
      index: 'threads',
      size: 0,
      body: {
        aggs: {
          top_tags: {
            terms: {
              field: 'tags',
              size: 15
            }
          }
        }
      }
    });
    
    const tags = result.aggregations.top_tags.buckets.map(bucket => ({
      tag: bucket.key,
      count: bucket.doc_count
    }));
    
    res.json({
      success: true,
      tags
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Foros y Comunidad - Elasticsearch',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 FOROS Y COMUNIDAD - ELASTICSEARCH`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📍 Servidor: http://localhost:${PORT}`);
  console.log(`🏥 Health:   http://localhost:${PORT}/health`);
  console.log(`${'='.repeat(60)}\n`);
});