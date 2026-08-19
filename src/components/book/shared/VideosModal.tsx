'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import grade2Units from '../data/grade2VideosUnits.json';
import { fedorTTS } from '../../../services/tts.service';

interface VideosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UnitsMap = Record<string, string[]>;
const UNITS_DATA: UnitsMap = grade2Units as UnitsMap;
const UNIT_KEYS = Object.keys(UNITS_DATA);

export default function VideosModal({ isOpen, onClose }: VideosModalProps) {
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [videosMap, setVideosMap] = useState<Record<string, string> | null>(null);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy load the 222 Grade 2 videos dictionary
  useEffect(() => {
    if (isOpen && !videosMap && !loadingVideos) {
      setLoadingVideos(true);
      import('../data/grade2VideosMap.json')
        .then((mod) => {
          setVideosMap((mod.default || mod) as Record<string, string>);
        })
        .catch((err) => {
          console.error('Error loading grade2VideosMap.json:', err);
        })
        .finally(() => {
          setLoadingVideos(false);
        });
    }
  }, [isOpen, videosMap, loadingVideos]);

  // When switching unit or opening modal, default topic
  const activeUnitKey = UNIT_KEYS[selectedUnitIdx] || UNIT_KEYS[0];
  const activeTopics = useMemo(() => UNITS_DATA[activeUnitKey] || [], [activeUnitKey]);

  useEffect(() => {
    if (isOpen && activeTopics.length > 0 && !selectedTopic) {
      setSelectedTopic(activeTopics[0]);
    }
  }, [isOpen, activeTopics, selectedTopic]);

  const handleSelectUnit = (idx: number) => {
    setSelectedUnitIdx(idx);
    const newUnitKey = UNIT_KEYS[idx];
    const newTopics = UNITS_DATA[newUnitKey] || [];
    if (newTopics.length > 0) {
      setSelectedTopic(newTopics[0]);
    }
  };

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    // Voice speech for the topic
    fedorTTS.speak(`Video explicativo: ${topic.replace(/·/g, '')}`);
  };

  if (!isOpen) return null;

  // Video source for selected topic
  const currentVideoSrc = (videosMap && selectedTopic && videosMap[selectedTopic]) || null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 4, 30, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: "'Nunito', sans-serif",
      }}
      onClick={onClose}
    >
      <style>{`
        .fvm-topic-btn {
          background: linear-gradient(135deg, #F0F4FF, #E8E5FE);
          border: 2px solid #C5BFEE;
          border-radius: 12px;
          padding: 10px 8px;
          font-size: 11px;
          font-weight: 800;
          color: #3D1468;
          cursor: pointer;
          text-align: center;
          font-family: 'Nunito', sans-serif;
          transition: transform 0.15s, box-shadow 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          line-height: 1.25;
        }
        .fvm-topic-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(123, 47, 190, 0.2);
        }
        .fvm-topic-btn.active {
          background: linear-gradient(135deg, #7B2FBE, #9B5CFF);
          border-color: #7B2FBE;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(123, 47, 190, 0.4);
        }
        .fvm-tab-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 15px;
          cursor: pointer;
          font-family: 'Baloo 2', sans-serif;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .fvm-tab-circle:hover {
          transform: scale(1.1);
        }
      `}</style>

      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: '960px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          padding: '1.6rem 1.4rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: '#FEE2E8',
            border: 'none',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            fontSize: '20px',
            fontWeight: 900,
            cursor: 'pointer',
            color: '#A30041',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Title & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <h2
            style={{
              margin: '0 0 4px',
              color: '#3D1468',
              fontFamily: "'Baloo 2', sans-serif",
              fontSize: '25px',
              fontWeight: 900,
            }}
          >
            🎬 Videos del Libro
          </h2>
          <p
            style={{
              margin: 0,
              color: '#7A7299',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            222 videos · elige unidad y tema
          </p>
        </div>

        {/* Unit Selector Circles (1 to 8) */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '18px',
          }}
        >
          {UNIT_KEYS.map((u, i) => {
            const isActive = i === selectedUnitIdx;
            return (
              <button
                key={i}
                type="button"
                className="fvm-tab-circle"
                onClick={() => handleSelectUnit(i)}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #7B2FBE, #9B5CFF)'
                    : '#F3E8FF',
                  border: isActive ? '2px solid #7B2FBE' : '1.5px solid #D8B4FE',
                  color: isActive ? '#ffffff' : '#6B21A8',
                  boxShadow: isActive ? '0 4px 14px rgba(123, 47, 190, 0.4)' : 'none',
                }}
                title={u}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* 5-Column Responsive Grid of Level Pills */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '9px',
            marginBottom: '18px',
            maxHeight: '44vh',
            overflowY: 'auto',
            padding: '4px',
          }}
        >
          {activeTopics.map((topic, idx) => {
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={idx}
                type="button"
                className={`fvm-topic-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectTopic(topic)}
              >
                {topic}
              </button>
            );
          })}
        </div>

        {/* Video Player Area */}
        <div
          style={{
            background: '#0B081E',
            borderRadius: '16px',
            padding: '12px',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #2B1854',
          }}
        >
          {loadingVideos ? (
            <div style={{ color: '#E0DBFF', padding: '2rem', fontWeight: 800 }}>
              Cargando video explicativo...
            </div>
          ) : currentVideoSrc ? (
            <div style={{ width: '100%', maxWidth: '640px', textAlign: 'center' }}>
              <video
                ref={videoRef}
                controls
                autoPlay
                loop
                playsInline
                style={{
                  width: '100%',
                  maxHeight: '340px',
                  borderRadius: '12px',
                  display: 'block',
                  margin: '0 auto 8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                }}
                src={currentVideoSrc}
              />
              <div
                style={{
                  color: '#FFD66B',
                  fontSize: '13px',
                  fontWeight: 800,
                  fontFamily: "'Baloo 2', sans-serif",
                }}
              >
                {selectedTopic}
              </div>
            </div>
          ) : (
            <div style={{ color: '#9E94C8', padding: '2rem', textAlign: 'center', fontWeight: 700 }}>
              👆 Elige un tema arriba para ver su video explicativo
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
