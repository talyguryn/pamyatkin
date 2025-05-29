export default function SuccessPage() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '60vh',
        margin: '80px 40px',
      }}
    >
      <h1 className="mb-4">Thank You for Your Purchase!</h1>
      <p>Your order was successful. We appreciate your business.</p>
      <p>
        If you have any questions, please contact our support team at
        <br />
        <a href="mailto:support@example.com">support@example.com</a>.
      </p>

      <a
        href="/"
        style={{
          marginTop: '30px',
          textDecoration: 'underline',
          color: '#0070f3',
        }}
      >
        Return to Home
      </a>
    </main>
  );
}
