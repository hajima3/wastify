import Head from 'next/head';
import { useEffect, useState } from 'react';
import api from '../services/api';

const categoryColors = {
  Biodegradable: 'bg-green-100 text-green-800',
  Recyclable: 'bg-blue-100 text-blue-800',
  Residual: 'bg-gray-100 text-gray-800',
  Hazardous: 'bg-red-100 text-red-800',
};

export default function WasteGuide() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    api.get('/waste-guide/categories').then(r => setCategories(r.data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (selectedCategory) params.category_id = selectedCategory;
    api.get('/waste-guide/items', { params }).then(r => setItems(r.data.items)).catch(() => {});
  }, [search, selectedCategory]);

  return (
    <div>
      <Head><title>Waste Segregation Guide - Wastify</title></Head>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Waste Segregation Guide</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {categories.map(c => (
            <button
              key={c.category_id}
              onClick={() => setSelectedCategory(selectedCategory === String(c.category_id) ? '' : String(c.category_id))}
              className={`rounded shadow p-4 text-center font-semibold transition ${selectedCategory === String(c.category_id) ? 'ring-2 ring-green-500' : ''} ${categoryColors[c.name] || 'bg-white'}`}
            >
              {c.name}
              <p className="text-xs font-normal mt-1">{c.description}</p>
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search waste items..."
          className="w-full mb-6 px-4 py-2 border rounded"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.item_id} className="bg-white rounded shadow p-4">
              <h3 className="font-semibold text-green-800">{item.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[item.category_name] || ''}`}>{item.category_name}</span>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              <p className="text-gray-500 text-xs mt-1">{item.disposal_instructions}</p>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 col-span-2">No items found.</p>}
        </div>
      </div>
    </div>
  );
}