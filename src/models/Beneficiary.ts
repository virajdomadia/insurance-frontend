import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBeneficiary extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    age: number;
    income: number;
    bplStatus: boolean;
    ngoId?: string;
    district: string;
    createdAt: Date;
    updatedAt: Date;
}

const BeneficiarySchema = new Schema<IBeneficiary>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
            min: 0,
            max: 150,
        },
        income: {
            type: Number,
            required: true,
            min: 0,
        },
        bplStatus: {
            type: Boolean,
            required: true,
            default: false,
        },
        district: {
            type: String,
            required: true,
            trim: true,
            default: 'Unknown', // Default for existing records
        },
        ngoId: {
            type: String,
            ref: 'User',
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Beneficiary: Model<IBeneficiary> =
    mongoose.models.Beneficiary || mongoose.model<IBeneficiary>('Beneficiary', BeneficiarySchema);

export default Beneficiary;
