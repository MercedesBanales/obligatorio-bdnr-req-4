import { useState, useEffect } from 'react'
import { User, BookOpen, Target, Users, Award, Zap, Flame, AlertCircle, X } from 'lucide-react'

const API_URL = '/api'

const UserProfile = ({ userId, userName, onClose }) => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadUserProfile()
  }, [userId])

  const loadUserProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/users/${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setUserData(data.data)
      } else {
        setError(data.error || 'Error al cargar el perfil')
      }
    } catch (err) {
      setError('Error de conexión al servidor')
      console.error('Error loading user profile:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Cargando perfil...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Cerrar
        </button>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500 rounded-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{userData.name || userName}</h2>
            <p className="text-sm text-gray-500 font-mono">#{userData.user_id}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Nivel</span>
          </div>
          <p className="text-3xl font-bold text-blue-800">{userData.level || 'N/A'}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">XP Total</span>
          </div>
          <p className="text-3xl font-bold text-yellow-800">
            {userData.xp_total ? userData.xp_total.toLocaleString() : '0'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700">Racha</span>
          </div>
          <p className="text-3xl font-bold text-orange-800">{userData.streak || 0} días</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Lecciones</span>
          </div>
          <p className="text-3xl font-bold text-green-800">
            {userData.lessons_completed || 0}
          </p>
        </div>
      </div>

      {userData.courses && userData.courses.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Cursos Inscritos</h3>
            <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {userData.courses.length} {userData.courses.length === 1 ? 'curso' : 'cursos'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {userData.courses.map((courseId, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold"
              >
                <BookOpen className="w-4 h-4" />
                {courseId}
              </span>
            ))}
          </div>
        </div>
      )}

      {userData.struggles && userData.struggles.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-800">Áreas de Dificultad</h3>
            <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {userData.struggles.length} {userData.struggles.length === 1 ? 'área' : 'áreas'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {userData.struggles.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-semibold"
              >
                <Target className="w-4 h-4" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-violet-600" />
          <h3 className="text-xl font-bold text-gray-800">Red Social</h3>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg p-4 border border-violet-200">
          <p className="text-2xl font-bold text-violet-800">
            {userData.friends_count || 0}
          </p>
          <p className="text-sm text-violet-700 font-medium">
            {userData.friends_count === 1 ? 'Amigo conectado' : 'Amigos conectados'}
          </p>
        </div>
      </div>

      {(!userData.courses || userData.courses.length === 0) && 
       (!userData.struggles || userData.struggles.length === 0) && (
        <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay información adicional disponible</p>
          <p className="text-gray-400 text-sm mt-1">Este usuario aún no está inscrito en cursos o no tiene dificultades registradas</p>
        </div>
      )}
    </div>
  )
}

export default UserProfile

