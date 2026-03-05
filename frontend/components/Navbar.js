import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">Wastify</Link>
        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="bg-white text-green-700 px-4 py-1 rounded font-semibold hover:bg-green-100 transition">Register</Link>
            </>
          )}
          {user && user.role === 'household' && (
            <>
              <Link href="/household-dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/waste-guide" className="hover:underline">Waste Guide</Link>
              <Link href="/rewards" className="hover:underline">Rewards</Link>
            </>
          )}
          {user && user.role === 'admin' && (
            <>
              <Link href="/municipal-dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/admin-analytics" className="hover:underline">Analytics</Link>
              <Link href="/route-map" className="hover:underline">Routes</Link>
            </>
          )}
          {user && user.role === 'contractor' && (
            <>
              <Link href="/route-map" className="hover:underline">Routes</Link>
            </>
          )}
          {user && (
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}
