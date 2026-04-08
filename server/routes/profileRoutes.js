import { Router } from 'express';
import cacheReport from '../middleware/cache.js';
import {
  compareProfiles,
  getCachedProfileReport,
  getProfileReport,
} from '../controllers/profileController.js';

const router = Router();

router.get('/compare', compareProfiles);
router.get('/profile/:username/cached', cacheReport, getCachedProfileReport);
router.get('/profile/:username', cacheReport, getProfileReport);

export default router;
