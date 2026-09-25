require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const eligibilityRuleRoutes = require('./routes/eligibilityRuleRoutes');
const matchRoutes = require('./routes/matchRoutes');
const channelPartnerRoutes = require('./routes/channelPartnerRoutes');
const documentRoutes = require('./routes/documentRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const miscRoutes = require('./routes/miscRoutes');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Disha API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/eligibility-rules', eligibilityRuleRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/partners', channelPartnerRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api', miscRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Disha API] Listening on port ${PORT}`);
});

module.exports = app;
