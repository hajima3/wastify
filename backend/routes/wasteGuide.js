const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET /waste-guide/categories
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM WasteCategories ORDER BY category_id');
    res.json({ categories: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

// GET /waste-guide/items?search=&category_id=
router.get('/items', async (req, res) => {
  try {
    const { search, category_id } = req.query;
    let query = 'SELECT wi.*, wc.name AS category_name FROM WasteItems wi JOIN WasteCategories wc ON wi.category_id = wc.category_id';
    const params = [];
    const conditions = [];
    if (category_id) {
      params.push(category_id);
      conditions.push(`wi.category_id = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(wi.name ILIKE $${params.length} OR wi.description ILIKE $${params.length})`);
    }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY wi.name';
    const result = await pool.query(query, params);
    res.json({ items: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load waste items' });
  }
});

module.exports = router;
