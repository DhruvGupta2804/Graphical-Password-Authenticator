// models/Behavior.js
const mongoose = require('mongoose');

const BehaviorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // Data we will collect during login
  keystrokeData: {
    type: Array, // e.g., [{key: 'a', time: 120ms}, ...]
    required: true,
  },
  mouseTrajectory: {
    type: Array, // e.g., [{x: 10, y: 25, t: 15ms}, ...]
    required: true,
  },
  totalLoginTime: { // selectionTime [cite: 28]
    type: Number, // in milliseconds
    required: true,
  }
});

module.exports = mongoose.model('Behavior', BehaviorSchema);