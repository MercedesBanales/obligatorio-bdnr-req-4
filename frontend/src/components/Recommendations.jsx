import { useState, useEffect } from 'react'
import { Target, Users, Flame, Network, TrendingUp, UserCircle, AlertCircle, BookOpen, User } from 'lucide-react'
import UserProfile from './UserProfile'

const API_URL = '/api'

const TabButton = ({ active, onClick, icon: Icon, children, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-colors ${
      active
        ? `${color} text-white`
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    <Icon className="w-5 h-5" />
    {children}
  </button>
)

const RecommendationCard = ({ children, borderColor, icon: Icon, iconColor }) => (
  <div className={`bg-white rounded-xl p-5 border-l-4 ${borderColor} shadow-sm border border-gray-200 hover:shadow-md transition-shadow`}>
    <div className="flex items-start gap-4">
      {Icon && (
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  </div>
)

const ProgressBar = ({ value, color }) => (
  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
    <div
      className={`h-full ${color} transition-all duration-500 rounded-full`}
      style={{ width: `${Math.min(value * 100, 100)}%` }}
    />
  </div>
)

const Recommendations = ({ user }) => {
  const [activeTab, setActiveTab] = useState('struggles')
  const [data, setData] = useState({
    struggles: [],
    similar: [],
    collaborative: [],
    social: [],
    network: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [user])

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      const [struggles, similar, collaborative, social, network] = await Promise.all([
        fetch(`${API_URL}/recommendations/struggles/${user.user_id}`).then(r => r.json()),
        fetch(`${API_URL}/recommendations/similar/${user.user_id}`).then(r => r.json()),
        fetch(`${API_URL}/recommendations/collaborative/${user.user_id}`).then(r => r.json()),
        fetch(`${API_URL}/recommendations/social/${user.user_id}`).then(r => r.json()),
        fetch(`${API_URL}/network/${user.user_id}`).then(r => r.json())
      ])

      const strugglesData = struggles.success ? struggles.data : []
      const similarData = similar.success ? similar.data : []
      const collaborativeData = collaborative.success ? collaborative.data : []
      const socialData = social.success ? social.data : []
      const networkData = network.success ? network.data : []

      setData({
        struggles: strugglesData,
        similar: similarData,
        collaborative: collaborativeData,
        social: socialData,
        network: networkData
      })
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando recomendaciones...</p>
        </div>
      )
    }

    switch (activeTab) {
      case 'struggles':
        const validStruggles = data.struggles.filter(rec => rec.lesson_id || rec.topic)
        return validStruggles.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong className="text-orange-700">💡 ¿Qué significa esto?</strong> Estas lecciones cubren temas con los que <strong>has tenido dificultades</strong>. Te las recomendamos para que puedas reforzarlos y mejorar tu comprensión.
              </p>
            </div>
            {validStruggles.map((rec, idx) => (
              <RecommendationCard 
                key={idx}
                borderColor="border-orange-500"
                icon={Target}
                iconColor="bg-orange-500"
              >
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {rec.topic || `Lección ${rec.lesson_id || idx + 1}`}
                  </h4>
                  {rec.lesson_id && (
                    <p className="text-xs text-gray-500 font-mono mb-2">
                      <strong>ID:</strong> {rec.lesson_id}
                    </p>
                  )}
                  {rec.description && (
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {rec.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 font-medium">Nivel de dificultad</span>
                    <span className="text-lg font-bold text-orange-600">
                      {rec.difficulty ? `${rec.difficulty}/5` : 'N/A'}
                    </span>
                  </div>
                  {rec.difficulty && (
                    <>
                      <ProgressBar 
                        value={rec.difficulty / 5} 
                        color="bg-orange-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {rec.difficulty >= 4 ? 'Muy difícil' : rec.difficulty >= 3 ? 'Difícil' : rec.difficulty >= 2 ? 'Moderada' : 'Fácil'}
                      </p>
                    </>
                  )}
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r mt-3">
                    <p className="text-sm text-gray-700">
                      <strong className="text-orange-700">Has tenido dificultades con este tema.</strong>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Esta lección te ayudará a reforzar y mejorar tu dominio. Te recomendamos completarla para superar estas dificultades.
                    </p>
                  </div>
                </div>
              </RecommendationCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Este usuario no tiene dificultades registradas</p>
          </div>
        )

      case 'similar':
        return data.similar.length > 0 ? (
          <div className="space-y-4">
            {data.similar.map((rec, idx) => (
              <RecommendationCard 
                key={idx}
                borderColor="border-blue-500"
                icon={BookOpen}
                iconColor="bg-blue-500"
              >
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {rec.topic || `Lección ${rec.lesson_id || 'similar'}`}
                  </h4>
                  {rec.lesson_id && (
                    <p className="text-xs text-gray-500 font-mono mb-2">
                      <strong>ID:</strong> {rec.lesson_id}
                    </p>
                  )}
                  {rec.description && (
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {rec.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 font-medium">Similitud con tu última lección</span>
                    <span className="text-lg font-bold text-blue-600">
                      {rec.similarity ? `${(rec.similarity * 100).toFixed(0)}%` : 'N/A'}
                    </span>
                  </div>
                  {rec.similarity && (
                    <ProgressBar 
                      value={rec.similarity} 
                      color="bg-blue-500"
                    />
                  )}
                  <p className="text-gray-600 text-sm mt-3">
                    <strong>Recomendación:</strong> Esta lección es similar a una que ya completaste. Continúa con contenido relacionado para reforzar lo aprendido.
                  </p>
                </div>
              </RecommendationCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay contenido similar disponible</p>
            <p className="text-gray-400 text-sm mt-1">Completa algunas lecciones primero</p>
          </div>
        )

      case 'collaborative':
        return data.collaborative.length > 0 ? (
          <div className="space-y-4">
            {data.collaborative.map((rec, idx) => (
              <RecommendationCard 
                key={idx}
                borderColor="border-violet-500"
                icon={BookOpen}
                iconColor="bg-violet-500"
              >
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {rec.topic || `Lección ${rec.lesson_id || 'colaborativa'}`}
                  </h4>
                  {rec.lesson_id && (
                    <p className="text-xs text-gray-500 font-mono mb-2">
                      <strong>ID:</strong> {rec.lesson_id}
                    </p>
                  )}
                  {rec.description && (
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {rec.description}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    <Users className="w-4 h-4" />
                    {rec.votes || 0} usuario{(rec.votes || 0) !== 1 ? 's' : ''} con dificultades similares la completaron
                  </div>
                  <p className="text-gray-600 text-sm">
                    <strong>Recomendación:</strong> Otros usuarios con dificultades parecidas a las tuyas encontraron útil esta lección. Prueba esta opción para superar tus desafíos.
                  </p>
                </div>
              </RecommendationCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay recomendaciones colaborativas disponibles</p>
          </div>
        )

      case 'social':
        return data.social.length > 0 ? (
          <div className="space-y-4">
            {data.social.map((rec, idx) => (
              <RecommendationCard 
                key={idx}
                borderColor="border-pink-500"
                icon={Flame}
                iconColor="bg-pink-500"
              >
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {rec.topic || `Lección ${rec.lesson_id || 'social'}`}
                  </h4>
                  {rec.lesson_id && (
                    <p className="text-xs text-gray-500 font-mono mb-2">
                      <strong>ID:</strong> {rec.lesson_id}
                    </p>
                  )}
                  {rec.description && (
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {rec.description}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    <Users className="w-4 h-4" />
                    {rec.friend_count || rec.friends_completed || 0} amigo{(rec.friend_count || rec.friends_completed || 0) !== 1 ? 's' : ''} completó esta lección
                  </div>
                  {rec.difficulty && (
                    <p className="text-gray-600 text-sm mb-2">
                      Dificultad: <span className="font-semibold">{rec.difficulty}/5</span>
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">
                    <strong>Recomendación:</strong> Tus amigos ya completaron esta lección. ¡Únete a ellos y mantén tu progreso al día!
                  </p>
                </div>
              </RecommendationCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Tus amigos aún no han completado lecciones</p>
          </div>
        )

      case 'profile':
        return (
          <UserProfile 
            userId={user.user_id} 
            userName={user.name}
          />
        )

      case 'network':
        const direct = data.network.filter(n => n.distance === 1)
        const indirect = data.network.filter(n => n.distance === 2)

        return data.network.length > 0 ? (
          <div className="space-y-6">
            {direct.length > 0 && (
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Amigos directos
                </h4>
                <div className="space-y-4">
                  {direct.map((rec, idx) => (
                    <RecommendationCard 
                      key={idx}
                      borderColor="border-blue-500"
                      icon={UserCircle}
                      iconColor="bg-blue-500"
                    >
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{rec.user}</h4>
                        <p className="text-xs text-gray-500 font-mono mb-2">Usuario ID: {rec.user_id}</p>
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {rec.relationship}
                        </span>
                      </div>
                    </RecommendationCard>
                  ))}
                </div>
              </div>
            )}

            {indirect.length > 0 && (
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  Amigos de amigos
                </h4>
                <div className="space-y-4">
                  {indirect.map((rec, idx) => (
                    <RecommendationCard 
                      key={idx}
                      borderColor="border-violet-500"
                      icon={Network}
                      iconColor="bg-violet-500"
                    >
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{rec.user}</h4>
                        <p className="text-xs text-gray-500 font-mono mb-2">Usuario ID: {rec.user_id}</p>
                        <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {rec.relationship}
                        </span>
                      </div>
                    </RecommendationCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Este usuario no tiene conexiones en la red</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <TabButton
          active={activeTab === 'struggles'}
          onClick={() => setActiveTab('struggles')}
          icon={Target}
          color="bg-orange-500"
        >
          Por Dificultad
        </TabButton>
        <TabButton
          active={activeTab === 'similar'}
          onClick={() => setActiveTab('similar')}
          icon={BookOpen}
          color="bg-blue-500"
        >
          Contenido Similar
        </TabButton>
        <TabButton
          active={activeTab === 'collaborative'}
          onClick={() => setActiveTab('collaborative')}
          icon={Users}
          color="bg-violet-500"
        >
          Colaborativas
        </TabButton>
        <TabButton
          active={activeTab === 'social'}
          onClick={() => setActiveTab('social')}
          icon={Flame}
          color="bg-pink-500"
        >
          Sociales
        </TabButton>
        <TabButton
          active={activeTab === 'network'}
          onClick={() => setActiveTab('network')}
          icon={Network}
          color="bg-blue-500"
        >
          Red de Amigos
        </TabButton>
        <TabButton
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          icon={User}
          color="bg-gray-600"
        >
          Perfil
        </TabButton>
      </div>

      {renderContent()}
    </div>
  )
}

export default Recommendations