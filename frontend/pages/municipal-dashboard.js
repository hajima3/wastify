import Head from 'next/head';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function MunicipalDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [missed, setMissed] = useState([]);
  const [notifyMsg, setNotifyMsg] = useState('');
  const [sent, setSent] = useState('');

  useEffect(() => {
    api.get('/admin/analytics').then(r => setAnalytics(r.data)).catch(() => {});
    api.get('/admin/missed-pickups').then(r => setMissed(r.data.missedPickups)).catch(() => {});
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/notify', { message: notifyMsg });
      setSent(res.data.message || 'Notification sent');
      setNotifyMsg('');
    } catch { setSent('Failed to send'); }
  };

  return (
    <div>
      <Head><title>Municipal Dashboard - Wastify</title></Head>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Municipal Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{analytics?.totalUsers ?? '-'}</p>
            <p className="text-gray-500 text-sm">Total Users</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{analytics?.totalHouseholds ?? '-'}</p>
            <p className="text-gray-500 text-sm">Households</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{analytics?.pendingMissedPickups ?? '-'}</p>
            <p className="text-gray-500 text-sm">Pending Missed Pickups</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{analytics?.resolvedMissedPickups ?? '-'}</p>
            <p className="text-gray-500 text-sm">Resolved</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Recent Missed Pickup Reports</h2>
            {missed.length > 0 ? (
              <ul className="text-gray-700 text-sm">
                {missed.slice(0, 10).map(m => (
                  <li key={m.pickup_id} className="mb-2 border-b pb-2">
                    <span className="font-semibold">{m.name}</span> ({m.barangay}) — {m.description || 'No description'}
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${m.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{m.status}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500">No reports yet.</p>}
          </section>

          <section className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Send Announcement</h2>
            <form onSubmit={handleBroadcast}>
              <textarea className="w-full border rounded px-3 py-2 mb-2" placeholder="Type announcement..." value={notifyMsg} onChange={e => setNotifyMsg(e.target.value)} />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Broadcast to All</button>
            </form>
            {sent && <p className="text-sm text-green-700 mt-2">{sent}</p>}
          </section>
        </div>
      </div>
    </div>
  );
}