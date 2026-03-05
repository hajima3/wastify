require('dotenv').config();
const express = require('express');
const cors = require('cors');

const helmet = require('./middleware/helmet');
const xssSanitize = require('./middleware/sanitize');
const apiLimiter = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet);
app.use(express.json());
app.use(xssSanitize);
app.use(apiLimiter);

// Import routes after app is initialized
const authRoutes = require('./routes/auth');
const notificationsRoutes = require('./routes/notifications');
const rewardsRoutes = require('./routes/rewards');
const adminRoutes = require('./routes/admin');
const householdRoutes = require('./routes/household');
const wasteGuideRoutes = require('./routes/wasteGuide');

app.use('/auth', authRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/rewards', rewardsRoutes);
app.use('/admin', adminRoutes);
app.use('/household', householdRoutes);
app.use('/waste-guide', wasteGuideRoutes);

app.get('/', (req, res) => {
  res.send('Wastify API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
