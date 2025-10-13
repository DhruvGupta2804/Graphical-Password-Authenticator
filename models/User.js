// src/models/User.js - Corrected Version

const mongoose = require('mongoose');

// We no longer need bcryptjs in this file
// const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  textPasswordHash: { type: String, required: true },
  textPassword: { type: String, required: true },
  imageMap: { type: Map, of: String, required: true },
  imageSequence: { type: [String], required: true }
});

// The problematic pre-save hook has been completely removed.
// The hashing is now handled only in server.js, as it should be.

module.exports = mongoose.model('User', UserSchema);