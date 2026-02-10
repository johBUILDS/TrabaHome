import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import protect from '../middlewares/auth.js';
import { uploadWorkerDocs, completeWorkerProfile } from '../controllers/workerAuthController.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads', 'worker_docs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '';
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });

router.post(
  '/upload-docs',
  protect,
  upload.fields([
    { name: 'validId', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]),
  uploadWorkerDocs
);

router.put('/complete-profile', protect, completeWorkerProfile);

export default router;
