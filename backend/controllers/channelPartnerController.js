const ChannelPartner = require('../models/ChannelPartner');
const { haversineDistanceKm } = require('../utils/haversine');

exports.listPartners = async (req, res, next) => {
  try {
    const { state, district, type } = req.query;
    const filter = {};
    if (state) filter.state = state;
    if (district) filter.district = district;
    if (type) filter.type = type;
    const partners = await ChannelPartner.find(filter).populate('supportedSchemes', 'name shortName organization');
    res.json({ success: true, count: partners.length, partners });
  } catch (err) {
    next(err);
  }
};

exports.getPartner = async (req, res, next) => {
  try {
    const partner = await ChannelPartner.findById(req.params.id).populate('supportedSchemes', 'name shortName organization');
    if (!partner) return res.status(404).json({ success: false, message: 'Channel partner not found' });
    res.json({ success: true, partner });
  } catch (err) {
    next(err);
  }
};

// POST /api/partners/nearby  { latitude, longitude, schemeId, requiredLoanAmount, maxDistanceKm }
exports.findNearbyPartners = async (req, res, next) => {
  try {
    const { latitude, longitude, schemeId, requiredLoanAmount, maxDistanceKm = 100 } = req.body;
    if (latitude == null || longitude == null) {
      return res.status(400).json({ success: false, message: 'latitude and longitude are required' });
    }

    const filter = { activeStatus: true, eligibilityStatus: 'eligible' };
    if (schemeId) filter.supportedSchemes = schemeId;

    const candidates = await ChannelPartner.find(filter).populate('supportedSchemes', 'name shortName maxLoanAmount minLoanAmount');

    const withDistance = candidates
      .map((p) => {
        const distanceKm = haversineDistanceKm(Number(latitude), Number(longitude), p.latitude, p.longitude);
        return { partner: p, distanceKm: Math.round(distanceKm * 10) / 10 };
      })
      .filter((x) => x.distanceKm <= Number(maxDistanceKm));

    // Optional soft filter: if requiredLoanAmount provided, prefer partners whose
    // supported scheme(s) cover that amount — but never fabricate live capacity data.
    let results = withDistance;
    if (requiredLoanAmount && schemeId) {
      results = withDistance.filter(({ partner }) => {
        const scheme = partner.supportedSchemes.find((s) => String(s._id) === String(schemeId));
        if (!scheme) return true;
        const withinMax = scheme.maxLoanAmount == null || Number(requiredLoanAmount) <= scheme.maxLoanAmount;
        return withinMax;
      });
    }

    results.sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({
      success: true,
      count: results.length,
      note: 'Suitable nearby channel partners — not ranked as "best". Financial/operational fields are prototype/demo data unless otherwise noted.',
      partners: results.map((r) => ({
        _id: r.partner._id,
        name: r.partner.name,
        type: r.partner.type,
        distanceKm: r.distanceKm,
        address: r.partner.address,
        state: r.partner.state,
        district: r.partner.district,
        latitude: r.partner.latitude,
        longitude: r.partner.longitude,
        supportedSchemes: r.partner.supportedSchemes,
        activeStatus: r.partner.activeStatus,
        lastVerifiedAt: r.partner.lastVerifiedAt,
        phone: r.partner.phone,
        email: r.partner.email,
        website: r.partner.website,
        sourceUrl: r.partner.sourceUrl,
        dataLabel: r.partner.dataLabel,
        fundUtilizationStatus: r.partner.fundUtilizationStatus,
        overdueStatus: r.partner.overdueStatus,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// ---- Admin CRUD ----
exports.createPartner = async (req, res, next) => {
  try {
    const partner = await ChannelPartner.create(req.body);
    res.status(201).json({ success: true, partner });
  } catch (err) {
    next(err);
  }
};

exports.updatePartner = async (req, res, next) => {
  try {
    const partner = await ChannelPartner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!partner) return res.status(404).json({ success: false, message: 'Channel partner not found' });
    res.json({ success: true, partner });
  } catch (err) {
    next(err);
  }
};

exports.deletePartner = async (req, res, next) => {
  try {
    const partner = await ChannelPartner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Channel partner not found' });
    res.json({ success: true, message: 'Channel partner deleted' });
  } catch (err) {
    next(err);
  }
};
