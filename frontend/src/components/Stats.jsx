import { Users, BookOpen, Target, Heart, GraduationCap } from 'lucide-react'

const StatCard = ({ icon: Icon, value, label, color, bgColor }) => {
  const displayValue = (value ?? 0).toLocaleString()
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className={`text-4xl font-bold ${color} mb-2`}>
            {displayValue}
          </div>
          <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">
            {label}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  )
}

const Stats = ({ stats }) => {
  if (!stats) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard 
        icon={Users}
        value={stats.users}
        label="Usuarios"
        color="text-blue-600"
        bgColor="bg-blue-100"
      />
      <StatCard 
        icon={BookOpen}
        value={stats.courses}
        label="Cursos"
        color="text-emerald-600"
        bgColor="bg-emerald-100"
      />
      <StatCard 
        icon={GraduationCap}
        value={stats.lessons}
        label="Lecciones"
        color="text-orange-600"
        bgColor="bg-orange-100"
      />
      <StatCard 
        icon={Target}
        value={stats.skills}
        label="Skills"
        color="text-violet-600"
        bgColor="bg-violet-100"
      />
      <StatCard 
        icon={Heart}
        value={stats.friendships}
        label="Amistades"
        color="text-pink-600"
        bgColor="bg-pink-100"
      />
    </div>
  )
}

export default Stats