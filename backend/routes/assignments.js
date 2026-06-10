const express = require('express');
const AssignmentLog = require('../models/AssignmentLog');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const assignments = await AssignmentLog.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: assignments,
      total: assignments.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;