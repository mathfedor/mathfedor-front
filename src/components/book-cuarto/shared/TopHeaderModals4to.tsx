'use client';

import React from 'react';
import ConceptoModal4to from './ConceptoModal4to';
import DesafioModal4to from './DesafioModal4to';
import HistoriaModal4to from './HistoriaModal4to';

export type TopHeaderModalType = 'concepto' | 'desafio' | 'historia' | null;

interface TopHeaderModals4toProps {
  modal: TopHeaderModalType;
  onClose: () => void;
  onUpdateStats?: (coinsToAdd: number, streakToAdd: number, xpToAdd: number) => void;
}

export default function TopHeaderModals4to({
  modal,
  onClose,
  onUpdateStats,
}: TopHeaderModals4toProps) {
  if (!modal) return null;

  if (modal === 'concepto') {
    return <ConceptoModal4to isOpen={true} onClose={onClose} />;
  }

  if (modal === 'desafio') {
    return <DesafioModal4to isOpen={true} onClose={onClose} onUpdateStats={onUpdateStats} />;
  }

  if (modal === 'historia') {
    return <HistoriaModal4to isOpen={true} onClose={onClose} />;
  }

  return null;
}
