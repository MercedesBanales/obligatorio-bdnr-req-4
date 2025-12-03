import { useState, useEffect } from 'react'
import { ArrowLeft, ThumbsUp, CheckCircle, User, Calendar, MessageSquare } from 'lucide-react'

const ThreadDetail = ({ threadId, onBack }) => {
  const [thread, setThread] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadThreadDetail()
  }, [threadId])

  const loadThreadDetail = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3002/api/threads/${threadId}`)
      const data = await response.json()
      
      if (data.success) {
        setThread(data.thread)
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error loading thread:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Cargando hilo...</p>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 font-medium">Hilo no encontrado</p>
        <button 
          onClick={onBack} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Volver a la lista
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-700 font-semibold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a la lista
      </button>

      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border-2 border-blue-200 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {thread.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="font-semibold">{thread.author_name}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(thread.created_at).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {thread.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="prose max-w-none">
          <p className="text-gray-700 text-lg whitespace-pre-wrap leading-relaxed">
            {thread.initial_post}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {posts.length} {posts.length === 1 ? 'Respuesta' : 'Respuestas'}
          </h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aún no hay respuestas</p>
            <p className="text-gray-400 text-sm mt-1">¡Sé el primero en responder!</p>
          </div>
        ) : (
          posts.map((post, idx) => (
            <div
              key={post.post_id}
              className={`bg-white rounded-xl p-5 border-2 transition-all ${
                post.is_solution
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                    <ThumbsUp className={`w-5 h-5 ${post.votes > 0 ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'}`} />
                  </button>
                  <span className={`font-bold ${post.votes > 0 ? 'text-blue-600' : post.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {post.votes}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="font-bold text-gray-800">
                      {post.author_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleString('es-ES', { 
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {post.is_solution && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Solución Aceptada
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ThreadDetail