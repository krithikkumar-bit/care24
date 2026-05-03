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

/* ================= SECURITY + CORS ================= */

app.use(helmet());

app.use(cors({
  origin: [
    "https://care24-mocha.vercel.app",   // your frontend
    "http://localhost:3000",             // local testing
    "http://localhost:5000"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

/* ================= MIDDLEWARE ================= */

app.use(morgan('dev'));

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: true }));

/* ================= API ROUTES ================= */

app.use('/api/auth', authRoutes);

app.use('/api/patients', patientRoutes);

app.use('/api/caregivers', caregiverRoutes);

app.use('/api/services', serviceRoutes);

app.use('/api/bookings', bookingRoutes);

app.use('/api/sos', sosRoutes);

app.use('/api/admin', adminRoutes);

/* ================= STATIC FRONTEND ================= */

app.use(express.static(path.join(__dirname, 'public')));

/* ================= SPA ROUTING FIX ================= */

app.get('*', (req, res) => {

  res.sendFile(path.join(__dirname, 'public', 'index.html'));

});

/* ================= DATABASE CONNECTION ================= */

mongoose.connect(process.env.MONGODB_URI)

.then(() => {

  console.log('Connected to MongoDB Atlas');

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {

    console.log(`Care24 server running on port ${PORT}`);

  });

})

.catch((err) => {

  console.error('MongoDB connection error:', err);

});