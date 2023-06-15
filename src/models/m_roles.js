import Mongoose from "../config/connection.js";
const { model, Schema } = Mongoose;

const schemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

const roleSchema = new Schema(
  {
    name: String,
  },
  schemaOptions
);

export default model("Roles", roleSchema);
