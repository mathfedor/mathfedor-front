const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Sample mock data for API interception
const mockInstitutions = [
  {
    _id: 'inst-1',
    id: 'inst-1',
    name: 'Colegio Campestre San José',
    type: 'Colegio',
    location: { city: 'Bogotá', region: 'Cundinamarca', address: 'Calle 170 # 15-40' },
    email: 'rectoria@colegiosanjose.edu.co',
    status: 'active'
  },
  {
    _id: 'inst-2',
    id: 'inst-2',
    name: 'Gimnasio Moderno del Norte',
    type: 'Colegio',
    location: { city: 'Medellín', region: 'Antioquia', address: 'Cra 43A # 12-30' },
    email: 'contacto@gimnasiomoderno.edu.co',
    status: 'active'
  }
];

const mockBranches = [
  {
    _id: 'branch-1',
    id: 'branch-1',
    name: 'Sede Principal - Primaria',
    address: 'Calle 170 # 15-40 Bloque B',
    institutionId: 'inst-1'
  },
  {
    _id: 'branch-2',
    id: 'branch-2',
    name: 'Sede Bachillerato',
    address: 'Calle 170 # 15-80 Bloque A',
    institutionId: 'inst-1'
  }
];

const mockTeachers = [
  {
    _id: 'teacher-1',
    id: 'teacher-1',
    name: 'Prof. Carlos Mendoza',
    email: 'carlos.mendoza@colegiosanjose.edu.co',
    role: 'Teacher',
    institutionId: 'inst-1',
    status: 'active'
  },
  {
    _id: 'teacher-2',
    id: 'teacher-2',
    name: 'Prof. Ana María Gómez',
    email: 'ana.gomez@colegiosanjose.edu.co',
    role: 'Teacher',
    institutionId: 'inst-1',
    status: 'active'
  }
];

const mockClassrooms = [
  {
    _id: 'class-1',
    id: 'class-1',
    name: 'Grado 3°A - Mañana',
    code: 'SEC-301-A',
    capacity: 32,
    branchId: 'branch-1',
    teacherIds: ['teacher-1'],
    teachers: [mockTeachers[0]]
  },
  {
    _id: 'class-2',
    id: 'class-2',
    name: 'Grado 5°B - Tarde',
    code: 'SEC-502-B',
    capacity: 30,
    branchId: 'branch-1',
    teacherIds: ['teacher-2'],
    teachers: [mockTeachers[1]]
  }
];

const mockUsers = [
  {
    _id: 'user-admin',
    id: 'user-admin',
    name: 'Administrador Fedor',
    email: 'admin@metodofedor.com',
    role: 'Admin',
    status: 'active'
  },
  mockTeachers[0],
  mockTeachers[1],
  {
    _id: 'student-1',
    id: 'student-1',
    name: 'Mateo Rodríguez Silva',
    email: 'mateo.rodriguez@estudiante.edu.co',
    role: 'Student',
    institutionId: 'inst-1',
    status: 'active',
    student: {
      institutionId: 'inst-1',
      branchId: 'branch-1',
      classroomId: 'class-1',
      institution: 'Colegio Campestre San José',
      name: 'Mateo Rodríguez Silva'
    }
  },
  {
    _id: 'student-2',
    id: 'student-2',
    name: 'Sofía Valentina Castro',
    email: 'sofia.castro@estudiante.edu.co',
    role: 'Student',
    institutionId: 'inst-1',
    status: 'active',
    student: {
      institutionId: 'inst-1',
      branchId: 'branch-1',
      classroomId: 'class-1',
      institution: 'Colegio Campestre San José',
      name: 'Sofía Valentina Castro'
    }
  },
  {
    _id: 'student-3',
    id: 'student-3',
    name: 'Santiago Morales Pardo',
    email: 'santiago.morales@estudiante.edu.co',
    role: 'Student',
    institutionId: 'inst-1',
    status: 'active',
    student: {
      institutionId: 'inst-1',
      branchId: 'branch-1',
      classroomId: 'class-2',
      institution: 'Colegio Campestre San José',
      name: 'Santiago Morales Pardo'
    }
  }
];

const mockResults = [
  {
    _id: 'res-1',
    id: 'res-1',
    moduleId: 'matematicas-fedor-3',
    group: 'Grado3',
    module: {
      title: 'Matemáticas de Fedor 3°',
      group: 'Grado3'
    },
    student: {
      userId: 'student-1',
      name: 'Mateo Rodríguez Silva',
      email: 'mateo.rodriguez@estudiante.edu.co'
    },
    goodAnswers: 42,
    wrongAnswers: 3,
    rating: 'Excelente dominio conceptual',
    createdAt: new Date().toISOString(),
    subjects: [
      { name: 'Multiplicación y División', points: 28, maxPoints: 30 },
      { name: 'Fracciones y Repartos', points: 14, maxPoints: 15 }
    ],
    bookReport: {
      completedLevels: 24,
      totalLevels: 28,
      avgPct: 93,
      bestUnit: 'Unidad 2: Operaciones Multiplicativas',
      weakestUnit: 'Unidad 4: Geometría y Mediciones',
      units: [
        {
          index: 1,
          name: 'Unidad 1: Pensamiento Numérico y Estructuras Aditivas',
          levelsCount: 8,
          completedCount: 8,
          avgPct: 95
        },
        {
          index: 2,
          name: 'Unidad 2: Multiplicación y Estrategias de Cálculo',
          levelsCount: 8,
          completedCount: 8,
          avgPct: 96
        },
        {
          index: 3,
          name: 'Unidad 3: Fracciones iniciales y reparto equitativo',
          levelsCount: 6,
          completedCount: 5,
          avgPct: 90
        },
        {
          index: 4,
          name: 'Unidad 4: Mediciones, perímetros y figuras planas',
          levelsCount: 6,
          completedCount: 3,
          avgPct: 82
        }
      ]
    }
  },
  {
    _id: 'res-2',
    id: 'res-2',
    moduleId: 'matematicas-fedor-3',
    group: 'Grado3',
    module: {
      title: 'Matemáticas de Fedor 3°',
      group: 'Grado3'
    },
    student: {
      userId: 'student-2',
      name: 'Sofía Valentina Castro',
      email: 'sofia.castro@estudiante.edu.co'
    },
    goodAnswers: 38,
    wrongAnswers: 7,
    rating: 'Sobresaliente',
    createdAt: new Date().toISOString(),
    subjects: [
      { name: 'Multiplicación y División', points: 24, maxPoints: 30 },
      { name: 'Fracciones y Repartos', points: 14, maxPoints: 15 }
    ]
  },
  {
    _id: 'res-3',
    id: 'res-3',
    moduleId: 'matematicas-fedor-5',
    group: 'Grado5',
    module: {
      title: 'Matemáticas de Fedor 5°',
      group: 'Grado5'
    },
    student: {
      userId: 'student-3',
      name: 'Santiago Morales Pardo',
      email: 'santiago.morales@estudiante.edu.co'
    },
    goodAnswers: 31,
    wrongAnswers: 14,
    rating: 'Necesita reforzar operaciones',
    createdAt: new Date().toISOString(),
    subjects: [
      { name: 'Fracciones y Decimales', points: 20, maxPoints: 30 },
      { name: 'Geometría y Medición', points: 11, maxPoints: 15 }
    ]
  }
];

const mockModules = [
  {
    _id: 'mod-1',
    id: 'mod-1',
    title: 'Matemáticas de Fedor 3°',
    description: 'Módulo de matemáticas para tercer grado',
    price: 50,
    currency: 'USD',
    group: 'Grado3',
    isActive: true
  },
  {
    _id: 'mod-2',
    id: 'mod-2',
    title: 'Matemáticas de Fedor 5°',
    description: 'Módulo de matemáticas para quinto grado',
    price: 50,
    currency: 'USD',
    group: 'Grado5',
    isActive: true
  }
];

async function setupPage(page) {
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 1.5 });

  // Inyectar usuario administrador en localStorage antes de que cargue la app
  await page.evaluateOnNewDocument(() => {
    const adminUser = {
      id: 'user-admin',
      _id: 'user-admin',
      name: 'Administrador Fedor',
      email: 'admin@metodofedor.com',
      role: 'Admin',
      status: 'active'
    };
    localStorage.setItem('token', 'mock-admin-token-valid-2026');
    localStorage.setItem('user', JSON.stringify(adminUser));
  });

  // Interceptar llamadas a la API de backend (SOLO llamadas a localhost:5000 o /api/)
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const url = req.url();
    const method = req.method();

    // NUNCA interceptar peticiones a la web de Next.js (localhost:3000)
    if (!url.includes(':5000')) {
      return req.continue();
    }

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
      return req.respond({ status: 200, headers });
    }

    if (url.includes('/institutions')) {
      if (url.includes('/modules')) {
        return req.respond({
          status: 200,
          headers,
          body: JSON.stringify([])
        });
      }
      if (url.includes('/branches') && url.includes('/classrooms')) {
        return req.respond({
          status: 200,
          headers,
          body: JSON.stringify(mockClassrooms)
        });
      }
      if (url.includes('/branches')) {
        return req.respond({
          status: 200,
          headers,
          body: JSON.stringify(mockBranches)
        });
      }
      if (url.includes('/teachers')) {
        return req.respond({
          status: 200,
          headers,
          body: JSON.stringify(mockTeachers)
        });
      }
      return req.respond({
        status: 200,
        headers,
        body: JSON.stringify(mockInstitutions)
      });
    }

    if (url.includes('/users')) {
      return req.respond({
        status: 200,
        headers,
        body: JSON.stringify(mockUsers)
      });
    }

    if (url.includes('/results')) {
      return req.respond({
        status: 200,
        headers,
        body: JSON.stringify(mockResults)
      });
    }

    if (url.includes('/purchases')) {
      return req.respond({
        status: 200,
        headers,
        body: JSON.stringify([])
      });
    }

    if (url.includes('/learning') || url.includes('/modules')) {
      return req.respond({
        status: 200,
        headers,
        body: JSON.stringify(mockModules)
      });
    }

    return req.respond({
      status: 200,
      headers,
      body: JSON.stringify([])
    });
  });
}

async function capture() {
  console.log('Iniciando captura con Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('InstitutionsPage') || text.includes('Error') || text.includes('error')) {
        console.log('BROWSER LOG:', text);
      }
    });
    page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.message));
    await setupPage(page);

    // 1. Instituciones: Lista principal
    console.log('Capturando: 01_instituciones_lista.png');
    await page.goto('http://localhost:3000/es/dashboard/institutions', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01_instituciones_lista.png'), fullPage: false });

    // 2. Instituciones: Formulario de Nueva Institución
    console.log('Capturando: 02_nueva_institucion_formulario.png');
    try {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && (text.includes('Crear institución') || text.includes('Nueva Institución'))) {
          await btn.click();
          await new Promise(r => setTimeout(r, 1000));
          break;
        }
      }
      await page.screenshot({ path: path.join(OUTPUT_DIR, '02_nueva_institucion_formulario.png'), fullPage: false });
    } catch (e) {
      console.warn('Error al abrir formulario de institucion:', e.message);
    }

    // 3. Sedes y Salones
    console.log('Capturando: 03_sedes_y_salones.png');
    await page.goto('http://localhost:3000/es/dashboard/institutions', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    try {
      // Click en "Ver salones"
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && text.includes('Ver salones')) {
          await btn.click();
          await new Promise(r => setTimeout(r, 1000));
          break;
        }
      }
      // Scroll hacia abajo para ver bien las secciones de Sedes y Salones
      await page.evaluate(() => window.scrollBy(0, 480));
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.warn('Error al hacer clic en Ver salones:', e.message);
    }
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_sedes_y_salones.png'), fullPage: false });

    // 4. Gestión de Usuarios (Profesores y Estudiantes)
    console.log('Capturando: 04_usuarios_lista.png');
    await page.goto('http://localhost:3000/es/dashboard/users', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04_usuarios_lista.png'), fullPage: false });

    // 5. Formulario de creación de Usuario (Estudiante/Profesor vinculado a Salón)
    console.log('Capturando: 05_nuevo_usuario_formulario.png');
    try {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && text.trim() === 'Crear Usuario') {
          await btn.click();
          await new Promise(r => setTimeout(r, 1000));
          break;
        }
      }
      await page.screenshot({ path: path.join(OUTPUT_DIR, '05_nuevo_usuario_formulario.png'), fullPage: false });
    } catch (e) {
      console.warn('Error al abrir nuevo usuario:', e.message);
    }

    // 6. Modal de Carga Masiva en Excel
    console.log('Capturando: 06_carga_masiva_excel.png');
    await page.goto('http://localhost:3000/es/dashboard/users', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    try {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && text.includes('Cargar Usuarios (Excel)')) {
          await btn.click();
          await new Promise(r => setTimeout(r, 1000));
          break;
        }
      }
      await page.screenshot({ path: path.join(OUTPUT_DIR, '06_carga_masiva_excel.png'), fullPage: false });
    } catch (e) {
      console.warn('Error al abrir carga masiva:', e.message);
    }

    // 7. Estudiantes y notas / Reportes
    console.log('Capturando: 07_estudiantes_notas_reportes.png');
    await page.goto('http://localhost:3000/es/dashboard/estudiantes', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '07_estudiantes_notas_reportes.png'), fullPage: false });

    // 8. Reporte analítico detallado de resultados
    console.log('Capturando: 08_reportes_resultados_detallados.png');
    await page.goto('http://localhost:3000/es/dashboard/results', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '08_reportes_resultados_detallados.png'), fullPage: false });

    console.log('¡Todas las capturas reales fueron completadas exitosamente!');
  } finally {
    await browser.close();
  }
}

capture().catch(err => {
  console.error('Error durante la captura:', err);
  process.exit(1);
});
