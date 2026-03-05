const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

// GET /notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const result = await pool.query('SELECT * FROM Notifications WHERE user_id = $1 ORDER BY timestamp DESC', [userId]);
    res.json({ notifications: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load notifications' });
  }
});

// DELETE /notifications/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Notifications WHERE notification_id = $1 AND user_id = $2', [id, req.user.user_id]);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

module.exports = router;
