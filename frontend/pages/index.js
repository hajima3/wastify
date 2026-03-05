import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-green-50">
      <Head>
        <title>Wastify - Smart Waste Management</title>
      </Head>
      <main className="max-w-4xl mx-auto py-12 px-4">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-700 mb-4">Wastify</h1>
          <p className="text-xl text-gray-700 mb-6">Smart Waste Management for Cities</p>
          <a href="/register" className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition">Get Started</a>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">Urban Waste Problems</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Missed garbage pickups</li>
            <li>Unclear waste segregation</li>
            <li>Inefficient collection routes</li>
            <li>Lack of monitoring tools</li>
            <li>Low household participation</li>
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">Our Solution</h2>
          <p className="text-gray-700">Wastify provides smart tracking, reminders, route monitoring, and rewards to improve waste management for everyone.</p>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">Features</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Role-based dashboards</li>
            <li>Waste segregation guide</li>
            <li>Collection schedules & reminders</li>
            <li>Route visualization & analytics</li>
            <li>Reward system for compliance</li>
            <li>Push & SMS notifications</li>
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">Benefits</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Reduce missed pickups</li>
            <li>Improve segregation</li>
            <li>Increase community participation</li>
            <li>Optimize collection routes</li>
          </ul>
        </section>
        <section className="text-center mt-12">
          <a href="/register" className="bg-green-600 text-white px-8 py-4 rounded shadow-lg text-lg hover:bg-green-700 transition">Join Wastify Now</a>
        </section>
      </main>
    </div>
  );
}
