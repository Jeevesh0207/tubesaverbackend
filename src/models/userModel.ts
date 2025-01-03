import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    user_id: string;
    queue: Array<{
        thumbnail: string;
        url: string;
        date: Date;
    }>;
    history: Array<{
        thumbnail: string;
        url: string;
        date: Date;
    }>;
}

const itemSchema = new Schema(
    {
        thumbnail: { type: String, required: true },
        url: { type: String, required: true },
        date: { type: Date, required: true },
    },
    { _id: false } 
);

const userSchema = new Schema<IUser>({
    user_id: { type: String, required: true, unique: true },
    queue: { type: [itemSchema], required: true },
    history: { type: [itemSchema], required: true },
});

export const User = mongoose.model<IUser>('User', userSchema);
