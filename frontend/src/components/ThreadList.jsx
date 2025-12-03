import { useState, useEffect } from 'react'
import { MessageSquare, Eye, Clock, Tag, TrendingUp, Sparkles, Search, X, Filter } from 'lucide-react'

const ThreadList = ({ onSelectThread }) => {
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  
  const [searchInput, setSearchInput] = useState('') 
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const availableTags = ['grammar', 'beginner', 'intermediate', 'vocabulary', 'pronunciation', 'verbs', 'subjunctive', 'past-tenses', 'cases', 'word-order', 'culture']
  
  const languages = [
    { code: '', name: 'Todos los idiomas' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Francés', flag: '🇫🇷' },
    { code: 'de', name: 'Alemán', flag: '🇩🇪' },
    { code: 'en', name: 'Inglés', flag: '🇬🇧' }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    loadThreads()
  }, [filter, searchQuery, selectedLanguage, selectedTags])

  const loadThreads = async () => {
    setLoading(true)
    try {
      let url = 'http://localhost:3002/api/threads/search?size=30'
      
      if (filter === 'trending') {
        url = 'http://localhost:3002/api/threads/trending?limit=30'
        if (selectedLanguage) {
          url += `&language=${selectedLanguage}`
        }
      } else {
        const params = new URLSearchParams()
        
        if (searchQuery.trim()) {
          params.append('q', searchQuery.trim())
        }
        
        if (selectedLanguage) {
          params.append('language', selectedLanguage)
        }
        
        if (selectedTags.length > 0) {
          params.append('tags', selectedTags.join(','))
        }
        
        if (filter === 'recent') {
          params.append('sort', 'recent')
        } else if (filter === 'popular') {
          params.append('sort', 'popular')
        } else {
          params.append('sort', 'relevance')
        }
        
        const queryString = params.toString()
        if (queryString) {
          url += `&${queryString}`
        }
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
            
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Foros y Comunidad</h2>
        <div className="text-sm text-gray-500">{threads.length} hilos</div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar hilos (ej: subjuntivo, verbos, pronunciación...)"
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('')
                  setSearchQuery('')
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
              showFilters || selectedLanguage || selectedTags.length > 0
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filtros
            {(selectedLanguage || selectedTags.length > 0) && (
              <span className="bg-white text-blue-500 px-2 py-0.5 rounded-full text-xs font-bold">
                {[selectedLanguage && 1, selectedTags.length].filter(Boolean).reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Idioma
              </label>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code === selectedLanguage ? '' : lang.code)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedLanguage === lang.code
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {lang.flag && <span className="text-lg">{lang.flag}</span>}
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      )
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Limpiar tags
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
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
        <button
          onClick={() => setFilter('popular')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'popular'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Populares
        </button>
      </div>

      {(searchQuery || selectedLanguage || selectedTags.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-600 font-medium">Filtros activos:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              "{searchQuery}"
              <button onClick={() => {
                setSearchInput('')
                setSearchQuery('')
              }} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedLanguage && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {languages.find(l => l.code === selectedLanguage)?.flag} {languages.find(l => l.code === selectedLanguage)?.name}
              <button onClick={() => setSelectedLanguage('')} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedTags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              {tag}
              <button onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => {
              setSearchInput('')
              setSearchQuery('')
              setSelectedLanguage('')
              setSelectedTags([])
            }}
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            Limpiar todo
          </button>
        </div>
      )}

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