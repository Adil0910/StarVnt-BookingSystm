const isVendor = (req, res, next) => {
  if (!req.user || req.user.role !== "vendor") {
    return res.status(403).json({
      success: false,
      message: "Vendor access only",
    });
  }

  next();
};

module.exports = isVendor;