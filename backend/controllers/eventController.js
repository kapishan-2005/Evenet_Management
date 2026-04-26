const Event = require('../models/Event');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Auto delete expired events
const deleteExpiredEvents = async () => {
  try {
    const now = new Date();
    
    // Find events where autoDeleteDate or autoHideDate (backward compatibility) has passed
    const expiredEvents = await Event.find({
      $or: [
        { autoDeleteDate: { $lte: now } },
        { autoHideDate: { $lte: now } }
      ]
    });

    let deletedCount = 0;
    let imagesDeleted = 0;

    for (const event of expiredEvents) {
      // Delete image file if exists
      if (event.image && fs.existsSync(event.image)) {
        try {
          fs.unlinkSync(event.image);
          imagesDeleted++;
        } catch (err) {
          console.error(`Failed to delete image for event ${event._id}:`, err.message);
        }
      }

      // Delete event document
      await event.deleteOne();
      deletedCount++;
    }

    if (deletedCount > 0) {
      console.log(`[Auto Delete] Deleted ${deletedCount} expired events and ${imagesDeleted} images at ${new Date().toISOString()}`);
    }

    return { deletedCount, imagesDeleted };
  } catch (error) {
    console.error('[Auto Delete] Error deleting expired events:', error);
    return { deletedCount: 0, imagesDeleted: 0 };
  }
};

// Export for use in server.js
exports.deleteExpiredEvents = deleteExpiredEvents;

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, date, endDate, autoDeleteDate, time, category } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title',
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Start date is required',
      });
    }

    if (!autoDeleteDate) {
      return res.status(400).json({
        success: false,
        message: 'Auto delete date is required',
      });
    }

    // Date validation
    const startDate = new Date(date);
    const autoDelete = new Date(autoDeleteDate);
    
    if (endDate) {
      const end = new Date(endDate);
      if (end < startDate) {
        return res.status(400).json({
          success: false,
          message: 'End date cannot be earlier than start date',
        });
      }
    }

    if (autoDelete < startDate) {
      return res.status(400).json({
        success: false,
        message: 'Auto delete date cannot be earlier than start date',
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
      endDate,
      autoDeleteDate,
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
    // Run cleanup before fetching events
    await deleteExpiredEvents();

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

    const { title, description, location, date, endDate, autoDeleteDate, time, category, status } = req.body;

    // Validate autoDeleteDate if provided
    if (autoDeleteDate !== undefined && !autoDeleteDate) {
      return res.status(400).json({
        success: false,
        message: 'Auto delete date is required',
      });
    }

    // Date validation
    if (date !== undefined) {
      const startDate = new Date(date);
      
      if (endDate !== undefined && endDate) {
        const end = new Date(endDate);
        if (end < startDate) {
          return res.status(400).json({
            success: false,
            message: 'End date cannot be earlier than start date',
          });
        }
      }

      if (autoDeleteDate !== undefined && autoDeleteDate) {
        const autoDelete = new Date(autoDeleteDate);
        if (autoDelete < startDate) {
          return res.status(400).json({
            success: false,
            message: 'Auto delete date cannot be earlier than start date',
          });
        }
      }
    }

    // Update fields
    // BUG FIX 3: Use explicit undefined checks to allow empty strings
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (location !== undefined) event.location = location;
    if (date !== undefined) event.date = date;
    if (endDate !== undefined) event.endDate = endDate;
    if (autoDeleteDate !== undefined) event.autoDeleteDate = autoDeleteDate;
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
