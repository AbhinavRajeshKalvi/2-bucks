'use client';
import { useState } from 'react';
import { Shield, Camera, Upload, CheckCircle, Eye, EyeOff, Phone, User, ChevronRight, Lock } from 'lucide-react';

type Step = 'account' | 'phone' | 'aadhaar' | 'selfie' | 'review';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [step, setStep] = useState<Step>('account');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', otp: '', aadhaar: '' });

  const steps: Step[] = ['account', 'phone', 'aadhaar', 'selfie', 'review'];
  const stepIdx = steps.indexOf(step);

  const stepLabels: Record<Step, string> = {
    account: 'Account',
    phone: 'Phone OTP',
    aadhaar: 'Aadhaar',
    selfie: 'Live Photo',
    review: 'Review',
  };

  const inputStyle = {
    width: '100%', background: '#1E2A45', border: '1px solid #2A3A5C',
    borderRadius: '10px', padding: '12px 16px',
    color: '#F0EDE6', fontSize: '14px', outline: 'none',
  };

  const labelStyle = { color: '#8A9BBE', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '88px 16px 40px' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ background: 'linear-gradient(135deg, #F5C518, #C9A012)', borderRadius: '10px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '22px', color: '#0A0F1E' }}>₹</div>
            <span style={{ fontWeight: 800, fontSize: '24px' }}>
              <span className="gold-text">2</span><span style={{ color: '#F0EDE6' }}>Bucks</span>
            </span>
          </div>
          <p style={{ color: '#8A9BBE', fontSize: '14px' }}>
            {mode === 'signup' ? 'Create your verified account' : 'Welcome back'}
          </p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', background: '#1E2A45', borderRadius: '12px', padding: '4px', marginBottom: '28px', border: '1px solid #2A3A5C' }}>
          {(['signup', 'signin'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setStep('account'); }}
              style={{ flex: 1, padding: '10px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: 'none', background: mode === m ? 'linear-gradient(135deg, #F5C518, #C9A012)' : 'transparent', color: mode === m ? '#0A0F1E' : '#8A9BBE', transition: 'all 0.2s' }}>
              {m === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: '#1E2A45', border: '1px solid #2A3A5C', borderRadius: '20px', padding: '32px' }}>

          {/* Stepper (signup only) */}
          {mode === 'signup' && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
              {steps.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'unset' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: i < stepIdx ? '#22C55E' : i === stepIdx ? '#F5C518' : '#2A3A5C',
                      color: i <= stepIdx ? '#0A0F1E' : '#8A9BBE',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 800,
                    }}>
                      {i < stepIdx ? <CheckCircle size={14} /> : i + 1}
                    </div>
                    <span style={{ fontSize: '9px', color: i === stepIdx ? '#F5C518' : '#4A5A7A', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {stepLabels[s]}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ flex: 1, height: '1px', background: i < stepIdx ? '#22C55E' : '#2A3A5C', margin: '0 4px', marginBottom: '16px' }} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step content */}
          {(mode === 'signin' || step === 'account') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mode === 'signup' && (
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A9BBE' }} />
                    <input placeholder="As on Aadhaar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      style={{ ...inputStyle, paddingLeft: '42px' }} />
                  </div>
                </div>
              )}
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} placeholder="Min 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '42px' }} />
                  <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8A9BBE', cursor: 'pointer' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button onClick={() => mode === 'signup' ? setStep('phone') : null}
                style={{ width: '100%', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
                {mode === 'signup' ? 'Continue' : 'Sign In'} <ChevronRight size={16} />
              </button>
            </div>
          )}

          {mode === 'signup' && step === 'phone' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <Phone size={32} style={{ color: '#F5C518', marginBottom: '8px' }} />
                <h3 style={{ color: '#F0EDE6', fontWeight: 700, fontSize: '18px' }}>Verify your phone</h3>
                <p style={{ color: '#8A9BBE', fontSize: '13px', marginTop: '4px' }}>We'll send a one-time code to confirm your number.</p>
              </div>
              <div>
                <label style={labelStyle}>Mobile Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ ...inputStyle, width: '70px', flexShrink: 0, color: '#8A9BBE' }}>+91</div>
                  <input placeholder="10-digit number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>OTP</label>
                <input placeholder="6-digit OTP" maxLength={6} value={form.otp} onChange={e => setForm({ ...form, otp: e.target.value })} style={{ ...inputStyle, letterSpacing: '6px', fontSize: '18px', fontWeight: 700 }} />
              </div>
              <button onClick={() => setStep('aadhaar')} style={{ width: '100%', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                Verify & Continue
              </button>
            </div>
          )}

          {mode === 'signup' && step === 'aadhaar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <Shield size={32} style={{ color: '#F5C518', marginBottom: '8px' }} />
                <h3 style={{ color: '#F0EDE6', fontWeight: 700, fontSize: '18px' }}>Aadhaar Verification</h3>
                <p style={{ color: '#8A9BBE', fontSize: '13px', marginTop: '4px' }}>Required to ensure one account per person.</p>
              </div>
              <div style={{ background: '#0A0F1E', borderRadius: '12px', padding: '14px', border: '1px solid #2A3A5C', fontSize: '12px', color: '#8A9BBE', lineHeight: '1.7' }}>
                🔒 Your Aadhaar is verified through <strong style={{ color: '#F0EDE6' }}>Digio's UIDAI-authorised API</strong>. We never store your Aadhaar number — only the masked verification token.
              </div>
              <div>
                <label style={labelStyle}>Aadhaar Number</label>
                <input placeholder="XXXX XXXX XXXX" maxLength={14} value={form.aadhaar} onChange={e => setForm({ ...form, aadhaar: e.target.value })} style={{ ...inputStyle, letterSpacing: '4px', fontSize: '16px' }} />
              </div>
              <div>
                <label style={labelStyle}>Upload Aadhaar (front & back)</label>
                <div style={{ border: '2px dashed #2A3A5C', borderRadius: '10px', padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                  <Upload size={24} style={{ color: '#8A9BBE', margin: '0 auto 8px' }} />
                  <p style={{ color: '#8A9BBE', fontSize: '13px' }}>Drop files here or click to upload</p>
                  <p style={{ color: '#4A5A7A', fontSize: '11px', marginTop: '4px' }}>JPG, PNG or PDF · Max 5MB each</p>
                </div>
              </div>
              <button onClick={() => setStep('selfie')} style={{ width: '100%', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                Verify Aadhaar
              </button>
            </div>
          )}

          {mode === 'signup' && step === 'selfie' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <Camera size={32} style={{ color: '#F5C518', marginBottom: '8px' }} />
                <h3 style={{ color: '#F0EDE6', fontWeight: 700, fontSize: '18px' }}>Live Photo Check</h3>
                <p style={{ color: '#8A9BBE', fontSize: '13px', marginTop: '4px' }}>Take a selfie right now to match against your Aadhaar photo.</p>
              </div>
              <div style={{ background: '#0A0F1E', borderRadius: '16px', aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #2A3A5C', gap: '12px' }}>
                <Camera size={48} style={{ color: '#2A3A5C' }} />
                <p style={{ color: '#4A5A7A', fontSize: '13px' }}>Camera preview will appear here</p>
              </div>
              <div style={{ background: '#F5C51810', border: '1px solid #F5C51830', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#8A9BBE' }}>
                <strong style={{ color: '#F5C518' }}>Tips for a good selfie:</strong> Good lighting, face clearly visible, no glasses, look straight at camera.
              </div>
              <button style={{ width: '100%', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => setStep('review')}>
                <Camera size={18} /> Take Photo
              </button>
            </div>
          )}

          {mode === 'signup' && step === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: '#22C55E20', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <CheckCircle size={32} style={{ color: '#22C55E' }} />
              </div>
              <div>
                <h3 style={{ color: '#F0EDE6', fontWeight: 800, fontSize: '20px', marginBottom: '8px' }}>Under Review</h3>
                <p style={{ color: '#8A9BBE', fontSize: '14px', lineHeight: '1.7' }}>
                  Your KYC documents have been submitted. Our team will verify your Aadhaar and selfie within <strong style={{ color: '#F0EDE6' }}>2–4 hours</strong>. You'll get an email once approved.
                </p>
              </div>
              <div style={{ background: '#0A0F1E', borderRadius: '12px', padding: '16px', textAlign: 'left' }}>
                {[{ label: 'Name', value: form.name || 'Abhinav' }, { label: 'Email', value: form.email || 'user@email.com' }, { label: 'Phone', value: form.phone || '+91 XXXXXXXXXX' }, { label: 'Aadhaar', value: 'XXXX XXXX ' + (form.aadhaar?.slice(-4) || 'XXXX') }, { label: 'Selfie', value: '✓ Submitted' }].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1E2A45', fontSize: '13px' }}>
                    <span style={{ color: '#8A9BBE' }}>{label}</span>
                    <span style={{ color: '#F0EDE6', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#4A5A7A', fontSize: '12px' }}>
                <Lock size={11} /> All data is encrypted and stored securely
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#4A5A7A', fontSize: '12px', marginTop: '20px' }}>
          By creating an account, you agree to our{' '}
          <a href="#" style={{ color: '#8A9BBE', textDecoration: 'underline' }}>Terms</a> and{' '}
          <a href="#" style={{ color: '#8A9BBE', textDecoration: 'underline' }}>Privacy Policy</a>.
          You must be 18+ to play.
        </p>
      </div>
    </div>
  );
}
