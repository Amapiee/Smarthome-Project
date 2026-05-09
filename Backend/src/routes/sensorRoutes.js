import express from 'express';
import { getLatestData } from '../controllers/sensorController.js';

const router = express.Router();

router.get('/latest', getLatestData);

export default router;