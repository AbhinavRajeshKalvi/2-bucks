import Link from 'next/link';

export default function ContactPage() {
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
          Contact Us
        </h1>

        <p
          style={{
            color: '#8A9BBE',
            fontSize: '15px',
            lineHeight: '1.7',
            marginBottom: '32px',
          }}
        >
          Our support team is available Monday to
          Saturday, 10:00 AM to 6:00 PM IST.
        </p>

        <div
          style={{
            display: 'grid',
            gap: '16px',
          }}
        >
          {[
            {
              title: 'General Support',
              value: 'support@2bucks-demo.com',
            },
            {
              title: 'Payment Support',
              value: 'payments@2bucks-demo.com',
            },
            {
              title: 'Technical Issues',
              value: 'tech@2bucks-demo.com',
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: '#1E2A45',
                border: '1px solid #2A3A5C',
                borderRadius: '14px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  color: '#8A9BBE',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: '6px',
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  color: '#F0EDE6',
                  fontSize: '15px',
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '24px',
            background: '#141C30',
            border: '1px solid #2A3A5C',
            borderRadius: '14px',
            padding: '20px',
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
            Demo Support Office
          </h2>

          <p
            style={{
              color: '#8A9BBE',
              fontSize: '14px',
              lineHeight: '1.7',
              margin: 0,
            }}
          >
            2Bucks Support Centre
            <br />
            2nd Floor, Orion Business Park
            <br />
            Bengaluru, Karnataka 560001
            <br />
            India
          </p>
        </div>
      </div>
    </main>
  );
}