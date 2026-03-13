const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true, default: 'female' },
    nationality: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    settlementCamp: { type: String, required: true },
    dateOfJoining: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
