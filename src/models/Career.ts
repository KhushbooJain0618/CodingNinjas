import { Schema, model, models, Document } from "mongoose";

// 1️⃣ TypeScript Interface for the Career document
export interface ICareer extends Document {
  title: string;
  role: string;
  // Note: The 'icon' is a presentational detail handled on the frontend
  // and is not stored in the database to maintain data purity.
}

// 2️⃣ Mongoose Schema Definition
const CareerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// 3️⃣ Mongoose Model Export
// This prevents model recompilation on hot reloads
export const Career = models.Career || model<ICareer>("Career", CareerSchema);