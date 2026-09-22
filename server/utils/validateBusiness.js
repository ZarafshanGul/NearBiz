const { CATEGORIES } = require('../models/Business');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBSITE_RE = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i;

/**
 * Validates a business submission payload.
 * Returns { valid: boolean, fields: { [fieldName]: message } }
 */
function validateBusiness(body) {
  const fields = {};
  const data = body || {};

  const businessName = String(data.businessName || '').trim();
  const ownerName    = String(data.ownerName || '').trim();
  const category      = String(data.category || '').trim();
  const city           = String(data.city || '').trim();
  const tagline        = String(data.tagline || '').trim();
  const website         = String(data.website || '').trim();
  const email           = String(data.email || '').trim();

  if (!businessName) fields.businessName = 'Business name is required.';
  else if (businessName.length > 120) fields.businessName = 'Business name is too long.';

  if (!ownerName) fields.ownerName = 'Owner name is required.';
  else if (ownerName.length > 120) fields.ownerName = 'Owner name is too long.';

  if (!category) fields.category = 'Please choose a category.';
  else if (!CATEGORIES.includes(category)) {
    fields.category = `Category must be one of: ${CATEGORIES.join(', ')}.`;
  }

  if (!city) fields.city = 'City is required.';
  else if (city.length > 80) fields.city = 'City is too long.';

  if (!tagline) fields.tagline = 'A short tagline is required.';
  else if (tagline.length > 200) fields.tagline = 'Tagline should be under 200 characters.';

  if (!email) fields.email = 'Email is required.';
  else if (!EMAIL_RE.test(email)) fields.email = 'Enter a valid email address.';

  if (website && !WEBSITE_RE.test(website)) {
    fields.website = 'Enter a valid website, e.g. www.example.com';
  }

  return {
    valid: Object.keys(fields).length === 0,
    fields,
    clean: { businessName, ownerName, category, city, tagline, website, email }
  };
}

module.exports = validateBusiness;
