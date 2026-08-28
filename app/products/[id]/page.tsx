'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Shield, Minus, Plus, Zap } from 'lucide-react';
import { products, formatINR, getFillPercentage, getTimeRemaining, getFillColor, ENTRY_PRICE } from '../../lib/data';

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [filled, setFilled] = useState(product?.filledSlots ?? 0);

  useEffect(() => {
    if (!product || getFillPercentage(filled, product.totalSlots) >= 99) return;
    const interval = setInterval(() => {
      setFilled(f => Math.min(f + Math.floor(Math.random() * 2), product.totalSlots));
    }, 4000);
    return () => clearInterval(interval);
  }, [product, filled]);

  if (!product) return (
    <div style={{ paddingTop: '120px', textAlign: 'center', color: '#8A9BBE' }}>
      <p>Product not found.</p>
      <Link href="/" style={{ color: '#F5C518' }}>← Back to products</Link>
    </div>
  );

  const pct = getFillPercentage(filled, product.totalSlots);
  const fillColor = getFillColor(pct);
  const total = quantity * ENTRY_PRICE;

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#8A9BBE', textDecoration: 'none', fontSize: '14px', marginBottom: '32px' }}>
          <ArrowLeft size={16} /> Back to all products
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>
          {/* Left: image */}
          <div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#0A1628', aspectRatio: '4/3' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
              {[
                { icon: '🛡️', text: 'Aadhaar verified draw' },
                { icon: '🎲', text: 'Provably fair random' },
                { icon: '🚚', text: 'Free delivery to winner' },
                { icon: '💳', text: 'Razorpay secured' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ background: '#1E2A45', border: '1px solid #2A3A5C', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#8A9BBE', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{icon}</span>{text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: details */}
          <div>
            <span style={{ color: '#8A9BBE', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.brand} · {product.category}</span>
            <h1 style={{ color: '#F0EDE6', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, marginTop: '6px', marginBottom: '12px', letterSpacing: '-0.5px' }}>
              {product.name}
            </h1>
            <p style={{ color: '#8A9BBE', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>{product.description}</p>

            {/* Value */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', padding: '16px', background: '#1E2A45', borderRadius: '12px', border: '1px solid #2A3A5C' }}>
              <div>
                <div style={{ color: '#8A9BBE', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Product Value</div>
                <div className="gold-text" style={{ fontSize: '24px', fontWeight: 800 }}>{formatINR(product.value)}</div>
              </div>
              <div style={{ width: '1px', background: '#2A3A5C' }} />
              <div>
                <div style={{ color: '#8A9BBE', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Entry Price</div>
                <div style={{ color: '#22C55E', fontSize: '24px', fontWeight: 800 }}>₹{ENTRY_PRICE}</div>
              </div>
              <div style={{ width: '1px', background: '#2A3A5C' }} />
              <div>
                <div style={{ color: '#8A9BBE', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Time Left</div>
                <div style={{ color: pct >= 90 ? '#E8364F' : '#F0EDE6', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} /> {getTimeRemaining(product.endsAt)}
                </div>
              </div>
            </div>

            {/* Fill bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8A9BBE', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Users size={13} /> {filled.toLocaleString('en-IN')} / {product.totalSlots.toLocaleString('en-IN')} entries
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: fillColor }}>{pct}% filled</span>
              </div>
              <div style={{ background: '#0A0F1E', borderRadius: '100px', height: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${fillColor}99, ${fillColor})`, borderRadius: '100px', transition: 'width 0.8s ease' }} />
              </div>
              <div style={{ color: '#8A9BBE', fontSize: '12px', marginTop: '6px' }}>
                {(product.totalSlots - filled).toLocaleString('en-IN')} slots remaining
              </div>
            </div>

            {/* Quantity selector */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: '#8A9BBE', fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>Number of entries</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ background: '#1E2A45', border: '1px solid #2A3A5C', borderRadius: '8px', padding: '10px', color: '#F0EDE6', cursor: 'pointer' }}>
                  <Minus size={16} />
                </button>
                <span style={{ color: '#F0EDE6', fontSize: '20px', fontWeight: 700, minWidth: '50px', textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(q + 1, product.totalSlots - filled))}
                  style={{ background: '#1E2A45', border: '1px solid #2A3A5C', borderRadius: '8px', padding: '10px', color: '#F0EDE6', cursor: 'pointer' }}>
                  <Plus size={16} />
                </button>
                <div style={{ marginLeft: '8px' }}>
                  <div style={{ color: '#8A9BBE', fontSize: '11px' }}>Total cost</div>
                  <div className="gold-text" style={{ fontSize: '20px', fontWeight: 800 }}>₹{total}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {[5, 10, 25, 50].map(n => (
                  <button key={n} onClick={() => setQuantity(n)}
                    style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: quantity === n ? '1px solid #F5C518' : '1px solid #2A3A5C', background: quantity === n ? '#F5C51818' : 'transparent', color: quantity === n ? '#F5C518' : '#8A9BBE' }}>
                    ×{n}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button style={{
              width: '100%', background: 'linear-gradient(135deg, #F5C518, #C9A012)',
              color: '#0A0F1E', fontWeight: 800, fontSize: '16px',
              padding: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <Zap size={18} fill="currentColor" />
              Buy {quantity} {quantity === 1 ? 'Entry' : 'Entries'} — ₹{total}
            </button>

            <p style={{ color: '#4A5A7A', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
              <Shield size={11} style={{ display: 'inline', marginRight: '4px' }} />
              Secured by Razorpay · Instant entry confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
