import { useState } from 'react'
import { Search, RefreshCw, Flame, User, Award, Zap, Users } from 'lucide-react'

const UserCard = ({ user, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`relative bg-white rounded-xl p-5 cursor-pointer border-2 transition-all hover:shadow-md ${
      isSelected 
        ? 'border-blue-500 shadow-md bg-blue-50' 
        : 'border-gray-200 hover:border-blue-300'
    }`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {user.name}
        </h3>
        <p className="text-xs text-gray-500 font-mono">#{user.user_id}</p>
      </div>
      <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500' : 'bg-gray-100'}`}>
        <User className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
      </div>
    </div>
    
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2 text-sm">
        <Award className="w-4 h-4 text-yellow-500" />
        <span className="text-gray-600">Nivel</span>
        <span className="ml-auto font-bold text-gray-800">{user.level}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Zap className="w-4 h-4 text-blue-500" />
        <span className="text-gray-600">XP</span>
        <span className="ml-auto font-bold text-gray-800">{user.xp_total.toLocaleString()}</span>
      </div>
    </div>
    
    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-semibold">
      <Flame className="w-4 h-4" />
      <span>{user.streak} días de racha</span>
    </div>
    
    {isSelected && (
      <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
    )}
  </div>
)

const UsersList = ({ users, selectedUser, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            Usuarios
          </h2>
          <div className="ml-auto text-sm text-gray-500 font-medium">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'usuario' : 'usuarios'}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o ID..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-semibold"
          >
            <RefreshCw className="w-5 h-5" />
            Actualizar
          </button>
        </div>
      </div>

      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No se encontraron usuarios</p>
            <p className="text-gray-400 text-sm mt-1">Intenta con otro término de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.user_id}
                user={user}
                isSelected={selectedUser?.user_id === user.user_id}
                onClick={() => onSelectUser(user)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default UsersList