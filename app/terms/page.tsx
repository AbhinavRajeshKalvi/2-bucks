import Link from 'next/link';

export default function TermsPage() {
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
          Terms of Service
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
            title: '1. Account Eligibility',
            text:
              'Users must provide accurate registration information and maintain a valid account. Accounts may only be used by the person to whom they are registered.',
          },
          {
            title: '2. Entries',
            text:
              'Entries are purchased for individual product draws. The number of entries available for each product is displayed on its draw page.',
          },
          {
            title: '3. Payments',
            text:
              'Payments are processed through Razorpay. A transaction is considered complete only after payment verification is successfully completed by the platform.',
          },
          {
            title: '4. Draws and Winners',
            text:
              'Eligible entries are considered for the applicable draw. The selected winner is subject to account and eligibility verification.',
          },
          {
            title: '5. Account Restrictions',
            text:
              '2Bucks may restrict or suspend an account where there is evidence of misuse, fraudulent activity, payment abuse, or violation of platform rules.',
          },
          {
            title: '6. Changes',
            text:
              'These demo terms may be updated as the project evolves. Continued use of the platform after an update represents acceptance of the revised terms within this demonstration environment.',
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