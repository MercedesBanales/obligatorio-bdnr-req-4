import { useState, useEffect } from 'react'
import { Globe, MessageSquare, TrendingUp } from 'lucide-react'

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

const ForumStats = () => {
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLanguageStats()
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Cargando estadísticas...</span>
        </div>
      </div>
    )
  }

  if (languages.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="text-center py-8">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No hay estadísticas disponibles</p>
        </div>
      </div>
    )
  }

  return (
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
    </div>
  )
}

export default ForumStats

