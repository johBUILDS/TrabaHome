import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import homeownerAuthRoutes from './routes/homeownerAuth.js';
import homeownerRequestsRoutes from './routes/homeownerRequests.js';
import searchRoutes from './routes/search.js';
import reviewRoutes from './routes/reviews.js';
import messageRoutes from './routes/messages.js';
import requestHistoryRoutes from './routes/requestHistory.js';
import requestArchiveRoutes from './routes/requestArchive.js';
import favoriteRoutes from './routes/favorites.js';
import workerAuthRoutes from './routes/workerAuth.js';
import workerJobsRoutes from './routes/workerJobs.js';
import workerDocsRoutes from './routes/workerDocs.js';
import adminRoutes from './routes/admin.js';
import connectDB from './config/database.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
// allow base64 image payloads for ID OCR (up to ~10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/homeowner', homeownerAuthRoutes);
app.use('/api/homeowner/requests', homeownerRequestsRoutes);
app.use('/api/workers', searchRoutes);
app.use('/api/workers', workerDocsRoutes);
app.use('/api/worker', workerAuthRoutes);
app.use('/api/worker', workerJobsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/request-history', requestHistoryRoutes);
app.use('/api/archive', requestArchiveRoutes);
app.use('/api/favorites', favoriteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
