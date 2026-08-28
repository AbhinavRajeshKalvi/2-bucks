'use client';
import { Trophy } from 'lucide-react';
import { recentWinners } from '../lib/data';

export default function WinnersTicker() {
  const items = [...recentWinners, ...recentWinners]; // duplicate for seamless loop

  return (
    <div style={{
      background: '#1E2A45',
      borderTop: '1px solid #2A3A5C',
      borderBottom: '1px solid #2A3A5C',
      padding: '10px 0',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      <div style={{
        background: '#F5C518',
        color: '#0A0F1E',
        fontSize: '11px',
        fontWeight: 800,
        padding: '4px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        whiteSpace: 'nowrap',
        zIndex: 2,
        flexShrink: 0,
      }}>
        <Trophy size={12} /> WINNERS
      </div>
      <div className="ticker-wrap" style={{ flex: 1, overflow: 'hidden' }}>
        <div className="ticker-content">
          {items.map((w, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '0 32px', color: '#8A9BBE', fontSize: '13px'
            }}>
              <span style={{ color: '#F0EDE6', fontWeight: 600 }}>{w.name}</span>
              <span>from {w.city} won</span>
              <span style={{ color: '#F5C518', fontWeight: 700 }}>{w.product}</span>
              <span style={{ color: '#22C55E', fontWeight: 700 }}>({w.amount})</span>
              <span style={{ color: '#2A3A5C' }}>·</span>
              <span style={{ fontSize: '11px' }}>{w.time}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
