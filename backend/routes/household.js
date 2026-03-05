const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /household/dashboard
router.get('/dashboard', authenticateToken, authorizeRoles('household'), async (req, res) => {
  try {
    const userId = req.user.user_id;
    const household = await pool.query('SELECT * FROM Households WHERE user_id = $1', [userId]);
    const rewards = await pool.query('SELECT COALESCE(SUM(points), 0) AS total_points FROM Rewards WHERE user_id = $1', [userId]);
    const notifications = await pool.query('SELECT * FROM Notifications WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 5', [userId]);
    const missedPickups = await pool.query('SELECT * FROM MissedPickups WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5', [userId]);
    res.json({
      household: household.rows[0] || null,
      totalPoints: rewards.rows[0].total_points,
      recentNotifications: notifications.rows,
      recentMissedPickups: missedPickups.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// GET /household/schedule
router.get('/schedule', authenticateToken, authorizeRoles('household'), async (req, res) => {
  try {
    const userId = req.user.user_id;
    const household = await pool.query('SELECT barangay FROM Households WHERE user_id = $1', [userId]);
    if (!household.rows.length) return res.status(404).json({ error: 'Household not found' });
    const barangay = household.rows[0].barangay;
    const schedules = await pool.query('SELECT * FROM CollectionSchedules WHERE barangay = $1 ORDER BY collection_day', [barangay]);
    res.json({ barangay, schedules: schedules.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load schedule' });
  }
});

// POST /household/report-missed
router.post('/report-missed', authenticateToken, authorizeRoles('household'), async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { description } = req.body;
    const household = await pool.query('SELECT barangay FROM Households WHERE user_id = $1', [userId]);
    if (!household.rows.length) return res.status(404).json({ error: 'Household not found' });
    const barangay = household.rows[0].barangay;
    const result = await pool.query(
      'INSERT INTO MissedPickups (user_id, barangay, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, barangay, description || '']
    );
    res.json({ message: 'Missed pickup reported', pickup: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to report missed pickup' });
  }
});

// POST /household/profile - set up household profile
router.post('/profile', authenticateToken, authorizeRoles('household'), async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { barangay, address } = req.body;
    if (!barangay || !address) return res.status(400).json({ error: 'Barangay and address required' });
    const existing = await pool.query('SELECT * FROM Households WHERE user_id = $1', [userId]);
    if (existing.rows.length) {
      const result = await pool.query('UPDATE Households SET barangay = $1, address = $2 WHERE user_id = $3 RETURNING *', [barangay, address, userId]);
      return res.json({ household: result.rows[0] });
    }
    const result = await pool.query('INSERT INTO Households (user_id, barangay, address) VALUES ($1, $2, $3) RETURNING *', [userId, barangay, address]);
    res.json({ household: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
