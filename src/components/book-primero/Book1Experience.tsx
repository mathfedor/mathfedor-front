'use client';

import React from 'react';
import { Book1Provider, useBook1 } from './context/Book1Context';
import BookHeader1ro from './shared/BookHeader1ro';
import Grade1FloatingButtons from './shared/Grade1FloatingButtons';

import SetupScreen1ro from './screens/SetupScreen1ro';
import HomeScreen1ro from './screens/HomeScreen1ro';
import UnitScreen1ro from './screens/UnitScreen1ro';
import LessonScreen1ro from './screens/LessonScreen1ro';
import ResultsScreen1ro from './screens/ResultsScreen1ro';
import EstandaresScreen1ro from './screens/EstandaresScreen1ro';
import ProblemasScreen1ro from './screens/ProblemasScreen1ro';
import TablasConteoScreen1ro from './screens/TablasConteoScreen1ro';
import ConceptosScreen1ro from './screens/ConceptosScreen1ro';
import DefinicionesScreen1ro from './screens/DefinicionesScreen1ro';
import RetosScreen1ro from './screens/RetosScreen1ro';

function Book1Shell() {
  const { screen, loading } = useBook1();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            border: '4px solid #F0C674',
            borderTopColor: '#10B981',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <div style={{ fontWeight: 800, color: '#074F3A' }}>
          Cargando Matemáticas de Fedor 1°...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'setup':
        return <SetupScreen1ro />;
      case 'home':
        return <HomeScreen1ro />;
      case 'unit':
        return <UnitScreen1ro />;
      case 'lesson':
        return <LessonScreen1ro />;
      case 'results':
        return <ResultsScreen1ro />;
      case 'estandares':
        return <EstandaresScreen1ro />;
      case 'problemas':
        return <ProblemasScreen1ro />;
      case 'tablas-conteo':
        return <TablasConteoScreen1ro />;
      case 'conceptos':
        return <ConceptosScreen1ro />;
      case 'definiciones':
        return <DefinicionesScreen1ro />;
      case 'retos':
        return <RetosScreen1ro />;
      default:
        return <HomeScreen1ro />;
    }
  };

  return (
    <div
      className="book1-experience-container fedor-book"
      style={{
        minHeight: '100vh',
        background: '#F0EDFF',
        color: 'var(--text)',
      }}
    >
      <div className="app">
        <BookHeader1ro />
        <main style={{ paddingBottom: '3rem' }}>{renderScreen()}</main>
        <Grade1FloatingButtons />
      </div>
    </div>
  );
}

export default function Book1Experience({ slug = 'libro-1ro' }: { slug?: string }) {
  return (
    <Book1Provider slug={slug}>
      <Book1Shell />
    </Book1Provider>
  );
}
