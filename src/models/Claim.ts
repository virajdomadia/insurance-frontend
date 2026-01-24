import mongoose, { Schema, Document, Model } from 'mongoose';

export enum ClaimStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    PROCESSING = 'PROCESSING',
}

export interface IClaim extends Document {
    _id: mongoose.Types.ObjectId;
    beneficiaryId: string;
    userId: string;
    policyType: string;
    amount: number;
    status: ClaimStatus;
    description?: string;
    documents?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ClaimSchema = new Schema<IClaim>(
    {
        beneficiaryId: {
            type: String,
            ref: 'Beneficiary',
            required: false,
        },
        userId: {
            type: String,
            ref: 'User',
            required: true,
        },
        policyType: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: Object.values(ClaimStatus),
            default: ClaimStatus.PENDING,
        },
        description: {
            type: String,
            trim: true,
        },
        documents: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Claim: Model<IClaim> = mongoose.models.Claim || mongoose.model<IClaim>('Claim', ClaimSchema);

export default Claim;
