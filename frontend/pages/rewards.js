import Head from 'next/head';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Rewards() {
  const [totalPoints, setTotalPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [redeemAmt, setRedeemAmt] = useState('');
  const [msg, setMsg] = useState('');

  const loadRewards = () => {
    api.get('/rewards').then(r => {
      setTotalPoints(r.data.totalPoints);
      setHistory(r.data.history);
    }).catch(() => {});
  };

  useEffect(loadRewards, []);

  const handleRedeem = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await api.post('/rewards/redeem', { points: parseInt(redeemAmt) });
      setMsg(`Redeemed! Remaining: ${res.data.remainingPoints} pts`);
      setRedeemAmt('');
      loadRewards();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Redemption failed');
    }
  };

  return (
    <div>
      <Head><title>Rewards - Wastify</title></Head>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Rewards</h1>
        <section className="bg-white rounded shadow p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Your Points</h2>
          <p className="text-4xl font-bold text-green-600">{totalPoints}</p>
        </section>
        <section className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Redeem Rewards</h2>
          <form onSubmit={handleRedeem} className="flex gap-2">
            <input type="number" min="1" className="flex-grow px-3 py-2 border rounded" placeholder="Points to redeem" value={redeemAmt} onChange={e => setRedeemAmt(e.target.value)} required />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Redeem</button>
          </form>
          {msg && <p className="text-sm text-green-700 mt-2">{msg}</p>}
        </section>
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">History</h2>
          {history.length > 0 ? (
            <ul className="text-gray-700 text-sm">
              {history.map(r => (
                <li key={r.reward_id} className="mb-1 flex justify-between">
                  <span>{r.date_earned}</span>
                  <span className={r.points >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{r.points >= 0 ? '+' : ''}{r.points} pts</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500">No reward history yet.</p>}
        </section>
      </div>
    </div>
  );
}