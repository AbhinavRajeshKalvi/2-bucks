import { Shield, Zap, Trophy, RotateCcw, Lock, Users } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-1.5px', color: '#F0EDE6', marginBottom: '16px' }}>
            How <span className="gold-text">2Bucks</span> works
          </h1>
          <p style={{ color: '#8A9BBE', fontSize: '17px', lineHeight: '1.7', maxWidth: '500px', margin: '0 auto' }}>
            Completely transparent, fair, and simple. Every ₹2 entry has a real chance at winning something worth thousands.
          </p>
        </div>

        {/* Main steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '64px' }}>
          {[
            {
              step: '01', icon: <Users size={24} />, title: 'Verify once with Aadhaar',
              desc: 'Create a verified account using your Aadhaar and a live selfie. This ensures every user is real and has only one account — keeping the platform fair for everyone.',
              detail: 'Verification is done through Digio, a UIDAI-authorised partner. We never store your Aadhaar number.',
            },
            {
              step: '02', icon: <Zap size={24} />, title: 'Browse and pick a product',
              desc: 'Each product draw shows you exactly how many total slots exist (= product value in rupees), how many are filled, and how much time is left.',
              detail: 'A ₹54,990 PS5 has 27,495 total slots at ₹2 each. That\'s the full value covered.',
            },
            {
              step: '03', icon: <Lock size={24} />, title: 'Buy entries for ₹2 each',
              desc: 'Pay via Razorpay — UPI, cards, netbanking all supported. You can buy as many entries as you want for a single draw. More entries = higher odds.',
              detail: 'Payments are secured and held in escrow until the draw completes.',
            },
            {
              step: '04', icon: <RotateCcw size={24} />, title: 'Draw runs when full',
              desc: 'Once every slot is filled, the draw triggers automatically. A verifiable random number is generated using a cryptographic process seeded with a public randomness beacon.',
              detail: 'All entry IDs are published before the draw. The hash of the beacon + entry list determines the winner.',
            },
            {
              step: '05', icon: <Trophy size={24} />, title: 'Winner gets the product',
              desc: 'The winning entry is announced publicly. The winner is notified by email and SMS, and the product is shipped to their verified address within 7 business days.',
              detail: 'Didn\'t win? Your entry history is always visible in your account dashboard.',
            },
          ].map(({ step, icon, title, desc, detail }, i) => (
            <div key={step} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', padding: '32px 0', borderBottom: i < 4 ? '1px solid #1E2A45' : 'none' }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #F5C51820, #F5C51808)',
                  border: '1px solid #F5C51830',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#F5C518',
                }}>{icon}</div>
              </div>
              <div>
                <div className="gold-text" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '6px' }}>STEP {step}</div>
                <h3 style={{ color: '#F0EDE6', fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>{title}</h3>
                <p style={{ color: '#8A9BBE', fontSize: '15px', lineHeight: '1.7', marginBottom: '10px' }}>{desc}</p>
                <p style={{ color: '#4A5A7A', fontSize: '13px', lineHeight: '1.6', fontStyle: 'italic' }}>{detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ color: '#F0EDE6', fontSize: '28px', fontWeight: 800, marginBottom: '32px', letterSpacing: '-0.5px' }}>
            Common questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { q: 'What if a draw never fills up?', a: 'Every entry is fully refunded if a draw doesn\'t complete within its deadline. This has never happened — but it\'s our guarantee.' },
              { q: 'How do I know the draw is fair?', a: 'We publish all entry IDs before the draw. The winner is determined by a hash of those IDs combined with a public randomness beacon (NIST). Anyone can verify the outcome.' },
              { q: 'Can I have more than one account?', a: 'No. Aadhaar + live selfie verification ensures one person = one account. Attempts to create duplicates are automatically detected and banned.' },
              { q: 'What happens after I win?', a: 'You\'ll be notified by email and SMS. Share your delivery address and the product ships within 7 business days.' },
              { q: 'Is this legal in India?', a: '2Bucks operates under applicable Indian gaming and prize draw regulations. We\'re registered in a jurisdiction that permits this model, and consult with legal counsel regularly.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ padding: '20px 0', borderBottom: '1px solid #1E2A45' }}>
                <h4 style={{ color: '#F0EDE6', fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>{q}</h4>
                <p style={{ color: '#8A9BBE', fontSize: '14px', lineHeight: '1.7' }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '64px', padding: '48px', background: '#1E2A45', borderRadius: '20px', border: '1px solid #2A3A5C' }}>
          <h3 style={{ color: '#F0EDE6', fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Ready to play?</h3>
          <p style={{ color: '#8A9BBE', fontSize: '15px', marginBottom: '24px' }}>Verify your account in under 5 minutes and start entering for ₹2.</p>
          <a href="/auth" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '16px', padding: '14px 36px', borderRadius: '12px', textDecoration: 'none' }}>
            Create Free Account
          </a>
        </div>
      </div>
    </div>
  );
}
