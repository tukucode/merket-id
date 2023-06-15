import express from "express";
import {
  createProduct,
  allProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/c_products.js";

import { authentication, admin } from "../middleware/auth.js";
import uploadImg from "../middleware/upload_img.js";

const ROUTER = express.Router();

ROUTER.post("/products/new", authentication, admin, uploadImg, createProduct);
ROUTER.get("/products", authentication, allProduct);
ROUTER.get("/products/:_id/detail", authentication, admin, detailProduct);
ROUTER.put(
  "/products/:_id/update",
  authentication,
  admin,
  uploadImg,
  updateProduct
);
ROUTER.delete("/products/:_id/destroy", authentication, admin, deleteProduct);

export default ROUTER;
