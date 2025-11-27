const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  state: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  profile_image: { type: String }, // Stores filename or URL
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);