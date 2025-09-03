// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // This will store the hashed combination of all password components
  passwordHash: {
    type: String,
    required: true,
  },
  // --- The components of the password suite ---
  textPassword: { // The plain text part
    type: String,
    required: true,
  },
  colorMap: { // The generated color-to-character mapping
    type: Map,
    of: String,
    required: true,
  },
  imageSequence: { // The required sequence of image clicks
    type: [String],
    required: true,
  }
});

// Method to hash the combined password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);