import mongoose from 'mongoose';

export enum PolicyType {
    LIFE = 'life',
    HEALTH = 'health',
    ACCIDENT = 'accident',
    CROP = 'crop',
    OTHER = 'other',
}

export interface IPolicy {
    _id: string;
    userId: mongoose.Types.ObjectId;
    policyType: PolicyType;
    policyNumber: string;
    provider: string;
    premiumAmount: number;
    coverageAmount: number;
    startDate: Date;
    endDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const policySchema = new mongoose.Schema<IPolicy>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        policyType: {
            type: String,
            enum: Object.values(PolicyType),
            required: [true, 'Policy Type is required'],
        },
        policyNumber: {
            type: String,
            required: [true, 'Policy Number is required'],
            unique: true,
            trim: true,
        },
        provider: {
            type: String,
            required: [true, 'Provider name is required'],
            trim: true,
        },
        premiumAmount: {
            type: Number,
            required: [true, 'Premium Amount is required'],
            min: [0, 'Premium cannot be negative'],
        },
        coverageAmount: {
            type: Number,
            required: [true, 'Coverage Amount is required'],
            min: [0, 'Coverage cannot be negative'],
        },
        startDate: {
            type: Date,
            required: [true, 'Start Date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End Date is required'],
        },
        status: {
            type: String,
            enum: ['Active', 'Pending Verification', 'Lapsed', 'Expired'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent mongoose from compiling the model multiple times in development
const Policy = mongoose.models.Policy || mongoose.model<IPolicy>('Policy', policySchema);

export default Policy;
