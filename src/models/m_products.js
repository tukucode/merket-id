import mongoose from "../config/connection.js";
const { model, Schema } = mongoose;

const schemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

const productsSchema = new Schema(
  {
    name: String,
    price: Number,
    image: {
      url: String,
      cloudinary_id: String,
    },
    category: {
      _id: String,
      name: String,
    },
  },
  schemaOptions
);

export default model("Products", productsSchema);
