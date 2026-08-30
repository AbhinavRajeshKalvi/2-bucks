import Link from 'next/link';

export default function RefundPolicyPage() {
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
          Refund Policy
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
            title: 'Successful Payments',
            text:
              'Once a payment has been successfully verified and entries have been issued, the transaction is normally treated as completed.',
          },
          {
            title: 'Duplicate Payments',
            text:
              'Where a duplicate payment is identified for the same order due to a technical issue, the duplicate transaction can be reviewed for refund.',
          },
          {
            title: 'Failed Payments',
            text:
              'Payments that fail before successful verification should not result in active entries. Any payment discrepancy can be reported to support for review.',
          },
          {
            title: 'Support Review',
            text:
              'Refund requests may require transaction details, payment references, and account verification before they are reviewed.',
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