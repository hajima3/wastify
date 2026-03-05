import Head from 'next/head';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then(r => setStats(r.data)).catch(() => {});
  }, []);

  if (!stats) return <p className="text-center py-12 text-gray-500">Loading analytics...</p>;

  const pickupBar = {
    labels: ['Pending', 'Resolved'],
    datasets: [{
      label: 'Missed Pickups',
      data: [parseInt(stats.pendingMissedPickups), parseInt(stats.resolvedMissedPickups)],
      backgroundColor: ['#f59e0b', '#10b981'],
    }],
  };

  const userDoughnut = {
    labels: ['Users', 'Households'],
    datasets: [{
      data: [parseInt(stats.totalUsers), parseInt(stats.totalHouseholds)],
      backgroundColor: ['#3b82f6', '#22c55e'],
    }],
  };

  return (
    <div>
      <Head><title>Admin Analytics - Wastify</title></Head>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Analytics Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Users', value: stats.totalUsers, color: 'blue' },
            { label: 'Households', value: stats.totalHouseholds, color: 'green' },
            { label: 'Pending', value: stats.pendingMissedPickups, color: 'yellow' },
            { label: 'Resolved', value: stats.resolvedMissedPickups, color: 'emerald' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded shadow p-4 text-center">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold text-green-800 mb-4">Missed Pickups</h2>
            <Bar data={pickupBar} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </section>
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold text-green-800 mb-4">Users &amp; Households</h2>
            <Doughnut data={userDoughnut} />
          </section>
        </div>
      </div>
    </div>
  );
}