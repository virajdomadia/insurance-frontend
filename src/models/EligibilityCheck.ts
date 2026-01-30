import mongoose from 'mongoose';

const EligibilityCheckSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false, // Optional as the API currently only takes age/income/bpl
    },
    age: {
        type: Number,
        required: true,
    },
    income: {
        type: Number,
        required: true,
    },
    bplStatus: {
        type: Boolean,
        required: true,
    },
    district: {
        type: String,
        required: false,
    },
    eligiblePolicies: [{
        name: String,
        coverage: Number,
        premium: Number,
        description: String,
    }],
    checkDate: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.EligibilityCheck || mongoose.model('EligibilityCheck', EligibilityCheckSchema);
