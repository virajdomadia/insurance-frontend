import mongoose, { Schema, Document, Model } from 'mongoose';

export enum UserRole {
    CITIZEN = 'CITIZEN',
    NGO = 'NGO',
    ADMIN = 'ADMIN',
}

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    name?: string;
    passwordHash: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.CITIZEN,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
