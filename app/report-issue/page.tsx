'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReportIssuePage() {
  const [submitted, setSubmitted] =
    useState(false);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '80px',
      }}
    >
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          style={{
            color: '#8A9BBE',
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          ← Back to home
        </Link>

        <h1
          style={{
            color: '#F0EDE6',
            fontSize: '42px',
            fontWeight: 800,
            marginTop: '32px',
            marginBottom: '12px',
          }}
        >
          Report an Issue
        </h1>

        <p
          style={{
            color: '#8A9BBE',
            fontSize: '15px',
            lineHeight: '1.7',
            marginBottom: '30px',
          }}
        >
          Found a payment problem, technical issue,
          incorrect draw information, or another
          problem? Let us know.
        </p>

        {submitted ? (
          <div
            style={{
              background: '#1E2A45',
              border: '1px solid #2A3A5C',
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <h2
              style={{
                color: '#22C55E',
                fontSize: '20px',
                fontWeight: 700,
                marginBottom: '8px',
              }}
            >
              Issue submitted
            </h2>

            <p
              style={{
                color: '#8A9BBE',
                fontSize: '14px',
                lineHeight: '1.7',
                margin: 0,
              }}
            >
              Thanks. Your report has been recorded
              for review by the support team.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#1E2A45',
              border: '1px solid #2A3A5C',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#F0EDE6',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                Email
              </label>

              <input
                type="email"
                required
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  background: '#0A0F1E',
                  border: '1px solid #2A3A5C',
                  borderRadius: '8px',
                  padding: '11px 12px',
                  color: '#F0EDE6',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#F0EDE6',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                Issue type
              </label>

              <select
                style={{
                  width: '100%',
                  background: '#0A0F1E',
                  border: '1px solid #2A3A5C',
                  borderRadius: '8px',
                  padding: '11px 12px',
                  color: '#F0EDE6',
                  outline: 'none',
                }}
              >
                <option>Payment issue</option>
                <option>Account issue</option>
                <option>Technical issue</option>
                <option>Draw issue</option>
                <option>Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#F0EDE6',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                Description
              </label>

              <textarea
                required
                rows={6}
                placeholder="Describe the issue..."
                style={{
                  width: '100%',
                  background: '#0A0F1E',
                  border: '1px solid #2A3A5C',
                  borderRadius: '8px',
                  padding: '11px 12px',
                  color: '#F0EDE6',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                background:
                  'linear-gradient(135deg, #F5C518, #C9A012)',
                color: '#0A0F1E',
                border: 'none',
                borderRadius: '8px',
                padding: '11px 20px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Submit Issue
            </button>
          </form>
        )}
      </div>
    </main>
  );
}