import { Router } from 'express';
import { getProfileReport } from '../controllers/profileController.js';

const router = Router();

router.get('/:username', getProfileReport);

export default router;
