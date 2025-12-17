export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Flex Living Reviews API</h1>
      <p>Backend service for managing property reviews.</p>

      <h2 style={{ marginTop: '2rem' }}>Available Endpoints:</h2>
      <ul>
        <li>
          <strong>GET /api/reviews/hostaway</strong>
          <br />
          <small>Fetch all reviews with optional filters</small>
          <br />
          <code style={{ background: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            ?listingId=123&approvedOnly=true
          </code>
        </li>
        <li style={{ marginTop: '1rem' }}>
          <strong>GET /api/reviews/hostaway/[id]</strong>
          <br />
          <small>Fetch a single review by ID</small>
        </li>
        <li style={{ marginTop: '1rem' }}>
          <strong>PATCH /api/reviews/hostaway/[id]</strong>
          <br />
          <small>Update review approval status</small>
          <br />
          <code style={{ background: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            {`{ "approvedForWebsite": true }`}
          </code>
        </li>
      </ul>

      <h2 style={{ marginTop: '2rem' }}>Status:</h2>
      <p style={{ color: 'green', fontWeight: 'bold' }}>✓ API is running</p>
    </main>
  );
}
