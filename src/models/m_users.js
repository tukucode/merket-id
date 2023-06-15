import Mongoose from "../config/connection.js";
const { model, Schema } = Mongoose;

const schemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

const usersSchema = new Schema(
  {
    full_name: String,
    email: String,
    password: String,
    image: {
      url: String,
      cloudinary_id: String,
    },
    role: {
      _id: String,
      name: String,
    },
    status: Boolean,
    token: String,
  },
  schemaOptions
);

export default model("Users", usersSchema);
