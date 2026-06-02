const Vendor = require("../models/Vendor");

const Inquiry = require("../models/Inquiry");
const createVendorProfile = async (req, res) => {
  try {
    const {
      businessName,
      category,
      phone,
      location,
      profileImage,
    } = req.body;

    const existingVendor = await Vendor.findOne({
      userId: req.user.userId,
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile already exists",
      });
    }

    const vendor = await Vendor.create({
      userId: req.user.userId,
      businessName,
      category,
      phone,
      location,
      profileImage,
    });

    res.status(201).json({
      success: true,
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      userId: req.user.userId,
    }).populate("userId", "name email");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateVendorProfile = async (req, res) => {
  try {
    const {
      businessName,
      category,
      phone,
      location,
      profileImage,
    } = req.body;

    const vendor = await Vendor.findOneAndUpdate(
      {
        userId: req.user.userId,
      },
      {
        businessName,
        category,
        phone,
        location,
        profileImage,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// vendorController.me add karo
const getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user.userId;
    const total = await Inquiry.countDocuments({ vendorId });
    const pending = await Inquiry.countDocuments({ vendorId, status: "Pending" });
    const accepted = await Inquiry.countDocuments({ vendorId, status: "Accepted" });
    const rejected = await Inquiry.countDocuments({ vendorId, status: "Rejected" });

    res.status(200).json({
      success: true,
      stats: { total, pending, accepted, rejected }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createVendorProfile,
  getVendorProfile,
  updateVendorProfile,
  getDashboardStats,
};