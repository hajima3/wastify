import Head from 'next/head';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function RouteMap() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    api.get('/admin/routes').then(r => setRoutes(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <Head><title>Route Map - Wastify</title></Head>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Garbage Truck Routes</h1>
        <section className="bg-white rounded shadow p-6 mb-6">
          <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400 rounded">
            <p className="text-sm">Map visualization requires a Mapbox access token.<br />Set <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> in your <code>.env.local</code>.</p>
          </div>
        </section>
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Routes</h2>
          {routes.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Area</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {routes.map(r => (
                  <tr key={r.route_id} className="border-b">
                    <td className="py-2 font-medium">{r.route_name}</td>
                    <td className="py-2 text-gray-600">{r.area_covered}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-gray-500">No routes available.</p>}
        </section>
      </div>
    </div>
  );
}