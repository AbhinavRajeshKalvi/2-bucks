import Link from 'next/link';

const faqs = [
  {
    question: 'How much does an entry cost?',
    answer:
      'Every active draw on 2Bucks uses a ₹2 entry price. Select the number of entries you want and the total is calculated automatically before payment.',
  },
  {
    question: 'How does a draw work?',
    answer:
      'Each product has a fixed number of available slots. Once the draw reaches its closing condition, one eligible entry is selected through the platform draw process.',
  },
  {
    question: 'How do I know my payment went through?',
    answer:
      'After a successful Razorpay payment, your payment is verified and your entries are added to your account. You can also check your transaction history from your account area.',
  },
  {
    question: 'Can I buy more than one entry?',
    answer:
      'Yes. You can purchase multiple entries for the same draw, subject to the number of available slots.',
  },
  {
    question: 'What happens if I win?',
    answer:
      'The winning account is contacted using the verified details associated with the account. Prize fulfilment and delivery instructions are then provided.',
  },
];

export default function HelpPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '80px',
      }}
    >
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
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
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 800,
            marginTop: '32px',
            marginBottom: '12px',
          }}
        >
          Help Center
        </h1>

        <p
          style={{
            color: '#8A9BBE',
            fontSize: '16px',
            lineHeight: '1.7',
            marginBottom: '40px',
          }}
        >
          Find answers to common questions about
          accounts, payments, entries and draws.
        </p>

        <div
          style={{
            display: 'grid',
            gap: '16px',
          }}
        >
          {faqs.map((faq) => (
            <div
              key={faq.question}
              style={{
                background: '#1E2A45',
                border: '1px solid #2A3A5C',
                borderRadius: '14px',
                padding: '22px',
              }}
            >
              <h2
                style={{
                  color: '#F0EDE6',
                  fontSize: '16px',
                  fontWeight: 700,
                  marginBottom: '10px',
                }}
              >
                {faq.question}
              </h2>

              <p
                style={{
                  color: '#8A9BBE',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  margin: 0,
                }}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}