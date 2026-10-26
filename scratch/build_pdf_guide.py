import fitz  # PyMuPDF
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")
PROJECT_ROOT = os.path.dirname(BASE_DIR)
OUTPUT_PDF_PUBLIC = os.path.join(PROJECT_ROOT, "public", "Guia_Gestion_Instituciones_y_Reportes.pdf")
OUTPUT_PDF_ROOT = os.path.join(PROJECT_ROOT, "Guia_Gestion_Instituciones_y_Reportes.pdf")

# Colors
C_ORANGE = (0.976, 0.451, 0.086)      # #F97316
C_DARK_ORANGE = (0.918, 0.345, 0.047) # #EA580C
C_NAVY = (0.08, 0.12, 0.22)           # #141E38
C_SLATE = (0.2, 0.25, 0.33)           # #334155
C_LIGHT_BG = (0.97, 0.98, 0.99)       # #F8FAFC
C_BORDER = (0.82, 0.85, 0.89)         # #D1D5DB
C_WHITE = (1.0, 1.0, 1.0)
C_GREEN = (0.09, 0.63, 0.35)
C_BLUE = (0.15, 0.45, 0.88)

PAGE_W = 612.0
PAGE_H = 792.0

def add_header_footer(page, page_num, total_pages, title="Guía Oficial - Matemáticas de Fedor"):
    # Header bar
    page.draw_rect(fitz.Rect(0, 0, PAGE_W, 36), fill=C_NAVY)
    page.draw_rect(fitz.Rect(0, 36, PAGE_W, 38), fill=C_ORANGE)
    page.insert_text(fitz.Point(36, 23), "MATEMÁTICAS DE FEDOR", fontname="helv", fontsize=11, color=C_ORANGE)
    page.insert_text(fitz.Point(195, 23), f"|  {title}", fontname="helv", fontsize=9.5, color=C_WHITE)
    
    # Footer
    page.draw_line(fitz.Point(36, PAGE_H - 30), fitz.Point(PAGE_W - 36, PAGE_H - 30), color=C_BORDER, width=0.8)
    page.insert_text(fitz.Point(36, PAGE_H - 18), "Plataforma Educativa Fedor · Manual de Administración y Reportes", fontname="helv", fontsize=8, color=C_SLATE)
    page.insert_text(fitz.Point(PAGE_W - 85, PAGE_H - 18), f"Página {page_num} de {total_pages}", fontname="helv", fontsize=8, color=C_SLATE)

def draw_callout(page, rect, title, text, bg_color=C_LIGHT_BG, border_color=C_ORANGE):
    page.draw_rect(rect, fill=bg_color, color=border_color, width=0.8)
    page.draw_rect(fitz.Rect(rect.x0, rect.y0, rect.x0 + 4, rect.y1), fill=border_color)
    page.insert_text(fitz.Point(rect.x0 + 12, rect.y0 + 15), title, fontname="helv", fontsize=9.5, color=C_NAVY)
    page.insert_textbox(
        fitz.Rect(rect.x0 + 12, rect.y0 + 20, rect.x1 - 10, rect.y1 - 4),
        text,
        fontname="helv",
        fontsize=8.5,
        color=C_SLATE
    )

def insert_framed_image(page, rect, image_path, caption=""):
    if os.path.exists(image_path):
        page.draw_rect(rect, color=C_BORDER, width=0.8)
        page.insert_image(rect, filename=image_path, keep_proportion=True)
        if caption:
            page.insert_text(fitz.Point(rect.x0 + 4, rect.y1 + 10), caption, fontname="helv", fontsize=7.8, color=C_SLATE)

def build_pdf():
    doc = fitz.open()
    total_pages = 6

    # ==========================================
    # PÁGINA 1: PORTADA Y VISIÓN GENERAL
    # ==========================================
    p1 = doc.new_page(width=PAGE_W, height=PAGE_H)
    
    # Background accents
    p1.draw_rect(fitz.Rect(0, 0, PAGE_W, 205), fill=C_NAVY)
    p1.draw_rect(fitz.Rect(0, 205, PAGE_W, 210), fill=C_ORANGE)
    
    # Brand and Header
    p1.insert_text(fitz.Point(40, 52), "PLATAFORMA EDUCATIVA DIGITAL", fontname="helv", fontsize=11, color=C_ORANGE)
    p1.insert_text(fitz.Point(40, 92), "Matemáticas de Fedor", fontname="helv", fontsize=32, color=C_WHITE)
    p1.insert_text(fitz.Point(40, 126), "MANUAL OPERATIVO DE GESTIÓN INSTITUCIONAL", fontname="helv", fontsize=14, color=(0.85, 0.9, 0.98))
    p1.insert_text(fitz.Point(40, 150), "Guía paso a paso ilustrada con capturas reales tomadas de la plataforma", fontname="helv", fontsize=10.5, color=(0.7, 0.75, 0.85))
    
    # Metadata Badge
    badge_rect = fitz.Rect(40, 168, 380, 192)
    p1.draw_rect(badge_rect, fill=(0.14, 0.22, 0.38), color=(0.25, 0.35, 0.55), width=0.8)
    p1.insert_text(fitz.Point(48, 184), "Versión Oficial 2026 · Perfil Administrador / Academia / Docente", fontname="helv", fontsize=9, color=C_WHITE)

    # Content introduction
    y = 236
    p1.insert_text(fitz.Point(40, y), "Objetivo de la presente guía", fontname="helv", fontsize=13.5, color=C_NAVY)
    y += 12
    intro_text = (
        "Esta guía técnica y operativa detalla con precisión cada uno de los procesos necesarios para dar de alta "
        "instituciones educativas, estructurar sus sedes físicas, aperturar aulas o salones, asociar a los profesores "
        "responsables, incorporar a los estudiantes (tanto de forma manual como por carga masiva en Excel) y consultar "
        "o descargar los reportes analíticos de desempeño académico con calificaciones consolidadas."
    )
    p1.insert_textbox(fitz.Rect(40, y, PAGE_W - 40, y + 60), intro_text, fontname="helv", fontsize=9, color=C_SLATE)

    y += 66
    p1.insert_text(fitz.Point(40, y), "Estructura del flujo de trabajo", fontname="helv", fontsize=13, color=C_NAVY)
    y += 12

    # Cards for the 5 workflow pillars
    pillars = [
        ("1. Gestión de Instituciones", "Creación, parametrización de datos (Nombre, Ciudad, Región, Email) y control de estado.", C_BLUE),
        ("2. Sedes y Salones de Clase", "Organización por sedes físicas, definición de códigos de salón y vinculación de profesores.", C_ORANGE),
        ("3. Profesores y Estudiantes", "Registro de cuentas individuales con rol asignado, vinculación al aula y credenciales.", C_GREEN),
        ("4. Carga Masiva en Excel", "Importación de cohortes completas de alumnos mediante archivo estructurado .xlsx.", C_DARK_ORANGE),
        ("5. Reportes y Descargas Excel", "Seguimiento en vivo de ratings de aprendizaje, notas sobre 5.0 y descargas oficiales en Excel.", C_NAVY)
    ]

    for title, desc, accent in pillars:
        box_rect = fitz.Rect(40, y, PAGE_W - 40, y + 42)
        p1.draw_rect(box_rect, fill=C_LIGHT_BG, color=C_BORDER, width=0.8)
        p1.draw_rect(fitz.Rect(40, y, 44, y + 42), fill=accent)
        p1.insert_text(fitz.Point(54, y + 16), title, fontname="helv", fontsize=10, color=C_NAVY)
        p1.insert_text(fitz.Point(54, y + 32), desc, fontname="helv", fontsize=8.5, color=C_SLATE)
        y += 48

    y += 6
    draw_callout(
        p1,
        fitz.Rect(40, y, PAGE_W - 40, y + 54),
        "Nota de autenticidad de las imágenes:",
        "Todas las figuras de este manual corresponden a capturas directas de pantalla tomadas de la plataforma web en funcionamiento real, mostrando la interfaz operativa, menús y formularios tal como se visualizan en el sistema.",
        bg_color=(0.99, 0.98, 0.92),
        border_color=(0.85, 0.65, 0.1)
    )

    add_header_footer(p1, 1, total_pages)

    # ==========================================
    # PÁGINA 2: PILAR 1 - CREACIÓN DE INSTITUCIONES
    # ==========================================
    p2 = doc.new_page(width=PAGE_W, height=PAGE_H)
    add_header_footer(p2, 2, total_pages, "Paso 1: Gestión de Instituciones")

    p2.insert_text(fitz.Point(40, 52), "1. Creación y Registro de Instituciones Educativas", fontname="helv", fontsize=14, color=C_NAVY)
    p2.insert_textbox(
        fitz.Rect(40, 62, PAGE_W - 40, 92),
        "En el menú lateral principal, seleccione la opción 'Instituciones'. Esta sección permite administrar colegios, universidades y academias aliadas, visualizando su estado y configuraciones principales.",
        fontname="helv", fontsize=8.5, color=C_SLATE
    )

    # Screenshot 1: Tabla de instituciones
    insert_framed_image(
        p2,
        fitz.Rect(40, 98, PAGE_W - 40, 305),
        os.path.join(SCREENSHOTS_DIR, "01_instituciones_lista.jpg"),
        "Figura 1: Vista general del módulo de Instituciones con listado y sedes asociadas."
    )

    p2.insert_text(fitz.Point(40, 332), "Paso a paso para registrar una nueva institución:", fontname="helv", fontsize=10.5, color=C_NAVY)
    steps1 = (
        "1. Haga clic en el botón superior azul 'Crear institución' para desplegar el formulario.\n"
        "2. Complete los campos obligatorios: Nombre de la institución, Tipo (Colegio, Universidad, etc.), Ciudad, Región, Dirección y Correo electrónico institucional.\n"
        "3. Presione el botón 'Guardar institución' para confirmar el registro en la plataforma."
    )
    p2.insert_textbox(fitz.Rect(40, 342, PAGE_W - 40, 395), steps1, fontname="helv", fontsize=8.2, color=C_SLATE)

    # Screenshot 2: Formulario de creación
    insert_framed_image(
        p2,
        fitz.Rect(40, 405, PAGE_W - 40, 665),
        os.path.join(SCREENSHOTS_DIR, "02_nueva_institucion_formulario.jpg"),
        "Figura 2: Formulario interactivo para registrar y parametrizar una nueva institución."
    )

    # ==========================================
    # PÁGINA 3: PILAR 2 - SEDES, SALONES Y PROFESORES
    # ==========================================
    p3 = doc.new_page(width=PAGE_W, height=PAGE_H)
    add_header_footer(p3, 3, total_pages, "Paso 2: Sedes, Salones y Docentes")

    p3.insert_text(fitz.Point(40, 52), "2. Configuración de Sedes y Salones de Clase", fontname="helv", fontsize=14, color=C_NAVY)
    p3.insert_textbox(
        fitz.Rect(40, 62, PAGE_W - 40, 95),
        "Una institución puede contar con una o más sedes físicas (por ejemplo: 'Sede Principal - Primaria', 'Sede Bachillerato'). Dentro de cada sede se organizan los salones de clase y se vinculan los profesores a cargo.",
        fontname="helv", fontsize=8.5, color=C_SLATE
    )

    p3.insert_text(fitz.Point(40, 108), "Procedimiento operativo:", fontname="helv", fontsize=10.5, color=C_NAVY)
    steps2 = (
        "1. En la lista de instituciones, seleccione la institución deseada haciendo clic en 'Gestionar sedes'.\n"
        "2. En el panel izquierdo 'Sedes', ingrese el Nombre de la sede y Dirección, luego presione 'Crear'.\n"
        "3. En la tarjeta de la sede creada, presione el botón 'Ver salones'.\n"
        "4. En el panel derecho 'Salones y profesores', complete: Nombre del salón (ej. Grado 3°A - Mañana), Código único y Capacidad.\n"
        "5. En el selector múltiple 'Profesores del salón', seleccione a los docentes asignados y presione 'Crear salón'."
    )
    p3.insert_textbox(fitz.Rect(40, 118, PAGE_W - 40, 195), steps2, fontname="helv", fontsize=8.2, color=C_SLATE)

    # Screenshot 3: Sedes y Salones
    insert_framed_image(
        p3,
        fitz.Rect(40, 205, PAGE_W - 40, 580),
        os.path.join(SCREENSHOTS_DIR, "03_sedes_y_salones.jpg"),
        "Figura 3: Panel interactivo de Sedes y Salones con profesores asignados y capacidades."
    )

    draw_callout(
        p3,
        fitz.Rect(40, 605, PAGE_W - 40, 670),
        "Clave de asignación docente:",
        "Asignar profesores a los salones garantiza que, al iniciar sesión con su rol de docente, estos puedan supervisar y consultar únicamente a los estudiantes pertenecientes a sus aulas asignadas.",
        bg_color=C_LIGHT_BG,
        border_color=C_BLUE
    )

    # ==========================================
    # PÁGINA 4: PILAR 3 - GESTIÓN INDIVIDUAL DE USUARIOS
    # ==========================================
    p4 = doc.new_page(width=PAGE_W, height=PAGE_H)
    add_header_footer(p4, 4, total_pages, "Paso 3: Creación de Docentes y Estudiantes")

    p4.insert_text(fitz.Point(40, 52), "3. Creación y Asignación Individual de Usuarios", fontname="helv", fontsize=14, color=C_NAVY)
    p4.insert_textbox(
        fitz.Rect(40, 62, PAGE_W - 40, 92),
        "En la opción 'Usuarios' del menú lateral, el administrador puede crear cuentas individuales para Docentes (Teacher) o Estudiantes (Student), vinculándolos formalmente a su respectiva institución y salón de clase.",
        fontname="helv", fontsize=8.5, color=C_SLATE
    )

    # Screenshot 4: Lista de usuarios
    insert_framed_image(
        p4,
        fitz.Rect(40, 98, PAGE_W - 40, 315),
        os.path.join(SCREENSHOTS_DIR, "04_usuarios_lista.jpg"),
        "Figura 4: Directorio general de usuarios registrados con rol, institución y estado."
    )

    p4.insert_text(fitz.Point(40, 340), "Paso a paso para crear un usuario individual:", fontname="helv", fontsize=10.5, color=C_NAVY)
    steps3 = (
        "1. Presione el botón azul 'Crear Usuario' en la parte superior.\n"
        "2. Ingrese el Nombre completo, Email de acceso y Contraseña inicial.\n"
        "3. Seleccione el Rol correspondiente ('Teacher' para profesores, 'Student' para alumnos).\n"
        "4. Si selecciona 'Student', escoja la Institución, Sede y el Salón al cual pertenece el alumno.\n"
        "5. Presione 'Crear Usuario'. El usuario quedará activo de inmediato con sus permisos asignados."
    )
    p4.insert_textbox(fitz.Rect(40, 350, PAGE_W - 40, 425), steps3, fontname="helv", fontsize=8.2, color=C_SLATE)

    # Screenshot 5: Modal de creación de usuario
    insert_framed_image(
        p4,
        fitz.Rect(75, 435, PAGE_W - 75, 665),
        os.path.join(SCREENSHOTS_DIR, "05_nuevo_usuario_formulario.jpg"),
        "Figura 5: Formulario modal para registrar y vincular un nuevo usuario a su salón."
    )

    # ==========================================
    # PÁGINA 5: PILAR 4 - CARGA MASIVA DE ESTUDIANTES EN EXCEL
    # ==========================================
    p5 = doc.new_page(width=PAGE_W, height=PAGE_H)
    add_header_footer(p5, 5, total_pages, "Paso 4: Carga Masiva de Alumnos en Excel")

    p5.insert_text(fitz.Point(40, 52), "4. Carga Masiva de Estudiantes mediante Archivo Excel", fontname="helv", fontsize=14, color=C_NAVY)
    p5.insert_textbox(
        fitz.Rect(40, 62, PAGE_W - 40, 95),
        "Para incorporar cohortes completas de estudiantes de manera ágil y sin necesidad de digitación manual individual, la plataforma ofrece el módulo de importación masiva mediante hojas de cálculo Excel (.xlsx).",
        fontname="helv", fontsize=8.5, color=C_SLATE
    )

    p5.insert_text(fitz.Point(40, 108), "Instrucciones de importación:", fontname="helv", fontsize=10.5, color=C_NAVY)
    steps4 = (
        "1. En el módulo de 'Usuarios', haga clic en el botón verde 'Cargar Usuarios (Excel)'.\n"
        "2. Se abrirá la ventana emergente de selección de archivo.\n"
        "3. Haga clic en 'Seleccionar archivo' y elija su archivo de estudiantes en formato .xlsx.\n"
        "4. El archivo debe contener las columnas: Nombre, Email, Password, Sede, Salón.\n"
        "5. Presione 'Cargar Usuarios'. El sistema procesará las filas y generará los accesos automáticamente."
    )
    p5.insert_textbox(fitz.Rect(40, 118, PAGE_W - 40, 195), steps4, fontname="helv", fontsize=8.2, color=C_SLATE)

    # Screenshot 6: Modal de Carga Masiva
    insert_framed_image(
        p5,
        fitz.Rect(75, 205, PAGE_W - 75, 570),
        os.path.join(SCREENSHOTS_DIR, "06_carga_masiva_excel.jpg"),
        "Figura 6: Modal interactivo para la importación masiva de estudiantes desde Excel."
    )

    draw_callout(
        p5,
        fitz.Rect(40, 595, PAGE_W - 40, 665),
        "Recomendaciones para la carga en Excel:",
        "Verifique que los correos electrónicos de los alumnos no contengan espacios en blanco al inicio o al final, y que los nombres de las sedes y salones coincidan exactamente con los creados previamente en el módulo de Instituciones.",
        bg_color=C_LIGHT_BG,
        border_color=C_GREEN
    )

    # ==========================================
    # PÁGINA 6: PILAR 5 - REPORTES Y DESCARGAS EXCEL
    # ==========================================
    p6 = doc.new_page(width=PAGE_W, height=PAGE_H)
    add_header_footer(p6, 6, total_pages, "Paso 5: Reportes y Descargas Excel")

    p6.insert_text(fitz.Point(40, 52), "5. Consulta de Calificaciones y Descarga de Reportes en Excel", fontname="helv", fontsize=14, color=C_NAVY)
    p6.insert_textbox(
        fitz.Rect(40, 62, PAGE_W - 40, 92),
        "La plataforma ofrece dos niveles de seguimiento: el panel de 'Estudiantes' (seguimiento nominal con notas y exportación a Excel) y el panel de 'Resultados' (analítica de métricas consolidadas por aula y tópico).",
        fontname="helv", fontsize=8.5, color=C_SLATE
    )

    # Screenshot 7: Estudiantes con notas y botón Excel
    insert_framed_image(
        p6,
        fitz.Rect(40, 98, PAGE_W - 40, 315),
        os.path.join(SCREENSHOTS_DIR, "07_estudiantes_notas_reportes.jpg"),
        "Figura 7: Panel de seguimiento de notas, rating cualitativo y botones de descarga en Excel."
    )

    p6.insert_text(fitz.Point(40, 340), "Opciones de descarga y análisis disponibles:", fontname="helv", fontsize=10.5, color=C_NAVY)
    steps5 = (
        "- Descarga Global de Estudiantes: Boton naranja superior 'Descargar estudiantes' para exportar la nómina completa.\n"
        "- Reporte Individual en Excel: Botón '[Excel]' en cada fila de alumno para descargar su sábana detallada de respuestas.\n"
        "- Ficha de Detalle Cualitativo: Botón naranja '[Ver]' para explorar el desglose de niveles, fortalezas y debilidades.\n"
        "- Tablero de Métricas (Resultados): Visualización del promedio porcentual por tópico y acumulados generales del salón."
    )
    p6.insert_textbox(fitz.Rect(40, 350, PAGE_W - 40, 420), steps5, fontname="helv", fontsize=8.2, color=C_SLATE)

    # Screenshot 8: Resultados consolidados
    insert_framed_image(
        p6,
        fitz.Rect(40, 430, PAGE_W - 40, 630),
        os.path.join(SCREENSHOTS_DIR, "08_reportes_resultados_detallados.jpg"),
        "Figura 8: Tablero analítico con promedios por salón, tópicos y ratings consolidados."
    )

    draw_callout(
        p6,
        fitz.Rect(40, 650, PAGE_W - 40, 715),
        "Resumen y Soporte Técnico:",
        "La estructura modular garantiza trazabilidad total desde el registro de la institución hasta la emisión final de calificaciones y certificados para directivos y padres de familia.",
        bg_color=C_LIGHT_BG,
        border_color=C_ORANGE
    )

    # Save PDF with compression
    doc.save(OUTPUT_PDF_PUBLIC, deflate=True, garbage=4)
    doc.save(OUTPUT_PDF_ROOT, deflate=True, garbage=4)
    doc.close()
    print(f"PDF generado exitosamente en:\n- {OUTPUT_PDF_PUBLIC}\n- {OUTPUT_PDF_ROOT}")

if __name__ == "__main__":
    build_pdf()
