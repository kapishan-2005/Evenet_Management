const Setting = require('../models/Setting');
const fs = require('fs');
const path = require('path');

// @desc    Get settings
// @route   GET /api/settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    // If no settings exist, create default settings
    if (!settings) {
      settings = await Setting.create({
        brandName: 'Admin Dashboard',
        primaryColor: '#ffdf00',
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    const { brandName, primaryColor } = req.body;

    let settings = await Setting.findOne();

    // If no settings exist, create new one
    if (!settings) {
      settings = await Setting.create({
        brandName: brandName || 'Admin Dashboard',
        primaryColor: primaryColor || '#ffdf00',
      });
    } else {
      // Update existing settings
      if (brandName !== undefined) settings.brandName = brandName;
      if (primaryColor !== undefined) settings.primaryColor = primaryColor;
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Upload logo
// @route   POST /api/settings/upload-logo
// @access  Private/Admin
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a logo file',
      });
    }

    let settings = await Setting.findOne();

    // If no settings exist, create new one
    if (!settings) {
      // BUG FIX 7: Normalize path for cross-platform compatibility
      settings = await Setting.create({
        logo: req.file.path.replace(/\\/g, '/'),
      });
    } else {
      // Delete old logo if exists
      if (settings.logo && fs.existsSync(settings.logo)) {
        fs.unlinkSync(settings.logo);
      }

      // Update logo path
      // BUG FIX 7: Normalize path for cross-platform compatibility
      settings.logo = req.file.path.replace(/\\/g, '/');
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'Logo uploaded successfully',
      settings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
