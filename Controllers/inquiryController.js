const Inquiry = require('../models/Inquiry');

const createInquiry = async (req, res) => {
  try {
    const { vendorId, clientName, clientEmail, eventType, eventDate, budget, message } = req.body;

    const inquiry = await Inquiry.create({
      vendorId, clientName, clientEmail, eventType, eventDate, budget, message,
    });

    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVendorInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ vendorId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Validation add kiya
    const allowed = ["Pending", "Accepted", "Rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    res.status(200).json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ getDashboardStats add kiya
const getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user.userId;

    const [total, pending, accepted, rejected] = await Promise.all([
      Inquiry.countDocuments({ vendorId }),
      Inquiry.countDocuments({ vendorId, status: "Pending" }),
      Inquiry.countDocuments({ vendorId, status: "Accepted" }),
      Inquiry.countDocuments({ vendorId, status: "Rejected" }),
    ]);

    res.status(200).json({
      success: true,
      stats: { total, pending, accepted, rejected },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInquiry,
  getVendorInquiries,
  updateInquiryStatus,
  getDashboardStats, 
};