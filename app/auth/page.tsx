'use client';
import { useState, useTransition, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Camera, Upload, CheckCircle, Eye, EyeOff, Phone, User, ChevronRight, Lock, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { signup, login } from '@/app/actions/auth';
import { sendOtp, verifyOtp, submitAadhaar, submitSelfie } from '@/app/actions/kyc';

type Step = 'account' | 'phone' | 'aadhaar' | 'selfie' | 'review';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [step, setStep] = useState<Step>('account');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', otp: '', aadhaar: '' });
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // --- Phone / OTP step state ---
  const [otpSent, setOtpSent] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setTimeout(() => setOtpCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCooldown]);

  function handleSendOtp() {
    setOtpError(null);
    startTransition(async () => {
      const result = await sendOtp(form.phone);
      if (!result.success) {
        setOtpError(result.message);
        return;
      }
      setOtpSent(true);
      setDevCode(result.devCode);
      setOtpCooldown(30);
    });
  }

  function handleVerifyOtp() {
    setOtpError(null);
    startTransition(async () => {
      const result = await verifyOtp(form.otp);
      if (!result.success) {
        setOtpError(result.message);
        return;
      }
      setStep('aadhaar');
    });
  }

  // --- Aadhaar step state ---
  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const aadhaarDigits = form.aadhaar.replace(/\D/g, '');
  const canSubmitAadhaar = aadhaarDigits.length === 12 && !!aadhaarFront;

  function handleSubmitAadhaar() {
    setFormError(null);
    setFieldErrors({});
    startTransition(async () => {
      const fd = new FormData();
      fd.set('aadhaarNumber', aadhaarDigits);
      if (aadhaarFront) fd.set('front', aadhaarFront);
      if (aadhaarBack) fd.set('back', aadhaarBack);

      const result = await submitAadhaar(fd);
      if (!result.success) {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        if (result.message) setFormError(result.message);
        return;
      }
      setStep('selfie');
    });
  }

  // --- Selfie step state ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<{ blob: Blob; url: string } | null>(null);
  const selfieFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== 'selfie' || capturedPhoto) return;

    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setCameraError('Camera access was denied or is unavailable. You can upload a photo instead.'));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [step, capturedPhoto]);

  function handleCapturePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (!blob) return;
      setCapturedPhoto({ blob, url: URL.createObjectURL(blob) });
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }, 'image/jpeg', 0.9);
  }

  function handleSelfieFileChosen(file: File | null) {
    if (!file) return;
    setCapturedPhoto({ blob: file, url: URL.createObjectURL(file) });
  }

  function handleRetakePhoto() {
    if (capturedPhoto) URL.revokeObjectURL(capturedPhoto.url);
    setCapturedPhoto(null);
    setCameraError(null);
  }

  function handleSubmitSelfie() {
    if (!capturedPhoto) return;
    setFormError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set('photo', capturedPhoto.blob, 'selfie.jpg');
      const result = await submitSelfie(fd);
      if (!result.success) {
        setFormError(result.message);
        return;
      }
      setStep('review');
    });
  }

  function handleAccountSubmit() {
  setFormError(null);
  setFieldErrors({});

  startTransition(async () => {
    try {
      if (mode === 'signup') {
        const result = await signup({
          name: form.name,
          email: form.email,
          password: form.password,
        });

        if (!result.success) {
          if (result.fieldErrors) {
            setFieldErrors(result.fieldErrors);
          }

          if (result.message) {
            setFormError(result.message);
          }

          return;
        }

        // Account created & signed in.
        setStep('phone');
      } else {
        const result = await login({
          email: form.email,
          password: form.password,
        });

        if (!result.success) {
          if (result.fieldErrors) {
            setFieldErrors(result.fieldErrors);
          }

          setFormError(
            result.message ??
              'Something went wrong. Please try again.'
          );

          return;
        }

        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Authentication error:', error);

      setFormError(
        'Unable to sign in right now. Please try again.'
      );
    }
  });
}

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
    <div style={{ minHeight: '100vh', paddingTop: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '88px 16px 40px' }}>
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
            <button key={m} onClick={() => { setMode(m); setStep('account'); setFormError(null); setFieldErrors({}); }}
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
              {formError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#E8364F18', border: '1px solid #E8364F40', borderRadius: '10px', padding: '10px 12px', color: '#F0A0AC', fontSize: '13px' }}>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} /> {formError}
                </div>
              )}
              {mode === 'signup' && (
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A9BBE' }} />
                    <input placeholder="As on Aadhaar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      style={{ ...inputStyle, paddingLeft: '42px' }} />
                  </div>
                  {fieldErrors.name && <p style={{ color: '#E8364F', fontSize: '12px', marginTop: '6px' }}>{fieldErrors.name[0]}</p>}
                </div>
              )}
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                {fieldErrors.email && <p style={{ color: '#E8364F', fontSize: '12px', marginTop: '6px' }}>{fieldErrors.email[0]}</p>}
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
                {fieldErrors.password && <p style={{ color: '#E8364F', fontSize: '12px', marginTop: '6px' }}>{fieldErrors.password[0]}</p>}
              </div>
              <button onClick={handleAccountSubmit} disabled={isPending}
                style={{ width: '100%', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: isPending ? 'default' : 'pointer', opacity: isPending ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
                {isPending ? 'Please wait…' : mode === 'signup' ? 'Continue' : 'Sign In'} {!isPending && <ChevronRight size={16} />}
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
              {otpError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#E8364F18', border: '1px solid #E8364F40', borderRadius: '10px', padding: '10px 12px', color: '#F0A0AC', fontSize: '13px' }}>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} /> {otpError}
                </div>
              )}
              <div>
                <label style={labelStyle}>Mobile Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ ...inputStyle, width: '70px', flexShrink: 0, color: '#8A9BBE' }}>+91</div>
                  <input placeholder="10-digit number" maxLength={10} disabled={otpSent}
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                    style={{ ...inputStyle, opacity: otpSent ? 0.6 : 1 }} />
                </div>
              </div>

              {!otpSent ? (
                <button onClick={handleSendOtp} disabled={isPending || !/^[6-9]\d{9}$/.test(form.phone)}
                  style={{ width: '100%', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', opacity: (isPending || !/^[6-9]\d{9}$/.test(form.phone)) ? 0.5 : 1 }}>
                  {isPending ? 'Sending…' : 'Send OTP'}
                </button>
              ) : (
                <>
                  {devCode && (
                    <div style={{ background: '#F5C51810', border: '1px solid #F5C51830', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#F0EDE6', textAlign: 'center' }}>
                      <strong style={{ color: '#F5C518' }}>Dev mode</strong> — no SMS provider is wired up yet, so here's your code:
                      <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '4px', marginTop: '6px', color: '#F5C518' }}>{devCode}</div>
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>OTP</label>
                    <input placeholder="6-digit OTP" maxLength={6} value={form.otp}
                      onChange={e => setForm({ ...form, otp: e.target.value.replace(/\D/g, '') })}
                      style={{ ...inputStyle, letterSpacing: '6px', fontSize: '18px', fontWeight: 700, textAlign: 'center' }} />
                  </div>
                  <button onClick={handleVerifyOtp} disabled={isPending || form.otp.length !== 6}
                    style={{ width: '100%', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', opacity: (isPending || form.otp.length !== 6) ? 0.5 : 1 }}>
                    {isPending ? 'Verifying…' : 'Verify & Continue'}
                  </button>
                  <button onClick={handleSendOtp} disabled={isPending || otpCooldown > 0}
                    style={{ background: 'none', border: 'none', color: otpCooldown > 0 ? '#4A5A7A' : '#8A9BBE', fontSize: '12px', cursor: otpCooldown > 0 ? 'default' : 'pointer', textDecoration: otpCooldown > 0 ? 'none' : 'underline' }}>
                    {otpCooldown > 0 ? `Resend code in ${otpCooldown}s` : 'Resend code'}
                  </button>
                </>
              )}
            </div>
          )}

          {mode === 'signup' && step === 'aadhaar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <Shield size={32} style={{ color: '#F5C518', marginBottom: '8px' }} />
                <h3 style={{ color: '#F0EDE6', fontWeight: 700, fontSize: '18px' }}>Aadhaar Verification</h3>
                <p style={{ color: '#8A9BBE', fontSize: '13px', marginTop: '4px' }}>Required to ensure one account per person.</p>
              </div>
              {formError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#E8364F18', border: '1px solid #E8364F40', borderRadius: '10px', padding: '10px 12px', color: '#F0A0AC', fontSize: '13px' }}>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} /> {formError}
                </div>
              )}
              <div style={{ background: '#0A0F1E', borderRadius: '12px', padding: '14px', border: '1px solid #2A3A5C', fontSize: '12px', color: '#8A9BBE', lineHeight: '1.7' }}>
                🔒 Documents are uploaded and stored for manual review. We never store your Aadhaar number — only the last 4 digits.
              </div>
              <div>
                <label style={labelStyle}>Aadhaar Number</label>
                <input placeholder="XXXX XXXX XXXX" maxLength={14}
                  value={form.aadhaar}
                  onChange={e => setForm({ ...form, aadhaar: e.target.value.replace(/[^\d\s]/g, '') })}
                  style={{ ...inputStyle, letterSpacing: '4px', fontSize: '16px' }} />
                {fieldErrors.aadhaarNumber && <p style={{ color: '#E8364F', fontSize: '12px', marginTop: '6px' }}>{fieldErrors.aadhaarNumber[0]}</p>}
              </div>
              <div>
                <label style={labelStyle}>Upload Aadhaar (front required, back optional)</label>
                <input ref={frontInputRef} type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }}
                  onChange={e => setAadhaarFront(e.target.files?.[0] ?? null)} />
                <input ref={backInputRef} type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }}
                  onChange={e => setAadhaarBack(e.target.files?.[0] ?? null)} />

                <div onClick={() => frontInputRef.current?.click()}
                  style={{ border: `2px dashed ${aadhaarFront ? '#22C55E' : '#2A3A5C'}`, borderRadius: '10px', padding: '18px', textAlign: 'center', cursor: 'pointer', marginBottom: '8px' }}>
                  {aadhaarFront ? (
                    <><FileText size={20} style={{ color: '#22C55E', margin: '0 auto 6px' }} />
                    <p style={{ color: '#F0EDE6', fontSize: '13px' }}>{aadhaarFront.name}</p>
                    <p style={{ color: '#4A5A7A', fontSize: '11px', marginTop: '2px' }}>Front — click to change</p></>
                  ) : (
                    <><Upload size={20} style={{ color: '#8A9BBE', margin: '0 auto 6px' }} />
                    <p style={{ color: '#8A9BBE', fontSize: '13px' }}>Click to upload front</p></>
                  )}
                </div>
                <div onClick={() => backInputRef.current?.click()}
                  style={{ border: `2px dashed ${aadhaarBack ? '#22C55E' : '#2A3A5C'}`, borderRadius: '10px', padding: '18px', textAlign: 'center', cursor: 'pointer' }}>
                  {aadhaarBack ? (
                    <><FileText size={20} style={{ color: '#22C55E', margin: '0 auto 6px' }} />
                    <p style={{ color: '#F0EDE6', fontSize: '13px' }}>{aadhaarBack.name}</p>
                    <p style={{ color: '#4A5A7A', fontSize: '11px', marginTop: '2px' }}>Back — click to change</p></>
                  ) : (
                    <><Upload size={20} style={{ color: '#8A9BBE', margin: '0 auto 6px' }} />
                    <p style={{ color: '#8A9BBE', fontSize: '13px' }}>Click to upload back (optional)</p></>
                  )}
                </div>
                {fieldErrors.front && <p style={{ color: '#E8364F', fontSize: '12px', marginTop: '6px' }}>{fieldErrors.front[0]}</p>}
                <p style={{ color: '#4A5A7A', fontSize: '11px', marginTop: '6px' }}>JPG, PNG or PDF · Max 5MB each</p>
              </div>
              <button onClick={handleSubmitAadhaar} disabled={isPending || !canSubmitAadhaar}
                style={{ width: '100%', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', opacity: (isPending || !canSubmitAadhaar) ? 0.5 : 1 }}>
                {isPending ? 'Uploading…' : 'Submit Aadhaar'}
              </button>
            </div>
          )}

          {mode === 'signup' && step === 'selfie' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <Camera size={32} style={{ color: '#F5C518', marginBottom: '8px' }} />
                <h3 style={{ color: '#F0EDE6', fontWeight: 700, fontSize: '18px' }}>Live Photo Check</h3>
                <p style={{ color: '#8A9BBE', fontSize: '13px', marginTop: '4px' }}>Take a selfie right now to confirm it's really you.</p>
              </div>
              {formError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#E8364F18', border: '1px solid #E8364F40', borderRadius: '10px', padding: '10px 12px', color: '#F0A0AC', fontSize: '13px' }}>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} /> {formError}
                </div>
              )}

              <div style={{ background: '#0A0F1E', borderRadius: '16px', aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #2A3A5C', gap: '12px', overflow: 'hidden', position: 'relative' }}>
                {capturedPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={capturedPhoto.url} alt="Captured selfie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : cameraError ? (
                  <>
                    <Camera size={48} style={{ color: '#2A3A5C' }} />
                    <p style={{ color: '#8A9BBE', fontSize: '13px', padding: '0 20px', textAlign: 'center' }}>{cameraError}</p>
                  </>
                ) : (
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                )}
              </div>

              {!capturedPhoto && (
                <div style={{ background: '#F5C51810', border: '1px solid #F5C51830', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#8A9BBE' }}>
                  <strong style={{ color: '#F5C518' }}>Tips for a good selfie:</strong> Good lighting, face clearly visible, no glasses, look straight at camera.
                </div>
              )}

              <input ref={selfieFileInputRef} type="file" accept="image/*" capture="user" style={{ display: 'none' }}
                onChange={e => handleSelfieFileChosen(e.target.files?.[0] ?? null)} />

              {capturedPhoto ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleRetakePhoto}
                    style={{ flex: 1, background: '#1E2A45', border: '1px solid #2A3A5C', color: '#F0EDE6', fontWeight: 700, fontSize: '14px', padding: '14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <RefreshCw size={15} /> Retake
                  </button>
                  <button onClick={handleSubmitSelfie} disabled={isPending}
                    style={{ flex: 1, background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '14px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', opacity: isPending ? 0.6 : 1 }}>
                    {isPending ? 'Uploading…' : 'Continue'}
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={handleCapturePhoto} disabled={!!cameraError}
                    style={{ width: '100%', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: cameraError ? 0.5 : 1 }}>
                    <Camera size={18} /> Take Photo
                  </button>
                  {cameraError && (
                    <button onClick={() => selfieFileInputRef.current?.click()}
                      style={{ width: '100%', background: '#1E2A45', border: '1px solid #2A3A5C', color: '#F0EDE6', fontWeight: 700, fontSize: '14px', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>
                      Upload a photo instead
                    </button>
                  )}
                </>
              )}
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
                {[{ label: 'Name', value: form.name }, { label: 'Email', value: form.email }, { label: 'Phone', value: form.phone ? `+91 ${form.phone}` : '+91 XXXXXXXXXX' }, { label: 'Aadhaar', value: 'XXXX XXXX ' + (aadhaarDigits.slice(-4) || 'XXXX') }, { label: 'Selfie', value: '✓ Submitted' }].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1E2A45', fontSize: '13px' }}>
                    <span style={{ color: '#8A9BBE' }}>{label}</span>
                    <span style={{ color: '#F0EDE6', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#4A5A7A', fontSize: '12px' }}>
                <Lock size={11} /> All data is encrypted and stored securely
              </div>
              <button onClick={() => { router.push('/'); router.refresh(); }}
                style={{ width: '100%', background: 'linear-gradient(135deg, #F5C518, #C9A012)', color: '#0A0F1E', fontWeight: 800, fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                Go to homepage
              </button>
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
