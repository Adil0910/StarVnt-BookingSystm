const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getVendorInquiries,
  updateInquiryStatus,
  getDashboardStats,
} = require('../Controllers/inquiryController');
const  protect  = require('../middleware/authMiddleware');

router.post('/', createInquiry);
router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/vendor', protect, getVendorInquiries);
router.put('/:id/status', protect, updateInquiryStatus);

module.exports = router;