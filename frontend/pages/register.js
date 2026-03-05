import Head from 'next/head';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('household');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(name, email, password, role);
      if (user.role === 'admin') router.push('/municipal-dashboard');
      else if (user.role === 'contractor') router.push('/route-map');
      else router.push('/household-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Head>
        <title>Register - Wastify</title>
      </Head>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Create Your Wastify Account</h2>
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        <label className="block mb-2 text-gray-700">Name</label>
        <input type="text" className="w-full mb-4 px-3 py-2 border rounded" required value={name} onChange={e => setName(e.target.value)} />
        <label className="block mb-2 text-gray-700">Email</label>
        <input type="email" className="w-full mb-4 px-3 py-2 border rounded" required value={email} onChange={e => setEmail(e.target.value)} />
        <label className="block mb-2 text-gray-700">Password</label>
        <input type="password" className="w-full mb-4 px-3 py-2 border rounded" required value={password} onChange={e => setPassword(e.target.value)} />
        <label className="block mb-2 text-gray-700">Role</label>
        <select className="w-full mb-6 px-3 py-2 border rounded" value={role} onChange={e => setRole(e.target.value)}>
          <option value="household">Household</option>
          <option value="admin">Municipal Admin</option>
          <option value="contractor">Contractor</option>
        </select>
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50">{loading ? 'Registering...' : 'Register'}</button>
        <p className="mt-4 text-center text-sm">Already have an account? <a href="/login" className="text-green-700 underline">Login</a></p>
      </form>
    </div>
  );
}
