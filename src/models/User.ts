import { Schema, model, models, Document } from "mongoose";

// 1️⃣ TypeScript interface for a user
export interface IUser extends Document {
  fullname: string; // lowercase for consistency
  email: string;
  password: string; // hashed password
  createdAt: Date;
}

// 2️⃣ Mongoose schema
const userSchema = new Schema<IUser>({
  fullname: { type: String, required: true, trim: true }, // trim extra spaces
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// 3️⃣ Export Mongoose model
export const User = models.User || model<IUser>("User", userSchema);

// 4️⃣ Validation helpers
export function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@chitkara\.edu\.in$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
