import Link from 'next/link';

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <p
          style={{
            color: '#4A5A7A',
            fontSize: '12px',
            marginBottom: '30px',
          }}
        >
          Demo policy — last updated August 2026
        </p>

        {[
          {
            title: 'Information We Collect',
            text:
              'The demo platform may collect account details such as name, email address, phone number, verification information, transaction details, and files submitted during identity verification.',
          },
          {
            title: 'How Information Is Used',
            text:
              'Information is used to create and secure accounts, verify eligibility, process payments, manage entries, provide customer support, and operate the draw system.',
          },
          {
            title: 'Payment Information',
            text:
              'Payment processing is handled through Razorpay. The demo application does not directly store full card or banking credentials.',
          },
          {
            title: 'Identity Documents',
            text:
              'Identity verification documents submitted during registration are stored separately from general account information and are intended to be accessed only for verification and administration purposes.',
          },
          {
            title: 'Data Security',
            text:
              'Reasonable technical controls are used within this project to protect stored information. The demonstration environment should not be treated as a production-grade data security system.',
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