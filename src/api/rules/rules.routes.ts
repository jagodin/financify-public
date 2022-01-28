import express from 'express';

import {
    addRules,
    getRules,
    getPreviewOfAppliedRules,
    deleteRule,
    editRules,
} from './rules.controllers';

import {
    addRulesValidator,
    editRulesValidator,
    getPreviewOfAppliedRulesValidator,
} from './rules.validators';

const { idValidator } = require('../../middleware/validators/commonValidators');

import { protect } from '@middleware/auth';

const router = express.Router();
router.use(protect);

router
    .route('/')
    .post(addRulesValidator, addRules)
    .get(getRules)
    .put(editRulesValidator, editRules);
router
    .route('/preview')
    .post(getPreviewOfAppliedRulesValidator, getPreviewOfAppliedRules);
router.route('/:id').delete(idValidator, deleteRule);

module.exports = router;
