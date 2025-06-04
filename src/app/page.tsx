// import Image from 'next/image';
import Link from 'next/link';
import MathGraph3D from "@/components/MathGraph3D";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section con video de fondo que ocupa todo el ancho */}
      <section className="relative h-[300px] bg-gray-200 w-full">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/fedor-descargas.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gray-200 opacity-75"></div>
      </section>
      
      {/* Sección principal con layout de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] bg-gradient-to-r from-white via-white to-gray-50">
        {/* Columna izquierda con título y descripción */}
        <div className="flex flex-col py-10">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-fedor-orange via-orange-500 to-amber-400 text-transparent bg-clip-text">Bienvenidos al Universo de</span> <span className="bg-gradient-to-r from-orange-500 via-pink-500 via-purple-500 via-blue-500 to-orange-500 text-transparent bg-clip-text">Matemáticas de Fedor</span>
              </h1>
              <p className="text-lg md:text-xl mb-6">Transformando la Educación para tus hijos.</p>
              <button className="bg-fedor-light-gray text-fedor-orange font-bold py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200">
                Comienza Ahora
              </button>
              
              <div className="mt-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Matemáticas de Fedor</h2>
                <p className="text-md md:text-lg text-justify">Es una disciplina que estudia los conceptos, principios y aplicaciones de la matemática desde una perspectiva innovadora y creativa, basada en el uso de estrategias pedagógicas y didácticas adaptadas al siglo XXI. Su objetivo es facilitar el aprendizaje autónomo y divertido de la matemática, así como promover la inclusión y el equilibrio social de las personas que la practican.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Columna derecha con el gráfico 3D */}
        <div className="relative h-full lg:min-h-[500px] bg-white border-l border-gray-100 shadow-sm overflow-hidden">
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-2 rounded-lg shadow-sm z-10 backdrop-blur-sm">
            <p className="text-sm font-medium">Mira cómo las matemáticas toman forma</p>
          </div>
          <MathGraph3D />
        </div>
      </div>

      {/* Sección de Beneficios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Beneficios del Método Fedor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg shadow-md border-l-4 border-orange-500">
              <h3 className="text-xl font-semibold mb-2 text-orange-600">Desarrollo del Pensamiento Lógico</h3>
              <p className="text-justify">Los estudiantes desarrollan habilidades de razonamiento lógico y pensamiento crítico que les servirán en todas las áreas de su vida académica y personal.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold mb-2 text-purple-600">Aprendizaje Personalizado</h3>
              <p className="text-justify">Cada estudiante avanza a su propio ritmo, permitiendo una comprensión profunda de los conceptos antes de pasar al siguiente nivel.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Motivación y Confianza</h3>
              <p className="text-justify">El método fomenta un ambiente positivo donde los estudiantes ganan confianza en sus habilidades matemáticas y desarrollan una actitud entusiasta hacia el aprendizaje.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de tarjetas informativas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tarjeta Retos */}
            <Link href="/retos" className="block bg-orange-500 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3">Retos</h2>
                <p className="text-center">Los retos Matemáticos de Fedor son un producto digital descargable.</p>
              </div>
            </Link>
            
            {/* Tarjeta Módulos */}
            <Link href="/modulos" className="block bg-purple-600 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3">Módulos</h2>
                <p className="text-center">Tenemos el Método Fedor, para que las matemáticas se aprendan de manera práctica, fácil y rápida</p>
              </div>
            </Link>
            
            {/* Tarjeta Instituciones Educativas */}
            <a 
              href="https://wa.me/573227496445?text=Hola%20amigos%20de%20Fedor%2C%20quisiera%20informaci%C3%B3n%20sobre%20la%20Plataforma." 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white text-green-600 border-2 border-green-500 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-green-600">Instituciones Educativas</h2>
                <p className="text-center text-gray-700">Si eres una Institución Educativa y requieres nuestro Libro Digital, comunícate con nosotros a través de WhatsApp</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Contáctanos</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-center">Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <button className="mt-4 bg-fedor-orange text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors duration-200">
              Enviar Mensaje
            </button>
          </div>
        </div>
      </section>

      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/573227496445?text=Hola%20amigos%20de%20Fedor%2C%20quisiera%20informaci%C3%B3n%20sobre%20la%20Plataforma."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-white text-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200 z-50"
        aria-label="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="11" fill="green" stroke="white" strokeWidth="2" />
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.828z" fill="white"/>
        </svg>
      </a>

      {/* Footer */}
      <Footer />
    </div>
  );
}
