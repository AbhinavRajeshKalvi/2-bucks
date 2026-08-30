import Link from 'next/link';

export default function ResponsibleGamingPage() {
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
          Responsible Gaming
        </h1>

        <p
          style={{
            color: '#8A9BBE',
            fontSize: '15px',
            lineHeight: '1.7',
            marginBottom: '30px',
          }}
        >
          2Bucks is designed for entertainment and
          should be approached responsibly.
        </p>

        {[
          {
            title: 'Set a spending limit',
            text:
              'Only spend an amount you are comfortable losing. Never use money needed for essential expenses.',
          },
          {
            title: 'Take breaks',
            text:
              'Avoid making repeated purchases simply because a draw is getting close to completion.',
          },
          {
            title: 'Do not chase losses',
            text:
              'A previous payment or unsuccessful entry does not increase your chances in another draw.',
          },
          {
            title: '18+ only',
            text:
              'Participation is intended only for eligible adults who meet the age and account requirements of the platform.',
          },
        ].map((section) => (
          <section
            key={section.title}
            style={{
              background: '#1E2A45',
              border: '1px solid #2A3A5C',
              borderRadius: '14px',
              padding: '22px',
              marginBottom: '14px',
            }}
          >
            <h2
              style={{
                color: '#F0EDE6',
                fontSize: '17px',
                fontWeight: 700,
                marginBottom: '8px',
              }}
            >
              {section.title}
            </h2>

            <p
              style={{
                color: '#8A9BBE',
                fontSize: '14px',
                lineHeight: '1.7',
                margin: 0,
              }}
            >
              {section.text}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}