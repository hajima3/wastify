import Head from 'next/head';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') router.push('/municipal-dashboard');
      else if (user.role === 'contractor') router.push('/route-map');
      else router.push('/household-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Head>
        <title>Login - Wastify</title>
      </Head>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Login to Wastify</h2>
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        <label className="block mb-2 text-gray-700">Email</label>
        <input type="email" className="w-full mb-4 px-3 py-2 border rounded" required value={email} onChange={e => setEmail(e.target.value)} />
        <label className="block mb-2 text-gray-700">Password</label>
        <input type="password" className="w-full mb-6 px-3 py-2 border rounded" required value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</button>
        <p className="mt-4 text-center text-sm">Don&apos;t have an account? <a href="/register" className="text-green-700 underline">Register</a></p>
      </form>
    </div>
  );
}
