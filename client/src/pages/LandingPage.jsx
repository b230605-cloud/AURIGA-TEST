export default function LandingPage() {
  return (
    <main>
      <div className="container">
        <h1>☕ Welcome to Café Rewards</h1>
        <p style={{ fontSize: '1.1rem', marginTop: '1rem', lineHeight: '1.6' }}>
          Earn points on every purchase and redeem them for free items at our café chain.
        </p>

        <div style={{ marginTop: '3rem' }}>
          <h2>How It Works</h2>
          <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
            <div className="card">
              <h3>🛍️ Earn Points</h3>
              <p>Get 10 points per rupee spent. Higher tiers earn faster!</p>
            </div>
            <div className="card">
              <h3>⭐ Level Up</h3>
              <p>Reach Silver (2000 points) and Gold (5000 points) tiers for extra benefits.</p>
            </div>
            <div className="card">
              <h3>🎁 Redeem Rewards</h3>
              <p>Exchange points for free coffee, pastries, and more.</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2>Tier Benefits</h2>
          <table className="table" style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Tier</th>
                <th>Required Points</th>
                <th>Earning Multiplier</th>
                <th>Benefits</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="tier-badge tier-bronze">Bronze</span></td>
                <td>0 - 1,999</td>
                <td>1x</td>
                <td>Base rewards</td>
              </tr>
              <tr>
                <td><span className="tier-badge tier-silver">Silver</span></td>
                <td>2,000 - 4,999</td>
                <td>1.2x</td>
                <td>20% bonus points</td>
              </tr>
              <tr>
                <td><span className="tier-badge tier-gold">Gold</span></td>
                <td>5,000+</td>
                <td>1.5x</td>
                <td>50% bonus points + VIP perks</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h2>Get Started Today</h2>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/register" className="btn btn-primary">Create Account</a>
            <a href="/login" className="btn btn-secondary">Sign In</a>
          </div>
        </div>

        <div style={{ marginTop: '3rem', backgroundColor: '#f0f0f0', padding: '2rem', borderRadius: '8px' }}>
          <h2>Next Features Coming Soon</h2>
          <ul style={{ marginTop: '1rem', lineHeight: '1.8' }}>
            <li>✨ Referral bonuses - Invite friends and earn rewards</li>
            <li>🎯 Personalized offers based on your preferences</li>
            <li>📱 Mobile app with QR code scanning</li>
            <li>🎂 Birthday specials and anniversary bonuses</li>
            <li>🏆 Leaderboard with seasonal rewards</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
