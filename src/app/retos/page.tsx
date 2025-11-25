import Footer from "@/components/Footer";

export default function RetosPage() {
  return (
    <div className="min-h-screen">
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Retos Matemáticos</h1>
          <p className="text-lg text-center max-w-3xl mx-auto mb-12">Pon a prueba tus habilidades con estos desafiantes retos matemáticos diseñados para estimular tu pensamiento lógico y creatividad.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Reto 1 */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg shadow-md p-6 border border-orange-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-orange-600">Reto Semanal</h2>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">Nivel Intermedio</span>
              </div>
              <p className="mb-4 text-gray-700">¿Puedes determinar el valor de x en la ecuación 3x² - 12x + 7 = 0 utilizando la metodología Fedor?</p>
              <div className="flex justify-between items-center">
                <span className="text-orange-800 font-medium">Participantes: 127</span>
                <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors">
                  Intentar Reto
                </button>
              </div>
            </div>
            
            {/* Reto 2 */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md p-6 border border-purple-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-600">Desafío Geométrico</h2>
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">Nivel Avanzado</span>
              </div>
              <p className="mb-4 text-gray-700">Encuentra el área sombreada de la figura compuesta por un cuadrado de lado 8 cm y un círculo inscrito en él.</p>
              <div className="flex justify-between items-center">
                <span className="text-purple-800 font-medium">Participantes: 89</span>
                <button className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors">
                  Intentar Reto
                </button>
              </div>
            </div>
            
            {/* Reto 3 */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg shadow-md p-6 border border-blue-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-600">Secuencia Lógica</h2>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Nivel Básico</span>
              </div>
              <p className="mb-4 text-gray-700">Identifica el siguiente número en la secuencia: 2, 5, 10, 17, 26, ?</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-800 font-medium">Participantes: 214</span>
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                  Intentar Reto
                </button>
              </div>
            </div>
            
            {/* Reto 4 */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg shadow-md p-6 border border-pink-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-pink-600">Problema Algebraico</h2>
                <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm">Nivel Intermedio</span>
              </div>
              <p className="mb-4 text-gray-700">Resuelve el sistema de ecuaciones utilizando el método Fedor: 2x + 3y = 7 y 4x - 5y = 3</p>
              <div className="flex justify-between items-center">
                <span className="text-pink-800 font-medium">Participantes: 103</span>
                <button className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors">
                  Intentar Reto
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Botón flotante de WhatsApp - Comentado temporalmente */}
      {/* <a
        href="https://wa.me/573227496445?text=Hola%20amigos%20de%20Fedor%2C%20quisiera%20información%20sobre%20la%20Plataforma."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-white text-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200 z-50"
        aria-label="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="11" fill="green" stroke="white" strokeWidth="2" />
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.828z" fill="white"/>
        </svg>
      </a> */}
      
      <Footer />
    </div>
  );
} 