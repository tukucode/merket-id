import mongoose from "../config/connection.js";
const { model, Schema } = mongoose;

const schemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

const addressSchema = new Schema(
  {
    user_id: String,
    name: String,
    address: String,
    province: {
      _id: String,
      name: String,
    },
    regency: {
      _id: String,
      name: String,
    },
    district: {
      _id: String,
      name: String,
    },
    village: {
      _id: String,
      name: String,
    },
    passcode: Number,
  },
  schemaOptions
);

export default model("Address", addressSchema);
