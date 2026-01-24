import mongoose, { Schema, Document, Model } from 'mongoose';

export enum PolicyStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    PENDING = 'PENDING',
}

export interface IPolicy extends Document {
    _id: mongoose.Types.ObjectId;
    userId: string;
    policyType: string;
    coverage: number;
    premium: number;
    status: PolicyStatus;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PolicySchema = new Schema<IPolicy>(
    {
        userId: {
            type: String,
            ref: 'User',
            required: true,
        },
        policyType: {
            type: String,
            required: true,
        },
        coverage: {
            type: Number,
            required: true,
            min: 0,
        },
        premium: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: Object.values(PolicyStatus),
            default: PolicyStatus.PENDING,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Policy: Model<IPolicy> = mongoose.models.Policy || mongoose.model<IPolicy>('Policy', PolicySchema);

export default Policy;
