import { useState, useEffect } from 'react'
import { MessageSquare, Eye, Clock, Tag, TrendingUp, Sparkles } from 'lucide-react'

const ThreadList = ({ onSelectThread }) => {
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadThreads()
  }, [filter])

  const loadThreads = async () => {
    setLoading(true)
    try {
      let url = 'http://localhost:3002/api/threads/search?size=30'
      
      if (filter === 'trending') {
        url = 'http://localhost:3002/api/threads/trending?limit=30'
      } else if (filter === 'recent') {
        url += '&sort=recent'
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      console.log('Threads data received:', data)
      
      if (data.success) {
        setThreads(data.threads || [])
      } else {
        console.error('API returned success: false', data)
        setThreads([])
      }
    } catch (error) {
      console.error('Error loading threads:', error)
      setThreads([])
    } finally {
      setLoading(false)
    }
  }

  const getLanguageFlag = (lang) => {
    const flags = { es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', en: '🇬🇧' }
    return flags[lang] || '🌐'
  }

  const getLanguageName = (lang) => {
    const names = { es: 'Español', fr: 'Francés', de: 'Alemán', en: 'Inglés' }
    return names[lang] || lang
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Cargando hilos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Foros y Comunidad</h2>
        <div className="text-sm text-gray-500">{threads.length} hilos</div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Todos
        </button>
        <button
          onClick={() => setFilter('trending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'trending'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Trending
        </button>
        <button
          onClick={() => setFilter('recent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'recent'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          Recientes
        </button>
      </div>

      {/* Lista de hilos */}
      {threads.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay hilos disponibles</p>
          <p className="text-gray-400 text-sm mt-1">Asegúrate de que el servidor de Elasticsearch esté corriendo</p>
        </div>
      ) : (
        <div className="space-y-4">
          {threads.map(thread => (
          <div
            key={thread.thread_id}
            onClick={() => onSelectThread(thread.thread_id)}
            className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{getLanguageFlag(thread.language)}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">
                    {thread.title}
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">
                    {getLanguageName(thread.language)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {thread.initial_post}
                </p>
                
                {thread.tags && thread.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {thread.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {thread.tags.length > 4 && (
                      <span className="text-xs text-gray-500">+{thread.tags.length - 4}</span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {thread.reply_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {thread.view_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(thread.last_activity_at).toLocaleDateString('es-ES', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-xs ml-auto">por {thread.author_name}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}

export default ThreadList