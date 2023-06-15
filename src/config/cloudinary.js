import { CLOUD_NAME, API_KEY, API_SECRET } from "./secret.js";
import cloudinary from "cloudinary";
const Cloudinary = cloudinary.v2;

Cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export default Cloudinary;
