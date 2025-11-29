import { Brain, MessageSquare } from 'lucide-react'

const Navigation = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: 'recommendations', label: 'Recomendaciones', icon: Brain },
    { id: 'forum', label: 'Foros y Comunidad', icon: MessageSquare }
  ]

  return (
    <nav className="bg-white rounded-2xl shadow-sm p-2 border border-gray-200">
      <div className="flex gap-2">
        {sections.map(section => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                isActive
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default Navigation