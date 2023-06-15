import express from "express";
import {
  createRole,
  allRole,
  detailRole,
  updateRole,
  deleteRole,
} from "../controllers/c_roles.js";

import { authentication, admin } from "../middleware/auth.js";

const ROUTER = express.Router();

ROUTER.post("/role/new", authentication, admin, createRole);
ROUTER.get("/role/all", authentication, admin, allRole);
ROUTER.get("/role/:_id/detail", authentication, admin, detailRole);
ROUTER.put("/role/:_id/update", authentication, admin, updateRole);
ROUTER.delete("/role/:_id/destroy", authentication, admin, deleteRole);

export default ROUTER;
