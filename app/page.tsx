'use client';
import { useState } from 'react';
import { Search, SlidersHorizontal, Zap } from 'lucide-react';
import ProductCard from './components/ProductCard';
import WinnersTicker from './components/WinnersTicker';
import { products, type Category } from './lib/data';

const categories: (Category | 'All')[] = ['All', 'Electronics', 'Phones', 'Laptops', 'Vehicles', 'Gaming', 'Appliances'];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'hot' | 'ending' | 'new' | 'value'>('hot');

  const filtered = products
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'hot') return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
      if (sortBy === 'ending') return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
      if (sortBy === 'value') return b.value - a.value;
      return 0;
    });

  return (
    <>
      <section style={{
        paddingTop: '96px', paddingBottom: '60px',
        background: 'radial-gradient(ellipse at 60% 0%, #1E2A4520 0%, transparent 60%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, #F5C51812 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ maxWidth: '640px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#1E2A45', border: '1px solid #2A3A5C',
              borderRadius: '100px', padding: '6px 14px', marginBottom: '24px'
            }}>
              <Zap size={13} style={{ color: '#F5C518' }} fill="#F5C518" />
              <span style={{ color: '#8A9BBE', fontSize: '12px', fontWeight: 600 }}>Live draws happening now</span>
              <span style={{ background: '#E8364F', color: 'white', fontSize: '10px', fontWeight: 800, padding: '1px 7px', borderRadius: '100px' }}>4 LIVE</span>
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: '1.05', letterSpacing: '-2px', marginBottom: '20px' }}>
              <span style={{ color: '#F0EDE6' }}>Win anything.</span><br />
              <span className="gold-text">Pay just ₹2.</span>
            </h1>
            <p style={{ color: '#8A9BBE', fontSize: '17px', lineHeight: '1.7', marginBottom: '32px', maxWidth: '480px' }}>
              Enter product draws for <strong style={{ color: '#F0EDE6' }}>₹2 per slot</strong>. Every draw fills up, one entry wins. iPhones, laptops, bikes — all for the price of a candy.
            </p>
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              {[{ value: '₹2', label: 'Per Entry, Always' }, { value: '1,24,000+', label: 'Winners So Far' }, { value: '100%', label: 'Verified Users' }].map(({ value, label }) => (
                <div key={label}>
                  <div className="gold-text" style={{ fontSize: '22px', fontWeight: 800, lineHeight: '1' }}>{value}</div>
                  <div style={{ color: '#8A9BBE', fontSize: '12px', marginTop: '4px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WinnersTicker />

      <section style={{ padding: '40px 0 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A9BBE' }} />
                <input type="text" placeholder="Search products, brands..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', background: '#1E2A45', border: '1px solid #2A3A5C', borderRadius: '10px', padding: '10px 14px 10px 40px', color: '#F0EDE6', fontSize: '14px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1E2A45', border: '1px solid #2A3A5C', borderRadius: '10px', padding: '0 14px' }}>
                <SlidersHorizontal size={14} style={{ color: '#8A9BBE' }} />
                <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  style={{ background: 'transparent', border: 'none', color: '#F0EDE6', fontSize: '14px', outline: 'none', padding: '10px 0', cursor: 'pointer' }}>
                  <option value="hot" style={{ background: '#1E2A45' }}>Most Popular</option>
                  <option value="ending" style={{ background: '#1E2A45' }}>Ending Soon</option>
                  <option value="value" style={{ background: '#1E2A45' }}>Highest Value</option>
                  <option value="new" style={{ background: '#1E2A45' }}>Newest</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{ padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: activeCategory === cat ? '1px solid #F5C518' : '1px solid #2A3A5C', background: activeCategory === cat ? '#F5C51818' : 'transparent', color: activeCategory === cat ? '#F5C518' : '#8A9BBE', transition: 'all 0.15s' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div style={{ color: '#8A9BBE', fontSize: '13px', marginBottom: '20px' }}>
            Showing <strong style={{ color: '#F0EDE6' }}>{filtered.length}</strong> active draws
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filtered.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#8A9BBE' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p style={{ fontSize: '16px' }}>No products match your filters</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }}
                style={{ marginTop: '16px', color: '#F5C518', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '80px 0 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ background: 'linear-gradient(135deg, #1E2A45, #141C30)', border: '1px solid #2A3A5C', borderRadius: '20px', padding: 'clamp(32px, 5vw, 60px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#F0EDE6', marginBottom: '12px', letterSpacing: '-1px' }}>How 2Bucks works</h2>
              <p style={{ color: '#8A9BBE', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>Transparent, fair, and simple. Every draw runs to completion.</p>
              <a href="/how-it-works" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 700, fontSize: '14px', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none' }}>Learn more</a>
            </div>
            {[
              { step: '01', title: 'Pick a product', desc: 'Browse draws and choose what you want to win.' },
              { step: '02', title: 'Buy entries', desc: 'Each entry costs ₹2. Buy as many as you like.' },
              { step: '03', title: 'Draw happens', desc: 'Once all slots fill, a verified random draw picks 1 winner.' },
              { step: '04', title: 'Win & receive', desc: 'Winner gets the product delivered to their door.' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div className="gold-text" style={{ fontSize: '13px', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px' }}>{step}</div>
                <h3 style={{ color: '#F0EDE6', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{title}</h3>
                <p style={{ color: '#8A9BBE', fontSize: '13px', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
