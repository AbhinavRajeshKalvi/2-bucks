import Link from 'next/link';
import { Shield, Lock, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#070B14', borderTop: '1px solid #1E2A45', marginTop: '80px' }}>
      {/* Trust bar */}
      <div style={{ borderBottom: '1px solid #1E2A45', padding: '20px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
            {[
              { icon: <Shield size={16} />, text: 'Aadhaar-verified users only' },
              { icon: <Lock size={16} />, text: 'Razorpay secured payments' },
              { icon: <CheckCircle size={16} />, text: 'Provably fair draws' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8A9BBE', fontSize: '13px' }}>
                <span style={{ color: '#F5C518' }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #F5C518, #C9A012)',
                borderRadius: '8px', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '16px', color: '#0A0F1E'
              }}>₹</div>
              <span style={{ fontWeight: 800, fontSize: '18px' }}>
                <span className="gold-text">2</span>
                <span style={{ color: '#F0EDE6' }}>Bucks</span>
              </span>
            </div>
            <p style={{ color: '#8A9BBE', fontSize: '13px', lineHeight: '1.7' }}>
              India's fairest product draw platform. Win big for just ₹2.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Platform</h4>
            {['Products', 'How It Works', 'Winners', 'Leaderboard'].map(link => (
              <Link key={link} href="#" style={{ display: 'block', color: '#8A9BBE', fontSize: '13px', marginBottom: '8px', textDecoration: 'none' }}>{link}</Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Support</h4>
            {['Help Center', 'Contact Us', 'Report an Issue', 'Responsible Gaming'].map(link => (
              <Link key={link} href="#" style={{ display: 'block', color: '#8A9BBE', fontSize: '13px', marginBottom: '8px', textDecoration: 'none' }}>{link}</Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Legal</h4>
            {['Terms of Service', 'Privacy Policy', 'Refund Policy', 'Draw Rules'].map(link => (
              <Link key={link} href="#" style={{ display: 'block', color: '#8A9BBE', fontSize: '13px', marginBottom: '8px', textDecoration: 'none' }}>{link}</Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1E2A45', marginTop: '40px', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#4A5A7A', fontSize: '12px' }}>
            © 2025 2Bucks. All rights reserved. Operated under applicable Indian gaming laws.
          </p>
          <p style={{ color: '#4A5A7A', fontSize: '12px' }}>
            18+ only · Play responsibly
          </p>
        </div>
      </div>
    </footer>
  );
}
