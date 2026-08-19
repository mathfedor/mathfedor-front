'use client';

import { useState } from 'react';
import { fedorTTS } from '../../../services/tts.service';

interface ExampleItem {
  op: string;
  proc: string[];
  res: string;
  txt: string;
}

const EXPLICACIONES: Record<string, ExampleItem[]> = {
  adicion_sin_llevar: [
    { op: '23 + 12', proc: ['3 + 2 = 5', '2 + 1 = 3'], res: '35', txt: 'Sumamos primero las unidades (3+2=5), luego las decenas (2+1=3). No hay que llevar porque las unidades no pasan de 9.' },
    { op: '45 + 34', proc: ['5 + 4 = 9', '4 + 3 = 7'], res: '79', txt: 'Sumamos unidades: 5+4=9. Sumamos decenas: 4+3=7. Sin reagrupamiento.' },
    { op: '52 + 26', proc: ['2 + 6 = 8', '5 + 2 = 7'], res: '78', txt: 'Unidades: 2+6=8. Decenas: 5+2=7. El resultado es 78.' },
    { op: '61 + 27', proc: ['1 + 7 = 8', '6 + 2 = 8'], res: '88', txt: 'Unidades: 1+7=8. Decenas: 6+2=8. Como ninguna columna pasa de 9, no llevamos.' },
    { op: '34 + 25', proc: ['4 + 5 = 9', '3 + 2 = 5'], res: '59', txt: 'Unidades: 4+5=9. Decenas: 3+2=5. Resultado limpio sin llevar.' },
  ],
  adicion_llevando: [
    { op: '27 + 15', proc: ['7 + 5 = 12', 'escribimos 2 y llevamos 1', '2 + 1 + 1 = 4'], res: '42', txt: 'Como 7+5=12 y 12 pasa de 9, escribimos 2 y llevamos 1 a las decenas. Luego 2+1+1=4.' },
    { op: '48 + 26', proc: ['8 + 6 = 14', 'escribimos 4 y llevamos 1', '4 + 2 + 1 = 7'], res: '74', txt: '8+6=14: escribimos 4 y llevamos 1. En las decenas: 4+2+1=7. Total 74.' },
    { op: '56 + 37', proc: ['6 + 7 = 13', 'escribimos 3 y llevamos 1', '5 + 3 + 1 = 9'], res: '93', txt: 'Unidades 6+7=13: escribimos 3 y llevamos 1. Decenas: 5+3+1=9. Resultado 93.' },
    { op: '19 + 28', proc: ['9 + 8 = 17', 'escribimos 7 y llevamos 1', '1 + 2 + 1 = 4'], res: '47', txt: '9+8=17: colocamos el 7 y llevamos 1. Luego 1+2+1=4. Total 47.' },
    { op: '35 + 46', proc: ['5 + 6 = 11', 'escribimos 1 y llevamos 1', '3 + 4 + 1 = 8'], res: '81', txt: '5+6=11: el 1 se queda y llevamos 1. Decenas: 3+4+1=8. Resultado 81.' },
  ],
  sustraccion_sin_llevar: [
    { op: '58 − 23', proc: ['8 − 3 = 5', '5 − 2 = 3'], res: '35', txt: 'Restamos unidades: 8−3=5. Restamos decenas: 5−2=3. Sin necesidad de pedir prestado.' },
    { op: '76 − 34', proc: ['6 − 4 = 2', '7 − 3 = 4'], res: '42', txt: '6−4=2 en las unidades. 7−3=4 en las decenas. Como en cada columna el de arriba es mayor, no pedimos prestado.' },
    { op: '89 − 45', proc: ['9 − 5 = 4', '8 − 4 = 4'], res: '44', txt: 'Unidades: 9−5=4. Decenas: 8−4=4. Todas las restas se resuelven directamente.' },
    { op: '67 − 24', proc: ['7 − 4 = 3', '6 − 2 = 4'], res: '43', txt: '7−4=3. 6−2=4. Sencillo, sin préstamo.' },
    { op: '95 − 43', proc: ['5 − 3 = 2', '9 − 4 = 5'], res: '52', txt: '5−3=2. 9−4=5. Resultado 52.' },
  ],
  sustraccion_llevando: [
    { op: '53 − 27', proc: ['como 3 < 7 pedimos prestado 1 decena', '13 − 7 = 6', '4 − 2 = 2'], res: '26', txt: 'Como 3 es menor que 7, pedimos prestado 1 decena. Ahora 13−7=6. En las decenas: 5 pasó a 4, entonces 4−2=2. Total 26.' },
    { op: '82 − 45', proc: ['como 2 < 5 pedimos prestado 1 decena', '12 − 5 = 7', '7 − 4 = 3'], res: '37', txt: '2<5 → pedimos prestado. 12−5=7. Las decenas quedan 7−4=3. Resultado 37.' },
    { op: '70 − 38', proc: ['como 0 < 8 pedimos prestado 1 decena', '10 − 8 = 2', '6 − 3 = 3'], res: '32', txt: '0<8, pedimos 1 decena prestada. 10−8=2. Las decenas: 7 pasa a 6, 6−3=3. Total 32.' },
    { op: '91 − 47', proc: ['como 1 < 7 pedimos prestado 1 decena', '11 − 7 = 4', '8 − 4 = 4'], res: '44', txt: '1<7 → prestamos 1 decena. 11−7=4. Decenas: 9→8, 8−4=4. Resultado 44.' },
    { op: '64 − 29', proc: ['como 4 < 9 pedimos prestado 1 decena', '14 − 9 = 5', '5 − 2 = 3'], res: '35', txt: '4<9, pedimos 1 decena. 14−9=5. En decenas: 6→5, 5−2=3. Resultado 35.' },
  ],
  multiplicacion: [
    { op: '4 × 3', proc: ['sumamos 4 tres veces: 4+4+4 = 12'], res: '12', txt: 'Multiplicar es sumar el mismo número varias veces. 4 tres veces = 12.' },
    { op: '6 × 5', proc: ['6 + 6 + 6 + 6 + 6 = 30', 'o usa la tabla del 6'], res: '30', txt: 'Sumar 6 cinco veces da 30. También puedes recordar la tabla del 6: 6·5=30.' },
    { op: '7 × 4', proc: ['7 + 7 + 7 + 7 = 28'], res: '28', txt: 'Sumamos 7 cuatro veces y obtenemos 28. Es la tabla del 7·4.' },
    { op: '8 × 6', proc: ['8 × 6 = 48', 'o (8×5) + 8 = 40 + 8 = 48'], res: '48', txt: '8·6=48. Un truco: multiplicar por 5 y luego sumar el número. 8·5=40, +8=48.' },
    { op: '9 × 3', proc: ['9 × 3 = 27', 'o 10·3 − 3 = 30 − 3 = 27'], res: '27', txt: '9·3=27. Otro truco: multiplica por 10 y luego resta el número: 30−3=27.' },
  ],
  division: [
    { op: '12 ÷ 3', proc: ['¿cuántas veces cabe el 3 en 12?', '4 veces (3+3+3+3=12)'], res: '4', txt: 'Dividir es repartir. Preguntamos: ¿cuántas veces cabe 3 en 12? Cabe 4 veces (3·4=12).' },
    { op: '20 ÷ 5', proc: ['5 × 4 = 20 → 20 ÷ 5 = 4'], res: '4', txt: 'Buscamos qué número multiplicado por 5 da 20. Ese número es 4.' },
    { op: '18 ÷ 6', proc: ['6 × 3 = 18 → 18 ÷ 6 = 3'], res: '3', txt: '18 dividido entre 6 es 3, porque 6·3=18.' },
    { op: '24 ÷ 4', proc: ['4 × 6 = 24 → 24 ÷ 4 = 6'], res: '6', txt: '24÷4=6, ya que 4 seis veces son 24.' },
    { op: '35 ÷ 7', proc: ['7 × 5 = 35 → 35 ÷ 7 = 5'], res: '5', txt: '35÷7=5, porque 7·5=35.' },
  ],
};

export default function ExplicacionModal({ onClose }: { onClose: () => void }) {
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [selectedSubKey, setSelectedSubKey] = useState<string | null>(null);

  const handleSpeak = (text: string) => {
    fedorTTS.speak(text);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 4, 30, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 99998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: "'Nunito', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: '740px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          position: 'relative',
          padding: '1.6rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '14px',
            top: '14px',
            background: '#FEE2E8',
            color: '#A30041',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            fontWeight: 900,
            cursor: 'pointer',
            fontSize: '18px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Cerrar"
        >
          ✕
        </button>

        {!selectedOp ? (
          // Main Operations Menu
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '42px' }}>🎓</div>
              <h2
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontWeight: 900,
                  fontSize: '26px',
                  color: '#1A0A3C',
                  margin: '0 0 4px',
                }}
              >
                Explicación Matemática
              </h2>
              <div style={{ fontSize: '13px', color: '#7A7299', fontWeight: 700 }}>
                Elige una operación para ver ejemplos con explicación paso a paso
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <button
                type="button"
                onClick={() => setSelectedOp('adicion')}
                style={{
                  background: 'linear-gradient(135deg,#06A570,#16876A)',
                  color: '#FFF',
                  border: 'none',
                  padding: '24px 16px',
                  borderRadius: '18px',
                  fontWeight: 900,
                  fontSize: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(6,165,112,.3)',
                  minHeight: '110px',
                  transition: 'transform 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '36px' }}>➕</span>
                Adición
              </button>

              <button
                type="button"
                onClick={() => setSelectedOp('sustraccion')}
                style={{
                  background: 'linear-gradient(135deg,#FF8C2A,#C94B22)',
                  color: '#FFF',
                  border: 'none',
                  padding: '24px 16px',
                  borderRadius: '18px',
                  fontWeight: 900,
                  fontSize: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(255,140,42,.3)',
                  minHeight: '110px',
                  transition: 'transform 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '36px' }}>➖</span>
                Sustracción
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedOp('multiplicacion');
                  setSelectedSubKey('multiplicacion');
                }}
                style={{
                  background: 'linear-gradient(135deg,#7B2FBE,#3D1054)',
                  color: '#FFF',
                  border: 'none',
                  padding: '24px 16px',
                  borderRadius: '18px',
                  fontWeight: 900,
                  fontSize: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(123,47,190,.3)',
                  minHeight: '110px',
                  transition: 'transform 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '36px' }}>✖️</span>
                Multiplicación
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedOp('division');
                  setSelectedSubKey('division');
                }}
                style={{
                  background: 'linear-gradient(135deg,#3AA0FF,#0A55A0)',
                  color: '#FFF',
                  border: 'none',
                  padding: '24px 16px',
                  borderRadius: '18px',
                  fontWeight: 900,
                  fontSize: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(58,160,255,.3)',
                  minHeight: '110px',
                  transition: 'transform 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '36px' }}>➗</span>
                División
              </button>
            </div>
          </div>
        ) : !selectedSubKey ? (
          // Submenus for Adición or Sustracción
          <div>
            <button
              type="button"
              onClick={() => setSelectedOp(null)}
              style={{
                background: '#F0EDFF',
                color: '#6C28B4',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '10px',
                fontWeight: 900,
                fontSize: '13px',
                cursor: 'pointer',
                marginBottom: '1rem',
              }}
            >
              ⬅ Volver al menú
            </button>

            <h2
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 900,
                fontSize: '24px',
                color: '#1A0A3C',
                textAlign: 'center',
                margin: '0 0 16px',
              }}
            >
              {selectedOp === 'adicion' ? '➕ Adición' : '➖ Sustracción'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {selectedOp === 'adicion' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedSubKey('adicion_sin_llevar')}
                    style={{
                      background: 'linear-gradient(135deg,#06A570,#16876A)',
                      color: '#FFF',
                      border: 'none',
                      padding: '24px 16px',
                      borderRadius: '16px',
                      fontWeight: 900,
                      fontSize: '16px',
                      cursor: 'pointer',
                      minHeight: '110px',
                    }}
                  >
                    🟢<br />Sumas sin llevar
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSubKey('adicion_llevando')}
                    style={{
                      background: 'linear-gradient(135deg,#F5C518,#B78900)',
                      color: '#1A0A3C',
                      border: 'none',
                      padding: '24px 16px',
                      borderRadius: '16px',
                      fontWeight: 900,
                      fontSize: '16px',
                      cursor: 'pointer',
                      minHeight: '110px',
                    }}
                  >
                    🟡<br />Sumas llevando
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedSubKey('sustraccion_sin_llevar')}
                    style={{
                      background: 'linear-gradient(135deg,#06A570,#16876A)',
                      color: '#FFF',
                      border: 'none',
                      padding: '24px 16px',
                      borderRadius: '16px',
                      fontWeight: 900,
                      fontSize: '16px',
                      cursor: 'pointer',
                      minHeight: '110px',
                    }}
                  >
                    🟢<br />Sin llevar
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSubKey('sustraccion_llevando')}
                    style={{
                      background: 'linear-gradient(135deg,#F5C518,#B78900)',
                      color: '#1A0A3C',
                      border: 'none',
                      padding: '24px 16px',
                      borderRadius: '16px',
                      fontWeight: 900,
                      fontSize: '16px',
                      cursor: 'pointer',
                      minHeight: '110px',
                    }}
                  >
                    🟡<br />Con préstamo
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          // Examples List View
          <div>
            <button
              type="button"
              onClick={() => {
                if (selectedOp === 'multiplicacion' || selectedOp === 'division') {
                  setSelectedOp(null);
                  setSelectedSubKey(null);
                } else {
                  setSelectedSubKey(null);
                }
              }}
              style={{
                background: '#F0EDFF',
                color: '#6C28B4',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '10px',
                fontWeight: 900,
                fontSize: '13px',
                cursor: 'pointer',
                marginBottom: '1rem',
              }}
            >
              ⬅ Volver
            </button>

            <h2
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 900,
                fontSize: '22px',
                color: '#1A0A3C',
                textAlign: 'center',
                margin: '0 0 14px',
              }}
            >
              {selectedSubKey === 'adicion_sin_llevar' && '➕ Sumas sin llevar'}
              {selectedSubKey === 'adicion_llevando' && '➕ Sumas llevando'}
              {selectedSubKey === 'sustraccion_sin_llevar' && '➖ Sustracción sin llevar'}
              {selectedSubKey === 'sustraccion_llevando' && '➖ Sustracción con préstamo'}
              {selectedSubKey === 'multiplicacion' && '✖️ Multiplicación'}
              {selectedSubKey === 'division' && '➗ División'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(EXPLICACIONES[selectedSubKey] || []).map((ej, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '2px solid #FF8C2A',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    boxShadow: '0 4px 12px rgba(255,140,42,.15)',
                  }}
                >
                  <div style={{ flex: '0 0 200px', minWidth: '180px' }}>
                    <div
                      style={{
                        fontFamily: "'Baloo 2', sans-serif",
                        fontWeight: 900,
                        fontSize: '22px',
                        color: '#7A3200',
                        textAlign: 'center',
                        background: '#FFFBE8',
                        borderRadius: '10px',
                        padding: '8px',
                        marginBottom: '8px',
                        border: '1px solid #FFE9A8',
                      }}
                    >
                      {ej.op} = {ej.res}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#1A1A1A',
                        fontWeight: 700,
                        lineHeight: 1.5,
                        background: '#F9F8FD',
                        padding: '8px 10px',
                        borderRadius: '8px',
                      }}
                    >
                      {ej.proc.map((step, si) => (
                        <div key={si}>• {step}</div>
                      ))}
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontWeight: 900, color: '#3D1054', fontSize: '13px', marginBottom: '4px' }}>
                      📝 Explicación
                    </div>
                    <div style={{ fontSize: '14px', color: '#1A1A1A', lineHeight: 1.5, marginBottom: '10px' }}>
                      {ej.txt}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSpeak(ej.txt)}
                      style={{
                        background: 'linear-gradient(135deg,#3AA0FF,#7B2FBE)',
                        color: '#FFF',
                        border: 'none',
                        padding: '7px 16px',
                        borderRadius: '10px',
                        fontWeight: 900,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 3px 8px rgba(123,47,190,.3)',
                      }}
                    >
                      🔊 Escuchar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
