export default function LandingPage() {
  return (
    <main>
      <div className="container" style={{ marginTop: '0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>☕</div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to Café Rewards</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
            Earn points on every purchase and redeem them for free items at our café chain. Join thousands of happy customers!
          </p>
        </div>

        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>How It Works</h2>
          <div className="stats-grid" style={{ marginTop: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(210,105,30,0.1), rgba(244,164,96,0.1))' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛍️</div>
              <h3>Earn Points</h3>
              <p>Get <strong>10 points</strong> per rupee spent. Higher tiers earn even faster!</p>
            </div>
            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(210,105,30,0.1), rgba(244,164,96,0.1))' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
              <h3>Level Up</h3>
              <p>Reach <strong>Silver</strong> (2000 pts) & <strong>Gold</strong> (5000 pts) for exclusive perks</p>
            </div>
            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(210,105,30,0.1), rgba(244,164,96,0.1))' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎁</div>
              <h3>Redeem Rewards</h3>
              <p>Exchange points for <strong>free coffee, pastries</strong>, & more</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Tier Benefits</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Tier</th>
                  <th style={{ width: '25%' }}>Points Required</th>
                  <th style={{ width: '25%' }}>Multiplier</th>
                  <th style={{ width: '25%' }}>Benefits</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="tier-badge tier-bronze">Bronze</span></td>
                  <td><strong>0 - 1,999</strong></td>
                  <td><span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>1x</span></td>
                  <td>Base member rewards</td>
                </tr>
                <tr style={{ background: 'rgba(192,192,192,0.05)' }}>
                  <td><span className="tier-badge tier-silver">Silver</span></td>
                  <td><strong>2,000 - 4,999</strong></td>
                  <td><span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>1.2x</span></td>
                  <td>20% bonus points on every purchase</td>
                </tr>
                <tr style={{ background: 'rgba(255,215,0,0.08)' }}>
                  <td><span className="tier-badge tier-gold">Gold</span></td>
                  <td><strong>5,000+</strong></td>
                  <td><span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>1.5x</span></td>
                  <td>🌟 50% bonus + VIP perks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '2rem' }}>Ready to Start Earning?</h2>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/register" className="btn btn-primary" style={{ fontSize: '1.05rem' }}>🚀 Create Account</a>
            <a href="/login" className="btn btn-secondary" style={{ fontSize: '1.05rem' }}>👤 Sign In</a>
          </div>
        </div>

        <div style={{ marginTop: '4rem', padding: '2rem', background: 'linear-gradient(135deg, rgba(76,175,80,0.08), rgba(200,230,201,0.08))', borderRadius: '12px', border: '1px solid rgba(76,175,80,0.2)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🔮 Coming Soon</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>✨ <strong>Referral Bonuses</strong> - Invite friends & earn</div>
            <div>🎯 <strong>Personalized Offers</strong> - Just for you</div>
            <div>📱 <strong>Mobile App</strong> - QR code scanning</div>
            <div>🎂 <strong>Birthday Specials</strong> - Extra perks</div>
            <div>🏆 <strong>Leaderboard</strong> - Seasonal rewards</div>
            <div>💬 <strong>Social Sharing</strong> - Double up rewards</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  );
}
