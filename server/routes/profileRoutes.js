import { Router } from 'express';
import {
  compareProfiles,
  getProfileReport,
} from '../controllers/profileController.js';

const router = Router();

router.get('/compare', compareProfiles);
router.get('/profile/:username', getProfileReport);

export default router;
