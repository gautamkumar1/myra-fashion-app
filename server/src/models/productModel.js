import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    company: {
    type: String,
    enum: ["Myra Fashion LLC","Sameera Star Fashion LLC"],
    required: [true, 'Company is required'],
    default: "Myra Fashion LLC"
    },
    modelNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    photos: [
      {
        url: { type: String, required: true },
      }
    ],
    category: {
      type: String,
      required: false,
    },
    attributes: {
      color: { type: String },
      size: { type: String },
      others: { type: Object }, // dynamic specs
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
