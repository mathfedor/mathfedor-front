'use client';

import React from 'react';
import LaboratorioVisualModal5to from './LaboratorioVisualModal5to';
import ConteoModal5to from './ConteoModal5to';
import MultiplicarModal5to from './MultiplicarModal5to';
import LaboratorioEstadisticaModal5to from './LaboratorioEstadisticaModal5to';
import ExplicarModal5to from './ExplicarModal5to';
import VideosModal5to from './VideosModal5to';
import ConceptoModal5to from './ConceptoModal5to';
import DesafioModal5to from './DesafioModal5to';
import HistoriaModal5to from './HistoriaModal5to';
import GuiaDocenteModal5to from './GuiaDocenteModal5to';
import ColorFedorModal5to from './ColorFedorModal5to';
import VozFemeninaModal5to from './VozFemeninaModal5to';
import CurriculoModal5to from './CurriculoModal5to';
import SaberModal5to from './SaberModal5to';
import ExamenFinalModal5to from './ExamenFinalModal5to';
import RepasoModal5to from './RepasoModal5to';
import LogrosModal5to from './LogrosModal5to';
import Minijuegos5toModal from './Minijuegos5toModal';
import ProblemasCotidianosModal5to from './ProblemasCotidianosModal5to';
import InformeModal5to from './InformeModal5to';

interface CommandPanelModals5toProps {
  activeTool: string | null;
  onClose: () => void;
  onOpenIntro?: () => void;
  onOpenProblemas?: () => void;
  onOpenReport?: () => void;
}

export default function CommandPanelModals5to({
  activeTool,
  onClose,
  onOpenIntro,
  onOpenProblemas,
  onOpenReport,
}: CommandPanelModals5toProps) {
  if (!activeTool) return null;

  // 1. Laboratorio Visual Interactivo (18 herramientas manipulativas)
  if (activeTool === 'lab-visual' || activeTool === 'lab' || activeTool === 'laboratorio') {
    return <LaboratorioVisualModal5to isOpen={true} onClose={onClose} />;
  }

  // 2. Tablas de Conteo (pequeños y grandes números con salto de rana)
  if (activeTool === 'conteo' || activeTool === 'tablas-conteo') {
    return <ConteoModal5to isOpen={true} onClose={onClose} />;
  }

  // 3. Tablas de Multiplicar (arreglos con slider y tabla pitagórica)
  if (activeTool === 'mult' || activeTool === 'multiplicar' || activeTool === 'tablas-mult') {
    return <MultiplicarModal5to isOpen={true} onClose={onClose} />;
  }

  // 4. Laboratorio de Estadística y Datos (media, mediana, moda y gráficas)
  if (activeTool === 'lab-est' || activeTool === 'laboratorio-datos' || activeTool === 'estadistica') {
    return <LaboratorioEstadisticaModal5to isOpen={true} onClose={onClose} />;
  }

  // 5. Explicaciones Paso a Paso (24 temas con manipulación FZ)
  if (activeTool === 'explicar' || activeTool === 'explicaciones' || activeTool === 'explicacion') {
    return <ExplicarModal5to isOpen={true} onClose={onClose} />;
  }

  // 6. Videos Animados Fedor (25 videos animados con canvas)
  if (activeTool === 'videos' || activeTool === 'video' || activeTool === 'videos-animados') {
    return <VideosModal5to isOpen={true} onClose={onClose} onOpenIntro={onOpenIntro} />;
  }

  // 7. Concepto Matemático del Día (13 conceptos con pizarra FZ y audio)
  if (activeTool === 'concepto' || activeTool === 'concepto-dia' || activeTool === 'concepto-matematico') {
    return <ConceptoModal5to isOpen={true} onClose={onClose} />;
  }

  // 8. Desafío Matemático del Día (13 desafíos con pista y recompensa)
  if (activeTool === 'desafio' || activeTool === 'desafio-dia' || activeTool === 'desafio-matematico') {
    return <DesafioModal5to isOpen={true} onClose={onClose} />;
  }

  // 9. Historia y Método Fedor (los 4 pasos pedagógicos)
  if (activeTool === 'historia' || activeTool === 'historia-fedor') {
    return <HistoriaModal5to isOpen={true} onClose={onClose} />;
  }

  // 10. Guía Pedagógica del Docente (MEN 5°)
  if (activeTool === 'guia-docente' || activeTool === 'docente' || activeTool === 'guia' || activeTool === 'guia-pedagogica') {
    return <GuiaDocenteModal5to isOpen={true} onClose={onClose} />;
  }

  // 11. Selector de Color del Libro (5°)
  if (activeTool === 'color' || activeTool === 'color-fondo' || activeTool === 'fondo') {
    return <ColorFedorModal5to isOpen={true} onClose={onClose} />;
  }

  // 12. Configuración de Voz Femenina (latina / colombiana)
  if (activeTool === 'voz-fem' || activeTool === 'voz' || activeTool === 'voz-femenina') {
    return <VozFemeninaModal5to isOpen={true} onClose={onClose} />;
  }

  // 13. Currículo MEN · Grado 5° (los 5 pensamientos matemáticos)
  if (activeTool === 'curriculo' || activeTool === 'curriculo-men' || activeTool === 'men') {
    return <CurriculoModal5to isOpen={true} onClose={onClose} />;
  }

  // 14. Pruebas SABER 5° (5 niveles cronometrados con pizarra)
  if (activeTool === 'saber' || activeTool === 'pruebas-saber' || activeTool === 'saber-5') {
    return <SaberModal5to isOpen={true} onClose={onClose} />;
  }

  // 15. Examen Final Integrador (25 preguntas de las 15 unidades)
  if (activeTool === 'examen' || activeTool === 'examen-final') {
    return <ExamenFinalModal5to isOpen={true} onClose={onClose} />;
  }

  // 16. Mi Repaso Personalizado
  if (activeTool === 'repaso' || activeTool === 'mi-repaso') {
    return <RepasoModal5to isOpen={true} onClose={onClose} />;
  }

  // 17. Vitrina de Logros y Trofeos (6 hubs oficiales de 5°)
  if (activeTool === 'logros' || activeTool === 'mis-logros') {
    return <LogrosModal5to isOpen={true} onClose={onClose} />;
  }

  // 18. Minijuegos de Agilidad Mental (contrarreloj, repartir, tienda)
  if (activeTool === 'minijuegos' || activeTool === 'juegos') {
    return <Minijuegos5toModal isOpen={true} onClose={onClose} />;
  }

  // 19. Problemas Cotidianos SABER 5°
  if (activeTool === 'saber-cotidianos' || activeTool === 'problemas' || activeTool === 'problemas-cotidianos') {
    return (
      <ProblemasCotidianosModal5to
        isOpen={true}
        onClose={onClose}
        onOpenFullScreen={() => {
          onClose();
          onOpenProblemas?.();
        }}
      />
    );
  }

  // 20. Informe de Progreso del Estudiante
  if (activeTool === 'informe' || activeTool === 'report' || activeTool === 'informe-progreso') {
    return (
      <InformeModal5to
        isOpen={true}
        onClose={onClose}
        onOpenFullScreen={() => {
          onClose();
          onOpenReport?.();
        }}
      />
    );
  }

  return null;
}
