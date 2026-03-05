import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export default function HouseholdDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [reportDesc, setReportDesc] = useState('');
  const [reportMsg, setReportMsg] = useState('');

  useEffect(() => {
    api.get('/household/dashboard').then(r => setData(r.data)).catch(() => {});
    api.get('/household/schedule').then(r => setSchedule(r.data)).catch(() => {});
  }, []);

  const handleReport = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/household/report-missed', { description: reportDesc });
      setReportMsg(res.data.message);
      setReportDesc('');
    } catch {
      setReportMsg('Failed to report');
    }
  };

  return (
    <div>
      <Head><title>Household Dashboard - Wastify</title></Head>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Welcome{user ? `, ${user.name}` : ''}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Collection Schedule</h2>
            {schedule && schedule.schedules.length > 0 ? (
              <ul className="text-gray-700">
                {schedule.schedules.map(s => (
                  <li key={s.schedule_id} className="mb-1">{s.collection_day} at {s.time}</li>
                ))}
              </ul>
            ) : <p className="text-gray-500">No schedule found for your barangay.</p>}
          </section>
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Your Rewards</h2>
            <p className="text-2xl font-bold text-green-600">{data ? data.totalPoints : 0} pts</p>
          </section>
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Notifications</h2>
            {data && data.recentNotifications.length > 0 ? (
              <ul className="text-gray-700">
                {data.recentNotifications.map(n => (
                  <li key={n.notification_id} className="mb-1 text-sm">{n.message}</li>
                ))}
              </ul>
            ) : <p className="text-gray-500">No new notifications.</p>}
          </section>
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Report Missed Pickup</h2>
            <form onSubmit={handleReport}>
              <textarea className="w-full border rounded px-3 py-2 mb-2" placeholder="Describe the issue..." value={reportDesc} onChange={e => setReportDesc(e.target.value)} />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Report</button>
            </form>
            {reportMsg && <p className="text-sm text-green-700 mt-2">{reportMsg}</p>}
          </section>
        </div>
      </div>
    </div>
  );
}