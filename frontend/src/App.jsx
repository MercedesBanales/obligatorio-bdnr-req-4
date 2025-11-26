import { useState, useEffect } from 'react'
import Header from './components/Header'
import Stats from './components/Stats'
import UsersList from './components/UsersList'
import Recommendations from './components/Recommendations'
import Courses from './components/Courses'
import Modal from './components/Modal'

const API_URL = '/api'

function App() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isRecommendationsModalOpen, setIsRecommendationsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      const [statsRes, usersRes, coursesRes] = await Promise.all([
        fetch(`${API_URL}/stats`),
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/courses`)
      ])

      const statsData = await statsRes.json()
      const usersData = await usersRes.json()
      const coursesData = await coursesRes.json()

      if (statsData.success) setStats(statsData.data)
      if (usersData.success) setUsers(usersData.data)
      if (coursesData.success) setCourses(coursesData.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setIsRecommendationsModalOpen(true)
  }

  const handleCloseRecommendationsModal = () => {
    setIsRecommendationsModalOpen(false)
    setSelectedUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <div className="text-gray-700 text-xl font-medium">
            Cargando datos...
          </div>
          <p className="text-gray-500 mt-2 text-sm">Conectando con Neo4j</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="flex-shrink-0 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <Header />
          {stats && <Stats stats={stats} />}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-0">
        <div className="max-w-7xl mx-auto space-y-6">
          <UsersList 
            users={users} 
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser}
          />
          
          <Courses courses={courses} />
        </div>
      </div>

      {selectedUser && (
        <Modal
          isOpen={isRecommendationsModalOpen}
          onClose={handleCloseRecommendationsModal}
          title={`Recomendaciones para ${selectedUser.name}`}
        >
          <Recommendations user={selectedUser} />
        </Modal>
      )}
    </div>
  )
}

export default App