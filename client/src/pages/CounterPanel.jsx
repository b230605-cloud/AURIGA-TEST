import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CounterPanel() {
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [action, setAction] = useState('purchase');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [redemptionItem, setRedemptionItem] = useState('');
  const [availableItems, setAvailableItems] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAvailableItems();
    fetchAllMembers();
  }, []);

  const fetchAvailableItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/redemptions/available-items`);
      setAvailableItems(res.data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchAllMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/members?limit=100`);
      setMembers(res.data.members);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchPhone(value);
    if (value.length > 0) {
      const results = members.filter(m =>
        m.phoneNumber.includes(value)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const selectMember = (member) => {
    setSelectedMember(member);
    setSearchPhone(member.phoneNumber);
    setSearchResults([]);
    setMessage('');
  };

  const handlePurchase = async () => {
    if (!selectedMember || !purchaseAmount) {
      setMessageType('error');
      setMessage('Please select member and enter amount');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(
        `${API_URL}/api/purchases/record`,
        {
          memberId: selectedMember._id,
          amount: parseFloat(purchaseAmount),
          description: 'Counter purchase'
        },
        config
      );

      setMessageType('success');
      setMessage(`✅ ${res.data.pointsAwarded} points awarded! New balance: ${res.data.newBalance}`);
      setPurchaseAmount('');

      setTimeout(() => {
        setSelectedMember(null);
        setSearchPhone('');
        fetchAllMembers();
      }, 2000);
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.error || 'Error processing purchase');
    }
  };

  const handleRedemption = async () => {
    if (!selectedMember || !redemptionItem) {
      setMessageType('error');
      setMessage('Please select member and item');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(
        `${API_URL}/api/redemptions/redeem`,
        {
          memberId: selectedMember._id,
          itemName: redemptionItem
        },
        config
      );

      setMessageType('success');
      setMessage(`✅ Redeemed: ${res.data.itemName}! New balance: ${res.data.newBalance}`);
      setRedemptionItem('');

      setTimeout(() => {
        setSelectedMember(null);
        setSearchPhone('');
        fetchAllMembers();
      }, 2000);
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.error || 'Error processing redemption');
    }
  };

  return (
    <main>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1>☕ Counter Panel</h1>

        <div className="card">
          <h2>Search Member</h2>
          <input
            type="text"
            placeholder="Enter phone number..."
            value={searchPhone}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginTop: '0.5rem' }}
          />

          {searchResults.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              {searchResults.map((member) => (
                <div
                  key={member._id}
                  onClick={() => selectMember(member)}
                  style={{
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: selectedMember?._id === member._id ? '#f0f0f0' : 'white'
                  }}
                >
                  <strong>{member.name}</strong> | {member.phoneNumber}
                  <br />
                  <small>Points: {member.pointsBalance} | Tier: {member.tier}</small>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedMember && (
          <div className="card" style={{ marginTop: '1.5rem', backgroundColor: '#f9f9f9' }}>
            <h2>Member: {selectedMember.name}</h2>
            <div className="stats-grid">
              <div className="card">
                <div className="stat-label">Phone</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{selectedMember.phoneNumber}</div>
              </div>
              <div className="card">
                <div className="stat-label">Points Balance</div>
                <div className="stat-value">{selectedMember.pointsBalance}</div>
              </div>
              <div className="card">
                <div className="stat-label">Tier</div>
                <div className={`tier-badge ${selectedMember.tier === 'Gold' ? 'tier-gold' : selectedMember.tier === 'Silver' ? 'tier-silver' : 'tier-bronze'}`}>
                  {selectedMember.tier}
                </div>
              </div>
            </div>

            {message && (
              <div className={message.includes('✅') ? 'success' : 'error'} style={{ marginTop: '1rem' }}>
                {message}
              </div>
            )}

            <div style={{ marginTop: '1.5rem', borderBottom: '1px solid #ddd' }}>
              <button
                onClick={() => { setAction('purchase'); setMessage(''); }}
                style={{
                  padding: '1rem 1.5rem',
                  border: action === 'purchase' ? '2px solid #6f42c1' : 'none',
                  borderBottom: action === 'purchase' ? '2px solid #6f42c1' : '1px solid #ddd',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Record Purchase
              </button>
              <button
                onClick={() => { setAction('redemption'); setMessage(''); }}
                style={{
                  padding: '1rem 1.5rem',
                  border: action === 'redemption' ? '2px solid #6f42c1' : 'none',
                  borderBottom: action === 'redemption' ? '2px solid #6f42c1' : '1px solid #ddd',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Redeem Points
              </button>
            </div>

            {action === 'purchase' && (
              <div style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Purchase Amount (₹)</label>
                  <input
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    placeholder="100"
                    step="0.01"
                  />
                  <small>Points will be: ₹{purchaseAmount || 0} × 10 × {selectedMember.tier === 'Gold' ? '1.5' : selectedMember.tier === 'Silver' ? '1.2' : '1'} = {Math.floor((purchaseAmount || 0) * 10 * (selectedMember.tier === 'Gold' ? 1.5 : selectedMember.tier === 'Silver' ? 1.2 : 1))} points</small>
                </div>
                <button onClick={handlePurchase} className="btn btn-primary">
                  Record Purchase
                </button>
              </div>
            )}

            {action === 'redemption' && (
              <div style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Select Item</label>
                  <select
                    value={redemptionItem}
                    onChange={(e) => setRedemptionItem(e.target.value)}
                  >
                    <option value="">Choose an item...</option>
                    {availableItems.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name} ({item.pointsRequired} points)
                      </option>
                    ))}
                  </select>
                  {redemptionItem && availableItems.find(i => i.name === redemptionItem) && (
                    <small>
                      Required: {availableItems.find(i => i.name === redemptionItem).pointsRequired} points
                      {selectedMember.pointsBalance < availableItems.find(i => i.name === redemptionItem).pointsRequired && (
                        <span style={{ color: '#d32f2f' }}> ❌ Insufficient points</span>
                      )}
                    </small>
                  )}
                </div>
                <button
                  onClick={handleRedemption}
                  className="btn btn-primary"
                  disabled={selectedMember.pointsBalance < (availableItems.find(i => i.name === redemptionItem)?.pointsRequired || 0)}
                >
                  Redeem
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
