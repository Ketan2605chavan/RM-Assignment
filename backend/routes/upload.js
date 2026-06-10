const express = require('express');
const multer = require('multer');
const AssignmentLog = require('../models/AssignmentLog');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const MAX_CLIENTS_PER_RM = 15;

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Step 1: Parse CSV
    const results = [];
    const csvString = req.file.buffer.toString('utf8');
    const lines = csvString.split('\n');

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(',');
      const clientName = values[0] ? values[0].trim() : '';
      const rmName = values[1] ? values[1].trim() : '';
      if (clientName && rmName) {
        results.push({ clientName, rmName });
      }
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid data found in CSV' });
    }

    // Step 2: Group new clients by RM from CSV
    const newClientsPerRM = {};
    for (const row of results) {
      if (!newClientsPerRM[row.rmName]) {
        newClientsPerRM[row.rmName] = 0;
      }
      newClientsPerRM[row.rmName]++;
    }

    // Step 3: Check existing count in MongoDB for each RM
    const validationErrors = [];

    for (const rmName of Object.keys(newClientsPerRM)) {
      const existingCount = await AssignmentLog.countDocuments({ rmName });
      const newCount = newClientsPerRM[rmName];
      const totalCount = existingCount + newCount;

      if (totalCount > MAX_CLIENTS_PER_RM) {
        validationErrors.push(
          `RM "${rmName}" already has ${existingCount} clients. Adding ${newCount} more would exceed the limit of ${MAX_CLIENTS_PER_RM}.`
        );
      }
    }

    // Step 4: If any RM is over limit — stop everything
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Workload limit exceeded!',
        errors: validationErrors,
      });
    }

    // Step 5: All good — save to MongoDB
    // Step 5: All good — save to MongoDB
    await AssignmentLog.insertMany(results);

    // Step 6: Emit real-time socket event
    const io = req.app.get('io');
    io.emit('assignment_success', {
      message: `Successfully assigned ${results.length} clients to RMs`,
      assigned: results.length,
    });

    return res.status(200).json({
      success: true,
      message: `Successfully assigned ${results.length} clients to RMs`,
      assigned: results.length,
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;