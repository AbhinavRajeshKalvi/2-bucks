'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Wallet, Bell, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import type { SafeUser } from '@/app/lib/definitions';

export default function Navbar({ user }: { user: SafeUser | null }) {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ background: 'rgba(10,15,30,0.95)', borderBottom: '1px solid #2A3A5C', backdropFilter: 'blur(12px)' }}
      className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div style={{
              background: 'linear-gradient(135deg, #F5C518, #C9A012)',
              borderRadius: '8px',
              width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '18px', color: '#0A0F1E'
            }}>₹</div>
            <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>
              <span className="gold-text">2</span>
              <span style={{ color: '#F0EDE6' }}>Bucks</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[['/', 'Products'], ['/how-it-works', 'How It Works'], ['/winners', 'Winners']].map(([href, label]) => (
              <Link key={href} href={href}
                style={{ color: '#8A9BBE', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F0EDE6')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8A9BBE')}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button style={{
                  background: '#1E2A45', border: '1px solid #2A3A5C',
                  borderRadius: '8px', padding: '8px 14px',
                  color: '#F0EDE6', fontSize: '13px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
                }}>
                  <Wallet size={15} style={{ color: '#F5C518' }} />
                  ₹0.00
                </button>
                <button style={{ background: '#1E2A45', border: '1px solid #2A3A5C', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#8A9BBE' }}>
                  <Bell size={16} />
                </button>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#1E2A45', border: '1px solid #2A3A5C',
                  borderRadius: '8px', padding: '6px 6px 6px 12px',
                }}>
                  <span style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 600 }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <form action={logout}>
                    <button type="submit" title="Sign out" style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#8A9BBE', display: 'flex', alignItems: 'center',
                      padding: '6px', borderRadius: '6px',
                    }}>
                      <LogOut size={15} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <Link href="/auth" style={{
                background: 'linear-gradient(135deg, #F5C518, #C9A012)',
                borderRadius: '8px', padding: '8px 18px',
                color: '#0A0F1E', fontSize: '14px', fontWeight: 700,
                textDecoration: 'none'
              }}>Sign In</Link>
            )}
          </div>

          {/* Mobile menu btn */}
          <button className="md:hidden" style={{ color: '#F0EDE6', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#0A0F1E', borderTop: '1px solid #2A3A5C', padding: '16px' }}>
          {[['/', 'Products'], ['/how-it-works', 'How It Works'], ['/winners', 'Winners']].map(([href, label]) => (
            <Link key={href} href={href}
              onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '12px 0', color: '#8A9BBE', textDecoration: 'none', fontSize: '15px', borderBottom: '1px solid #1E2A45' }}>
              {label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {user ? (
              <form action={logout} style={{ flex: 1 }}>
                <button type="submit" style={{
                  width: '100%', background: '#1E2A45', border: '1px solid #2A3A5C',
                  borderRadius: '8px', padding: '10px', textAlign: 'center',
                  color: '#F0EDE6', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <LogOut size={15} /> Sign out ({user.name.split(' ')[0]})
                </button>
              </form>
            ) : (
              <Link href="/auth" style={{
                flex: 1, background: 'linear-gradient(135deg, #F5C518, #C9A012)',
                borderRadius: '8px', padding: '10px', textAlign: 'center',
                color: '#0A0F1E', fontWeight: 700, textDecoration: 'none', fontSize: '14px'
              }}>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
