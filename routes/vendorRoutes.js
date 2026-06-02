const express = require("express");
const router = express.Router();

const Vendor = require("../models/Vendor"); // ✅ IMPORTANT FIX

const {
  createVendorProfile,
  getVendorProfile,
  updateVendorProfile,
  getDashboardStats,
} = require("../Controllers/vendorController");

const protect = require("../middleware/authMiddleware");
const isVendor = require("../middleware/vendoreMiddleware");
const { upload } = require("../config/cloudinary");

router.post("/upload-image", upload.single("profileImage"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Image nahi mili" });
    res.status(200).json({ success: true, imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// 🔐 all routes protected
router.use(protect);

// ✅ Image upload route
router.post("/upload-image", upload.single("profileImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image nahi mili" });
    }
    res.status(200).json({
      success: true,
      imageUrl: req.file.path, // Cloudinary URL
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔹 CREATE PROFILE
router.post("/profile", createVendorProfile);

// 🔹 GET PROFILE
router.get("/profile", getVendorProfile);

// 🔹 GET ALL VENDORS (dropdown)
router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find().select("businessName category");

    res.status(200).json({
      success: true,
      vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// 🔹 UPDATE PROFILE
router.put("/profile", updateVendorProfile);

// 🔹 DASHBOARD STATS (vendor only)
router.get("/dashboard-stats", isVendor, getDashboardStats);

module.exports = router;