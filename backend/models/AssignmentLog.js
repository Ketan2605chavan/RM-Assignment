const mongoose = require('mongoose');

const assignmentLogSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    rmName: {
      type: String,
      required: [true, 'RM name is required'],
      trim: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AssignmentLog', assignmentLogSchema);