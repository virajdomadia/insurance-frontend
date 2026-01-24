import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRefreshToken extends Document {
    _id: mongoose.Types.ObjectId;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: String,
            required: true,
            ref: 'User',
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for automatic cleanup of expired tokens
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken: Model<IRefreshToken> =
    mongoose.models.RefreshToken || mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
