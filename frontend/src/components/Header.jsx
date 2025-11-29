import { Network } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white rounded-2xl shadow-sm p-8 md:p-10 text-center border border-gray-200">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="p-3 bg-blue-500 rounded-xl">
          <Network className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Duolingo BDNR
        </h1>
      </div>
      
      <p className="text-gray-600 text-lg md:text-xl">
        Plataforma de aprendizaje con <span className="font-semibold text-blue-600">Neo4j</span> y <span className="font-semibold text-green-600">Elasticsearch</span>
      </p>
    </header>
  )
}

export default Header