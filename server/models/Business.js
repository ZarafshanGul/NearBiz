const mongoose = require('mongoose');

const CATEGORIES = ['Food', 'Fashion', 'Tech', 'Health', 'Education', 'Services', 'Retail', 'Other'];

const businessSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true, maxlength: 120 },
    ownerName:    { type: String, required: true, trim: true, maxlength: 120 },
    category:     { type: String, required: true, enum: CATEGORIES },
    city:         { type: String, required: true, trim: true, maxlength: 80 },
    tagline:      { type: String, required: true, trim: true, maxlength: 200 },
    website:      { type: String, trim: true, default: '' },
    email:        { type: String, required: true, trim: true, lowercase: true, maxlength: 160 }
  },
  { timestamps: true }
);

businessSchema.index({ businessName: 'text', tagline: 'text' });

module.exports = mongoose.model('Business', businessSchema);
module.exports.CATEGORIES = CATEGORIES;
