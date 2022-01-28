import express from 'express';

import { getSettings, updateSettings } from './settings.controllers';

import { protect } from '@middleware/auth';

const router = express.Router();
router.use(protect);

router.route('/').get(getSettings).put(updateSettings);

module.exports = router;
