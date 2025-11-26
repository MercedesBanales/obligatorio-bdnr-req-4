import { useState } from 'react'
import { BookOpen, Users, GraduationCap, Eye, AlertCircle, Target } from 'lucide-react'
import Modal from './Modal'

const getLanguageName = (code) => {
  const languages = {
    'es': 'Español',
    'en': 'Inglés',
    'fr': 'Francés',
    'de': 'Alemán',
    'it': 'Italiano',
    'pt': 'Portugués'
  }
  return languages[code] || code
}

const CourseCard = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleViewLessons = () => {
    setIsModalOpen(true)
    setLoading(true)
    setError(null)
    
    fetch(`/api/courses/${course.course_id}/lessons`)
      .then(r => r.json())
      .then(result => {
        if (result.success) {
          setLessons(result.data)
        } else {
          setError('No se pudieron cargar las lecciones')
        }
      })
      .catch(err => {
        setError('Error al cargar las lecciones del curso')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setLessons([])
    setError(null)
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {course.language_from.toUpperCase()} → {course.language_to.toUpperCase()}
            </h3>
            <p className="text-gray-600 text-sm">
              De {getLanguageName(course.language_from)} a {getLanguageName(course.language_to)}
            </p>
          </div>
        </div>
        
        <div className="mb-4 p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-mono">
            Curso ID: {course.course_id}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-700">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="font-bold text-gray-800">{course.enrolled_count}</span>
              <span className="text-sm text-gray-500 ml-1">estudiantes</span>
            </div>
          </div>
          
          <button
            onClick={handleViewLessons}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Ver Lecciones
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Lecciones del curso ${course.language_from.toUpperCase()} → ${course.language_to.toUpperCase()}`}
      >
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Cargando lecciones...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && lessons.length > 0 && (
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.lesson_id || index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-violet-500 rounded-lg shrink-0">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-800">{lesson.topic}</h3>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                        Dificultad: {lesson.difficulty}/5
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mb-2">
                      {lesson.lesson_id} • Unidad {lesson.unit_id}
                    </p>
                    {lesson.description && (
                      <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                        {lesson.description}
                      </p>
                    )}
                    {lesson.skills && lesson.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {lesson.skills.map((skill, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        <span className="font-semibold text-gray-800">{lesson.completions}</span> completaciones
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && lessons.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay lecciones disponibles para este curso</p>
          </div>
        )}
      </Modal>
    </>
  )
}

const Courses = ({ courses }) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <GraduationCap className="w-5 h-5 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          Cursos Disponibles
        </h2>
        <div className="ml-auto text-sm text-gray-500 font-medium">
          {courses.length} {courses.length === 1 ? 'curso' : 'cursos'}
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No hay cursos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.course_id} course={course} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Courses