import { useState, useEffect } from 'react'
import { Globe, MessageSquare, TrendingUp, Tag } from 'lucide-react'

const LanguageStatCard = ({ language, threadCount, avgReplies }) => {
  const getLanguageFlag = (lang) => {
    const flags = { es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', en: '🇬🇧' }
    return flags[lang] || '🌐'
  }

  const getLanguageName = (lang) => {
    const names = { es: 'Español', fr: 'Francés', de: 'Alemán', en: 'Inglés' }
    return names[lang] || lang.toUpperCase()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getLanguageFlag(language)}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {getLanguageName(language)}
            </h3>
            <p className="text-xs text-gray-500 uppercase">{language}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-600 font-medium">Hilos</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {threadCount}
          </div>
        </div>
        
        <div className="bg-emerald-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-gray-600 font-medium">Promedio</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {avgReplies.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">respuestas/hilo</div>
        </div>
      </div>
    </div>
  )
}

const TagStatItem = ({ tag, count, rank }) => {
  const getTagColor = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
    return 'bg-blue-100 text-blue-700'
  }

  const getRankBadge = (rank) => {
    if (rank <= 3) {
      const emojis = { 1: '🥇', 2: '🥈', 3: '🥉' }
      return <span className="text-xl">{emojis[rank]}</span>
    }
    return <span className="text-sm font-bold text-gray-500">#{rank}</span>
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex-shrink-0 w-8 text-center">
          {getRankBadge(rank)}
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getTagColor(rank)}`}>
          {tag}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-gray-400" />
        <span className="text-lg font-bold text-gray-700">{count}</span>
        <span className="text-sm text-gray-500">hilos</span>
      </div>
    </div>
  )
}

const ForumStats = () => {
  const [languages, setLanguages] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [tagsLoading, setTagsLoading] = useState(true)

  useEffect(() => {
    loadLanguageStats()
    loadTagsStats()
  }, [])

  const loadLanguageStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3002/api/stats/languages')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.languages) {
        setLanguages(data.languages)
      }
    } catch (error) {
      console.error('Error loading language stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTagsStats = async () => {
    try {
      setTagsLoading(true)
      const response = await fetch('http://localhost:3002/api/stats/tags')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.tags) {
        setTags(data.tags)
      }
    } catch (error) {
      console.error('Error loading tags stats:', error)
    } finally {
      setTagsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Estadísticas por Idioma */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Estadísticas por Idioma
          </h2>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Distribución de hilos y promedio de respuestas por idioma
        </p>
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Cargando estadísticas de idiomas...</span>
            </div>
          </div>
        ) : languages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No hay estadísticas de idiomas disponibles</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {languages.map((lang) => (
              <LanguageStatCard
                key={lang.language}
                language={lang.language}
                threadCount={lang.thread_count}
                avgReplies={lang.avg_replies}
              />
            ))}
          </div>
        )}
      </div>

      {/* Top Tags Más Utilizados */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Tag className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Top Tags Más Utilizados
          </h2>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Etiquetas temáticas más populares en el foro
        </p>
        
        {tagsLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Cargando tags...</span>
            </div>
          </div>
        ) : tags.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="text-center py-8">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No hay tags disponibles</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="space-y-2">
              {tags.map((tagItem, index) => (
                <TagStatItem
                  key={tagItem.tag}
                  tag={tagItem.tag}
                  count={tagItem.count}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForumStats

