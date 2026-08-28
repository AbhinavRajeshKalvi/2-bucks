import { Trophy, Star } from 'lucide-react';

const allWinners = [
  { name: 'Priya S.', city: 'Mumbai', product: 'AirPods Pro 2', value: '₹24,900', entries: 12, date: 'Jul 3, 2025', avatar: 'PS' },
  { name: 'Rahul K.', city: 'Bangalore', product: 'OnePlus 12', value: '₹64,999', entries: 45, date: 'Jul 3, 2025', avatar: 'RK' },
  { name: 'Anita M.', city: 'Delhi', product: 'Nintendo Switch', value: '₹29,999', entries: 8, date: 'Jul 2, 2025', avatar: 'AM' },
  { name: 'Vikram P.', city: 'Hyderabad', product: 'Sony WH-1000XM5', value: '₹29,990', entries: 30, date: 'Jul 2, 2025', avatar: 'VP' },
  { name: 'Sneha R.', city: 'Chennai', product: 'iPad Air 5', value: '₹59,900', entries: 5, date: 'Jul 1, 2025', avatar: 'SR' },
  { name: 'Arjun D.', city: 'Pune', product: 'Redmi TV 55"', value: '₹42,999', entries: 20, date: 'Jul 1, 2025', avatar: 'AD' },
  { name: 'Meera T.', city: 'Kolkata', product: 'Dyson Airwrap', value: '₹44,900', entries: 2, date: 'Jun 30, 2025', avatar: 'MT' },
  { name: 'Suresh G.', city: 'Ahmedabad', product: 'Samsung Tablet', value: '₹38,999', entries: 60, date: 'Jun 30, 2025', avatar: 'SG' },
  { name: 'Divya N.', city: 'Jaipur', product: 'Canon EOS R50', value: '₹62,995', entries: 15, date: 'Jun 29, 2025', avatar: 'DN' },
  { name: 'Karthik B.', city: 'Coimbatore', product: 'Bose QuietComfort 45', value: '₹29,900', entries: 10, date: 'Jun 29, 2025', avatar: 'KB' },
];

const avatarColors = ['#E8364F', '#F5C518', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#06B6D4', '#84CC16', '#EF4444'];

export default function WinnersPage() {
  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: 'linear-gradient(135deg, #F5C51820, #F5C51808)', border: '1px solid #F5C51840', borderRadius: '20px', marginBottom: '16px' }}>
            <Trophy size={28} style={{ color: '#F5C518' }} />
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1px', color: '#F0EDE6', marginBottom: '12px' }}>
            Wall of <span className="gold-text">Winners</span>
          </h1>
          <p style={{ color: '#8A9BBE', fontSize: '16px' }}>Real people, real wins. Every draw fully transparent and verifiable.</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {[
            { value: '1,24,000+', label: 'Total Winners' },
            { value: '₹8.4 Cr+', label: 'Products Won' },
            { value: '540+', label: 'Cities Covered' },
            { value: '98.7%', label: 'Delivery Rate' },
          ].map(({ value, label }) => (
            <div key={label} style={{ background: '#1E2A45', border: '1px solid #2A3A5C', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <div className="gold-text" style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>{value}</div>
              <div style={{ color: '#8A9BBE', fontSize: '12px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Recent winners */}
        <h2 style={{ color: '#F0EDE6', fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Recent Winners</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {allWinners.map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#1E2A45', borderRadius: '12px', border: '1px solid #2A3A5C', marginBottom: '8px' }}>
              {/* Avatar */}
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: avatarColors[i % avatarColors.length] + '30', border: `2px solid ${avatarColors[i % avatarColors.length]}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: avatarColors[i % avatarColors.length], fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                {w.avatar}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#F0EDE6', fontWeight: 700, fontSize: '14px' }}>{w.name}</span>
                  <span style={{ color: '#8A9BBE', fontSize: '12px' }}>from {w.city}</span>
                  {w.entries <= 5 && (
                    <span style={{ background: '#22C55E20', color: '#22C55E', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '100px', border: '1px solid #22C55E30' }}>
                      <Star size={8} style={{ display: 'inline' }} /> Lucky win!
                    </span>
                  )}
                </div>
                <div style={{ color: '#8A9BBE', fontSize: '12px', marginTop: '2px' }}>
                  Won <strong style={{ color: '#F5C518' }}>{w.product}</strong> · {w.entries} entries used · {w.date}
                </div>
              </div>
              {/* Value */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: '#22C55E', fontWeight: 800, fontSize: '16px' }}>{w.value}</div>
                <div style={{ color: '#4A5A7A', fontSize: '11px' }}>product value</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <p style={{ color: '#8A9BBE', fontSize: '15px', marginBottom: '20px' }}>Your name could be next.</p>
          <a href="/" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '15px', padding: '12px 32px', borderRadius: '10px', textDecoration: 'none' }}>
            Browse Active Draws
          </a>
        </div>
      </div>
    </div>
  );
}
