const Event = require('../models/Event');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, date, time, category } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title',
      });
    }

    // Get image path if uploaded
    // BUG FIX 7: Normalize path for cross-platform compatibility
    const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

    // Create event
    const event = await Event.create({
      title,
      description,
      location,
      date,
      time,
      category,
      image,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Private/Admin
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).populate('createdBy', 'name email').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Private/Admin
exports.getEventById = async (req, res) => {
  try {
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
  try {
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const { title, description, location, date, time, category, status } = req.body;

    // Update fields
    // BUG FIX 3: Use explicit undefined checks to allow empty strings
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (location !== undefined) event.location = location;
    if (date !== undefined) event.date = date;
    if (time !== undefined) event.time = time;
    if (category !== undefined) event.category = category;
    if (status !== undefined) event.status = status;

    // Update image if new one is uploaded
    if (req.file) {
      // Delete old image if exists
      if (event.image && fs.existsSync(event.image)) {
        fs.unlinkSync(event.image);
      }
      // BUG FIX 7: Normalize path for cross-platform compatibility
      event.image = req.file.path.replace(/\\/g, '/');
    }

    await event.save();

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
  try {
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Delete image file if exists
    if (event.image && fs.existsSync(event.image)) {
      fs.unlinkSync(event.image);
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Approve event
// @route   PATCH /api/events/:id/approve
// @access  Private/Admin
exports.approveEvent = async (req, res) => {
  try {
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    event.status = 'approved';
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event approved successfully',
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Reject event
// @route   PATCH /api/events/:id/reject
// @access  Private/Admin
exports.rejectEvent = async (req, res) => {
  try {
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    event.status = 'rejected';
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event rejected successfully',
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
