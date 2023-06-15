import mongoose from "../config/connection.js";
const { model, Schema } = mongoose;

const schemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

const checkoutSchema = new Schema(
  {
    invoice: String,
    user: {
      _id: String,
      full_name: String,
      email: String,
    },
    cart: Array,
    address: {
      _id: String,
      name: String,
    },
    status: Boolean,
    total: Number,
  },
  schemaOptions
);

export default model("Checkouts", checkoutSchema);
