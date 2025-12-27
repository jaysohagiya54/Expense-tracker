const express = require('express');
const router = express.Router();
const {
    getTopSpendingDays,
    getMonthlyChange,
    getPrediction
} = require('../controllers/statsController');

const validate = require('../middleware/validate');
const { userIdParamSchema } = require('../validations/statsSchema');

router.get('/top-days/:userId', validate(userIdParamSchema, 'params'), getTopSpendingDays);
router.get('/monthly-change/:userId', validate(userIdParamSchema, 'params'), getMonthlyChange);
router.get('/prediction/:userId', validate(userIdParamSchema, 'params'), getPrediction);

module.exports = router;
