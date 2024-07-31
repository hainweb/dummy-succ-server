const express = require('express');
const { updateStatusController } = require('../Controllers/statusController');
const router = express.Router();

// Route to update user status
router.put('/updateStatus', updateStatusController);

module.exports = router;
