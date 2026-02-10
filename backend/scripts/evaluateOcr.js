/**
 * Evaluate Google Cloud Vision + parser accuracy on a labeled ID dataset.
 *
 * Usage:
 *   VISION_API_KEY=... node scripts/evaluateOcr.js
 *
 * Dataset format (place under backend/data/ocr-eval/*.json):
 * [
 *   {
 *     "id": "sample-1",
 *     "idType": "PhilSys",
 *     "frontImage": "data:image/jpeg;base64,...",
 *     "backImage": "data:image/jpeg;base64,...",
 *     "groundTruth": {
 *       "idNumber": "...",
 *       "surname": "...",
 *       "givenName": "...",
 *       "middleName": "...",
 *       "dateOfBirth": "YYYY-MM-DD",
 *       "nationality": "Filipino",
 *       "sex": "Male",
 *       "placeOfBirth": "...",
 *       "dateOfIssue": "YYYY-MM-DD",
 *       "expiryDate": "YYYY-MM-DD",
 *       "issuingAuthority": "..."
 *     }
 *   }
 * ]
 *
 * Metrics: exact-match accuracy per field and overall macro-average.
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { extractIdData } from '../ai/idOcr.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data', 'ocr-eval');

const FIELDS = [
  'idNumber',
  'surname',
  'givenName',
  'middleName',
  'dateOfBirth',
  'nationality',
  'sex',
  'placeOfBirth',
  'dateOfIssue',
  'expiryDate',
  'issuingAuthority'
];

const normalize = (val) => (val ?? '').toString().trim().toLowerCase();

const loadDataset = () => {
  if (!fs.existsSync(DATA_DIR)) {
    throw new Error(`Dataset folder not found: ${DATA_DIR}`);
  }
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    throw new Error(`No .json files in ${DATA_DIR}`);
  }
  return files.flatMap((file) => {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items : [items];
  });
};

const evaluate = async () => {
  const dataset = loadDataset();
  const totals = Object.fromEntries(FIELDS.map(f => [f, { correct: 0, total: 0 }]));
  const cases = [];

  for (const sample of dataset) {
    const { id, idType, frontImage, backImage, groundTruth } = sample;
    if (!frontImage || !backImage || !groundTruth) {
      console.warn(`Skipping ${id || 'unknown'}: missing images or groundTruth`);
      continue;
    }

    const predicted = await extractIdData({ frontImage, backImage, idType });
    const result = { id: id || 'n/a', mismatches: [] };

    for (const field of FIELDS) {
      const gt = normalize(groundTruth[field]);
      const pred = normalize(predicted[field]);
      totals[field].total += 1;
      if (gt === pred) {
        totals[field].correct += 1;
      } else {
        result.mismatches.push({ field, gt: groundTruth[field] || '', pred: predicted[field] || '' });
      }
    }
    cases.push(result);
  }

  const perField = FIELDS.map((f) => ({
    field: f,
    accuracy: totals[f].total ? totals[f].correct / totals[f].total : 0,
    correct: totals[f].correct,
    total: totals[f].total
  }));

  const macro = perField.reduce((sum, f) => sum + f.accuracy, 0) / perField.length;

  console.log('=== OCR Evaluation ===');
  perField.forEach((f) => {
    console.log(`${f.field.padEnd(16)} ${ (f.accuracy*100).toFixed(1)}% (${f.correct}/${f.total})`);
  });
  console.log(`Macro-average accuracy: ${(macro*100).toFixed(1)}%`);

  const errors = cases.filter(c => c.mismatches.length > 0);
  if (errors.length) {
    console.log('\nMismatches (first 10 cases):');
    errors.slice(0, 10).forEach((c) => {
      console.log(`- ${c.id}`);
      c.mismatches.forEach(m => console.log(`   ${m.field}: expected="${m.gt}" got="${m.pred}"`));
    });
  }
};

evaluate().catch((err) => {
  console.error(err);
  process.exit(1);
});
