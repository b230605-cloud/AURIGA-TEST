import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ user }) {
  const [memberData, setMemberData] = useState(user);
  const [purchases, setPurchases] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const memberRes = await axios.get(`${API_URL}/api/members/${user.id}`, config);
      setMemberData(memberRes.data);

      const purchasesRes = await axios.get(`${API_URL}/api/purchases/history/${user.id}`, config);
      setPurchases(purchasesRes.data.purchases);

      const redemptionsRes = await axios.get(`${API_URL}/api/redemptions/history/${user.id}`, config);
      setRedemptions(redemptionsRes.data.redemptions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier) => {
    const colors = { Bronze: 'tier-bronze', Silver: 'tier-silver', Gold: 'tier-gold' };
    return colors[tier] || 'tier-bronze';
  };

  if (loading) return <main><div className="loading">Loading...</div></main>;

  return (
    <main>
      <div className="container">
        <h1>Welcome, {memberData.name}! 👋</h1>

        <div className="stats-grid">
          <div className="card">
            <div className="stat-label">Points Balance</div>
            <div className="stat-value">{memberData.pointsBalance}</div>
          </div>
          <div className="card">
            <div className="stat-label">Tier</div>
            <div style={{ marginTop: '0.5rem' }}>
              <span className={`tier-badge ${getTierColor(memberData.tier)}`}>
                {memberData.tier}
              </span>
            </div>
          </div>
          <div className="card">
            <div className="stat-label">Total Points Earned</div>
            <div className="stat-value">{memberData.totalPointsEarned}</div>
          </div>
          <div className="card">
            <div className="stat-label">Tier Multiplier</div>
            <div className="stat-value">
              {memberData.tier === 'Gold' ? '1.5x' : memberData.tier === 'Silver' ? '1.2x' : '1x'}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', borderBottom: '1px solid #ddd' }}>
          <button
            onClick={() => setTab('overview')}
            style={{
              padding: '1rem 1.5rem',
              border: tab === 'overview' ? '2px solid #6f42c1' : 'none',
              borderBottom: tab === 'overview' ? '2px solid #6f42c1' : '1px solid #ddd',
              background: 'white',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Purchases
          </button>
          <button
            onClick={() => setTab('redemptions')}
            style={{
              padding: '1rem 1.5rem',
              border: tab === 'redemptions' ? '2px solid #6f42c1' : 'none',
              borderBottom: tab === 'redemptions' ? '2px solid #6f42c1' : '1px solid #ddd',
              background: 'white',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Redemptions
          </button>
        </div>

        {tab === 'overview' && (
          <div style={{ marginTop: '2rem' }}>
            <h2>Recent Purchases</h2>
            {purchases.length === 0 ? (
              <p style={{ color: '#999', marginTop: '1rem' }}>No purchases yet</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Points Awarded</th>
                    <th>Multiplier</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p._id}>
                      <td>{new Date(p.timestamp).toLocaleDateString()}</td>
                      <td>₹{p.amount}</td>
                      <td>{p.pointsAwarded}</td>
                      <td>{p.tierMultiplier}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'redemptions' && (
          <div style={{ marginTop: '2rem' }}>
            <h2>Redemption History</h2>
            {redemptions.length === 0 ? (
              <p style={{ color: '#999', marginTop: '1rem' }}>No redemptions yet</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Points Used</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((r) => (
                    <tr key={r._id}>
                      <td>{new Date(r.timestamp).toLocaleDateString()}</td>
                      <td>{r.itemName}</td>
                      <td>{r.pointsRedeemed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
