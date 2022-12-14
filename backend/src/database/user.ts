import * as mongoose from "mongoose";

interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
}

const userSchema = new mongoose.Schema<IUser>({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
});

export const User = mongoose.model<IUser>("User", userSchema);
