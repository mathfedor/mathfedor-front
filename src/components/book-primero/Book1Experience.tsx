'use client';

import React, { useState } from 'react';
import { Book1Provider, useBook1 } from './context/Book1Context';
import BookHeader1ro from './shared/BookHeader1ro';
import Grade1FloatingButtons from './shared/Grade1FloatingButtons';
import LaunchIntro from '@/components/book/shared/LaunchIntro';
import StatsLab from '@/components/book/games/StatsLab';

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
import GalaxyScreen1ro from './screens/GalaxyScreen1ro';
import ReportScreen1ro from './screens/ReportScreen1ro';
import ProfileScreen1ro from './screens/ProfileScreen1ro';
import DiaryScreen1ro from './screens/DiaryScreen1ro';
import ShopScreen1ro from './screens/ShopScreen1ro';

function Book1Shell() {
  const { screen, loading, grantReward } = useBook1();
  const [showIntro, setShowIntro] = useState(false);
  const [showStatsLab, setShowStatsLab] = useState(false);

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
        return (
          <HomeScreen1ro
            onOpenIntro={() => setShowIntro(true)}
            onOpenStatsLab={() => setShowStatsLab(true)}
          />
        );
      case 'unit':
        return <UnitScreen1ro />;
      case 'lesson':
        return <LessonScreen1ro />;
      case 'results':
        return <ResultsScreen1ro />;
      case 'estandares':
      case 'estandares-men':
        return <EstandaresScreen1ro />;
      case 'problemas':
      case 'problemas-cotidianos':
        return <ProblemasScreen1ro />;
      case 'tablas-conteo':
        return <TablasConteoScreen1ro />;
      case 'conceptos':
        return <ConceptosScreen1ro />;
      case 'definiciones':
      case 'definiciones-fedor':
        return <DefinicionesScreen1ro />;
      case 'retos':
        return <RetosScreen1ro />;
      case 'galaxy':
        return <GalaxyScreen1ro />;
      case 'report':
        return <ReportScreen1ro />;
      case 'profile':
        return <ProfileScreen1ro />;
      case 'diary':
        return <DiaryScreen1ro />;
      case 'shop':
        return <ShopScreen1ro />;
      default:
        return (
          <HomeScreen1ro
            onOpenIntro={() => setShowIntro(true)}
            onOpenStatsLab={() => setShowStatsLab(true)}
          />
        );
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
      <div className="app" style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '4.75rem 1.5rem 4rem' }}>
        <BookHeader1ro
          onOpenIntro={() => setShowIntro(true)}
          onOpenStatsLab={() => setShowStatsLab(true)}
        />
        <main style={{ paddingBottom: '3rem' }}>{renderScreen()}</main>
        <Grade1FloatingButtons
          onOpenIntro={() => setShowIntro(true)}
        />
      </div>

      {showIntro && (
        <LaunchIntro
          isGrade1={true}
          onClose={() => setShowIntro(false)}
        />
      )}

      {showStatsLab && (
        <StatsLab
          onClose={() => setShowStatsLab(false)}
          onGrantReward={grantReward}
        />
      )}
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
