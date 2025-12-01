import { useState, useEffect } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Modal from './components/Modal'

import Stats from './components/Stats'
import UsersList from './components/UsersList'
import Recommendations from './components/Recommendations'
import Courses from './components/Courses'

import ForumStats from './components/ForumStats'
import ThreadList from './components/ThreadList'
import ThreadDetail from './components/ThreadDetail'

const API_NEO4J = 'http://localhost:3000/api'

function App() {
  const [activeSection, setActiveSection] = useState('recommendations')
  const [loading, setLoading] = useState(true)
  
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isRecommendationsModalOpen, setIsRecommendationsModalOpen] = useState(false)
  
  const [selectedThreadId, setSelectedThreadId] = useState(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      const [statsRes, usersRes, coursesRes] = await Promise.all([
        fetch(`${API_NEO4J}/stats`),
        fetch(`${API_NEO4J}/users`),
        fetch(`${API_NEO4J}/courses`)
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

  const handleSelectThread = (threadId) => {
    setSelectedThreadId(threadId)
  }

  const handleBackToThreads = () => {
    setSelectedThreadId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full mx-auto mb-4 animate-spin"></div>
          <div className="text-gray-700 text-2xl font-bold mb-2">
            Cargando Duolingo BDNR
          </div>
          <p className="text-gray-500 text-sm">Conectando con Neo4j y Elasticsearch...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-shrink-0 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <Header />
          <Navigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-0">
        <div className="max-w-7xl mx-auto">
          {activeSection === 'recommendations' && (
            <div className="space-y-6">
              {stats && <Stats stats={stats} />}
              <UsersList 
                users={users} 
                selectedUser={selectedUser}
                onSelectUser={handleSelectUser}
              />
              <Courses courses={courses} />
            </div>
          )}
          
          {activeSection === 'forum' && (
            <div className="space-y-6">
              {selectedThreadId ? (
                <ThreadDetail 
                  threadId={selectedThreadId}
                  onBack={handleBackToThreads}
                />
              ) : (
                <>
                  <ForumStats />
                  <ThreadList onSelectThread={handleSelectThread} />
                </>
              )}
            </div>
          )}
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