export interface GradoTema {
  titulo: string;
  descripcion: string;
}

export interface GradoItem {
  g: number;
  etapa: 'primaria' | 'bachillerato';
  titulo: string;
  temas: [string, string][];
  verificar?: boolean;
}

export const GRADOS: GradoItem[] = [
  {
    g: 1,
    etapa: 'primaria',
    titulo: 'Todavía cuenta con los dedos y no pasa nada',
    temas: [
      ['Contar hasta 999', 'Con fichas que mueve con el dedo en la pantalla'],
      ['Sumar y restar llevando', 'Ese paso donde se enreda, explicado despacio'],
      ['Figuras, metros y reloj', 'Medir la casa, leer la hora, reconocer formas'],
      ['2 libros para descargar', 'En Excel, interactivos. Suyos, incluso si algún día cancela']
    ]
  },
  {
    g: 2,
    etapa: 'primaria',
    titulo: 'Restar llevando sin que termine llorando',
    temas: [
      ['El paso de llevar uno', 'Donde se pierde medio salón. Aquí lo ve, no lo memoriza'],
      ['Las primeras multiplicaciones', 'Multiplicar es sumar varias veces. Así lo entiende'],
      ['Problemas de dos pasos', 'Primero entender qué le preguntan, después operar'],
      ['3 libros para descargar', 'En Excel, interactivos. Suyos, incluso si algún día cancela']
    ]
  },
  {
    g: 3,
    etapa: 'primaria',
    titulo: 'Las tablas, sin cantarlas cuarenta veces',
    temas: [
      ['Las tablas con sentido', 'Ve por qué 6 por 4 son 24. Después ya no se le olvida'],
      ['Dividir', 'Repartir de verdad, no seguir una receta'],
      ['Simulacros Saber 3°', 'Preguntas iguales a las de la prueba, pero sin presión'],
      ['3 libros para descargar', 'En Excel, interactivos. Suyos, incluso si algún día cancela']
    ]
  },
  {
    g: 4,
    etapa: 'primaria',
    titulo: 'Cuarto: el año en que llegan las fracciones',
    temas: [
      ['Fracciones', 'Por qué 1/2 es más que 1/4. Lo ve en pantalla, no se lo explican'],
      ['Decimales', 'Con precios del mercado y medidas de la casa'],
      ['Dividir por dos cifras', 'Cómo arrancar sin quedarse mirando la hoja'],
      ['3 libros para descargar', 'En Excel, interactivos. Suyos, incluso si algún día cancela']
    ]
  },
  {
    g: 5,
    etapa: 'primaria',
    titulo: 'Lo último antes del bachillerato',
    temas: [
      ['Múltiplos y divisores', 'El mínimo común múltiplo, por fin con un para qué'],
      ['¿Qué se resuelve primero?', 'El orden de las operaciones, sin adivinar'],
      ['Simulacros Saber 5°', 'Tal como se la van a poner en el colegio'],
      ['3 libros para descargar', 'En Excel, interactivos. Suyos, incluso si algún día cancela']
    ]
  },
  {
    g: 6,
    etapa: 'bachillerato',
    titulo: 'Primer año de bachillerato, sin susto',
    temas: [
      ['Negativos y fracciones', 'El puente entre primaria y el álgebra'],
      ['Ciudad Órbita', '440 niveles. Avanza como en un juego, no como en una clase'],
      ['Zona Fedor', 'Juegos donde usa las matemáticas sin darse cuenta'],
      ['3 libros para descargar', 'En Excel, interactivos. Suyos, incluso si algún día cancela']
    ]
  },
  {
    g: 7,
    etapa: 'bachillerato',
    titulo: 'Cuando las matemáticas se llenan de letras',
    verificar: true,
    temas: [
      ['Fracciones y negativos juntos', 'Donde se enreda casi todo el salón'],
      ['Las primeras x', 'La letra es un número que todavía no sabemos. Nada más'],
      ['Regla de tres', 'Para que sepa cuándo se usa y cuándo no'],
      ['3 libros para descargar', 'En Excel, interactivos. Suyos, incluso si algún día cancela']
    ]
  },
  {
    g: 8,
    etapa: 'bachillerato',
    titulo: 'Factorizar: el tema que decide el resto del bachillerato',
    verificar: true,
    temas: [
      ['Productos notables', 'Con dibujo, no con una fórmula para copiar'],
      ['Factorización', 'Si este se le pierde, lo arrastra hasta once'],
      ['Ecuaciones', 'Entender qué le hace a cada lado del igual'],
      ['3 libros para descargar', 'En Excel, interactivos. Suyos, incluso si algún día cancela']
    ]
  },
  {
    g: 9,
    etapa: 'bachillerato',
    titulo: 'Las gráficas dejan de ser rayas en una hoja',
    verificar: true,
    temas: [
      ['Ecuaciones cuadráticas', 'Tres formas de resolverlas y cuál le conviene'],
      ['Funciones', 'Mirar una gráfica y saber qué está diciendo'],
      ['Pitágoras', 'Usado en algo real, no recitado de memoria'],
      ['3 libros para descargar', 'En Excel, interactivos. Suyos, incluso si algún día cancela']
    ]
  },
  {
    g: 10,
    etapa: 'bachillerato',
    titulo: 'Seno y coseno sin memorizar la tabla',
    verificar: true,
    temas: [
      ['Seno, coseno y tangente', 'De dónde salen. No llegan porque sí'],
      ['Identidades', 'Demostradas en pantalla, paso por paso'],
      ['Entrenamiento para el Icfes', 'Preguntas del estilo de la prueba, todas las semanas'],
      ['3 libros para descargar', 'En Excel, interactivos. Suyos, incluso si algún día cancela']
    ]
  },
  {
    g: 11,
    etapa: 'bachillerato',
    titulo: 'El año del Icfes y de la universidad',
    verificar: true,
    temas: [
      ['Los primeros límites', 'Lo que le van a pedir en primer semestre'],
      ['Estadística y probabilidad', 'Leer una gráfica, no solo calcular'],
      ['Simulacros Saber 11', 'Completos y con reloj, como el día real'],
      ['3 libros para descargar', 'En Excel, interactivos. Suyos, incluso si algún día cancela']
    ]
  }
];

export const DISPONIBLES: Record<number, boolean> = {
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true
};

export const PORTADAS_MAP: Record<number, string> = {
  1: '/images/landing-nueva/portada-1.webp',
  2: '/images/landing-nueva/portada-2.webp',
  3: '/images/landing-nueva/portada-3.webp',
  4: '/images/landing-nueva/portada-4.webp',
  5: '/images/landing-nueva/portada-5.webp',
  6: '/images/landing-nueva/portada-6.webp',
  7: '/images/landing-nueva/portada-7.webp',
  8: '/images/landing-nueva/portada-8.webp',
  9: '/images/landing-nueva/portada-9.webp',
  10: '/images/landing-nueva/portada-10.webp',
  11: '/images/landing-nueva/portada-11.webp'
};

export const WA_PHONE = '573107199897';
