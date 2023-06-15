import express from "express";
import {
  createCategory,
  allCategory,
  detailCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/c_categories.js";

import { authentication, admin } from "../middleware/auth.js";

const ROUTER = express.Router();

ROUTER.post("/categories/new", authentication, admin, createCategory);
ROUTER.get("/categories", authentication, admin, allCategory);
ROUTER.get("/categories/:_id", authentication, admin, detailCategory);
ROUTER.put("/categories/:_id", authentication, admin, updateCategory);
ROUTER.delete("/categories/:_id", authentication, admin, deleteCategory);

export default ROUTER;
