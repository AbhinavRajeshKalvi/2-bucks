import Link from 'next/link';

export default function DrawRulesPage() {
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
            marginBottom: '8px',
          }}
        >
          Draw Rules
        </h1>

        <p
          style={{
            color: '#4A5A7A',
            fontSize: '12px',
            marginBottom: '30px',
          }}
        >
          Demo rules — last updated August 2026
        </p>

        {[
          {
            title: '1. Product Draw',
            text:
              'Each listed product represents a separate draw with its own entry limit and closing time.',
          },
          {
            title: '2. Entry Allocation',
            text:
              'Every successfully verified paid entry contributes one or more entries to the corresponding product draw depending on the quantity purchased.',
          },
          {
            title: '3. Closing',
            text:
              'A draw may close when its available entry capacity is reached or when its configured end time is reached, depending on the final draw configuration.',
          },
          {
            title: '4. Winner Selection',
            text:
              'One eligible entry is selected from the entries recorded for the completed draw. The project currently treats this as a demonstration of the draw mechanism.',
          },
          {
            title: '5. Verification',
            text:
              'A selected winner may be required to complete account and identity verification before a prize is released.',
          },
          {
            title: '6. Prize Delivery',
            text:
              'For a completed demonstration draw, delivery arrangements are coordinated after winner verification and confirmation of the applicable delivery details.',
          },
        ].map((section) => (
          <section
            key={section.title}
            style={{
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                color: '#F0EDE6',
                fontSize: '18px',
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
                lineHeight: '1.8',
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