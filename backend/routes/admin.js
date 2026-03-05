const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /admin/analytics
router.get('/analytics', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM Users');
    const totalHouseholds = await pool.query('SELECT COUNT(*) FROM Households');
    const totalMissedPickups = await pool.query('SELECT COUNT(*) FROM MissedPickups');
    const pendingMissed = await pool.query("SELECT COUNT(*) FROM MissedPickups WHERE status = 'pending'");
    const resolvedMissed = await pool.query("SELECT COUNT(*) FROM MissedPickups WHERE status = 'resolved'");
    const totalRewardPoints = await pool.query('SELECT COALESCE(SUM(points), 0) AS total FROM Rewards');
    const routeStats = await pool.query("SELECT status, COUNT(*) FROM Routes GROUP BY status");
    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalHouseholds: parseInt(totalHouseholds.rows[0].count),
      totalMissedPickups: parseInt(totalMissedPickups.rows[0].count),
      pendingMissedPickups: parseInt(pendingMissed.rows[0].count),
      resolvedMissedPickups: parseInt(resolvedMissed.rows[0].count),
      totalRewardPoints: parseInt(totalRewardPoints.rows[0].total),
      routeStats: routeStats.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// POST /admin/schedule
router.post('/schedule', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { barangay, collection_day, time } = req.body;
    if (!barangay || !collection_day || !time) return res.status(400).json({ error: 'All fields required' });
    const result = await pool.query(
      'INSERT INTO CollectionSchedules (barangay, collection_day, time) VALUES ($1, $2, $3) RETURNING *',
      [barangay, collection_day, time]
    );
    res.json({ schedule: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

// PUT /admin/schedule/:id
router.put('/schedule/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { barangay, collection_day, time } = req.body;
    const result = await pool.query(
      'UPDATE CollectionSchedules SET barangay = $1, collection_day = $2, time = $3 WHERE schedule_id = $4 RETURNING *',
      [barangay, collection_day, time, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Schedule not found' });
    res.json({ schedule: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

// DELETE /admin/schedule/:id
router.delete('/schedule/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM CollectionSchedules WHERE schedule_id = $1', [id]);
    res.json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

// GET /admin/schedules
router.get('/schedules', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM CollectionSchedules ORDER BY barangay, collection_day');
    res.json({ schedules: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load schedules' });
  }
});

// GET /admin/routes
router.get('/routes', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Routes ORDER BY route_id');
    res.json({ routes: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load routes' });
  }
});

// POST /admin/routes
router.post('/routes', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { truck_id, area, status } = req.body;
    if (!truck_id || !area || !status) return res.status(400).json({ error: 'All fields required' });
    const result = await pool.query(
      'INSERT INTO Routes (truck_id, area, status) VALUES ($1, $2, $3) RETURNING *',
      [truck_id, area, status]
    );
    res.json({ route: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create route' });
  }
});

// PUT /admin/routes/:id
router.put('/routes/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { truck_id, area, status } = req.body;
    const result = await pool.query(
      'UPDATE Routes SET truck_id = $1, area = $2, status = $3 WHERE route_id = $4 RETURNING *',
      [truck_id, area, status, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Route not found' });
    res.json({ route: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update route' });
  }
});

// GET /admin/missed-pickups
router.get('/missed-pickups', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT mp.*, u.name, u.email FROM MissedPickups mp JOIN Users u ON mp.user_id = u.user_id ORDER BY mp.created_at DESC');
    res.json({ missedPickups: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load missed pickups' });
  }
});

// PUT /admin/missed-pickups/:id
router.put('/missed-pickups/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE MissedPickups SET status = $1 WHERE pickup_id = $2 RETURNING *', [status, id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Missed pickup not found' });
    res.json({ pickup: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update missed pickup' });
  }
});

// POST /admin/notify
router.post('/notify', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { user_id, message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });
    if (user_id) {
      const result = await pool.query('INSERT INTO Notifications (user_id, message) VALUES ($1, $2) RETURNING *', [user_id, message]);
      return res.json({ notification: result.rows[0] });
    }
    // Broadcast to all household users
    const users = await pool.query("SELECT user_id FROM Users WHERE role = 'household'");
    for (const user of users.rows) {
      await pool.query('INSERT INTO Notifications (user_id, message) VALUES ($1, $2)', [user.user_id, message]);
    }
    res.json({ message: `Notification sent to ${users.rows.length} users` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;
