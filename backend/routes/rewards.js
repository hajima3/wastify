const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

// GET /rewards - get user's reward history and total
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const total = await pool.query('SELECT COALESCE(SUM(points), 0) AS total_points FROM Rewards WHERE user_id = $1', [userId]);
    const history = await pool.query('SELECT * FROM Rewards WHERE user_id = $1 ORDER BY date_earned DESC', [userId]);
    res.json({ totalPoints: parseInt(total.rows[0].total_points), history: history.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load rewards' });
  }
});

// POST /rewards/earn - earn points (e.g., for compliance)
router.post('/earn', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { points } = req.body;
    if (!points || points <= 0) return res.status(400).json({ error: 'Points must be positive' });
    const result = await pool.query('INSERT INTO Rewards (user_id, points) VALUES ($1, $2) RETURNING *', [userId, points]);
    res.json({ reward: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to earn points' });
  }
});

// POST /rewards/redeem - redeem points
router.post('/redeem', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { points } = req.body;
    if (!points || points <= 0) return res.status(400).json({ error: 'Points must be positive' });
    const total = await pool.query('SELECT COALESCE(SUM(points), 0) AS total FROM Rewards WHERE user_id = $1', [userId]);
    const available = parseInt(total.rows[0].total);
    if (available < points) return res.status(400).json({ error: 'Insufficient points' });
    // Deduct points by inserting negative entry
    const result = await pool.query('INSERT INTO Rewards (user_id, points) VALUES ($1, $2) RETURNING *', [userId, -points]);
    res.json({ message: 'Points redeemed', reward: result.rows[0], remainingPoints: available - points });
  } catch (err) {
    res.status(500).json({ error: 'Failed to redeem points' });
  }
});

module.exports = router;
