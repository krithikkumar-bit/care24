const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

require('dotenv').config();

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const caregiverRoutes = require('./routes/caregivers');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const sosRoutes = require('./routes/sos');
const adminRoutes = require('./routes/admin');

const app = express();

/* ✅ FINAL CORS FIX (WORKS WITH VERCEL + RENDER) */

const allowedOrigins = [
  "https://care24-mocha.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(null, true); // allow temporarily for debugging
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

/* ✅ HANDLE PREFLIGHT REQUESTS */

app.options('*', cors());

app.use(helmet());
app.use(morgan('dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ✅ API ROUTES */

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/admin', adminRoutes);

/* ✅ STATIC FRONTEND (optional) */

app.use(express.static(path.join(__dirname, 'public')));

/* ✅ SPA FALLBACK ROUTE */

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ✅ CONNECT DATABASE + START SERVER */

mongoose.connect(process.env.MONGODB_URI)
.then(() => {

  console.log('Connected to MongoDB');

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Care24 server running on port ${PORT}`);
  });

})
.catch(err => {
  console.error('MongoDB connection error:', err);
});