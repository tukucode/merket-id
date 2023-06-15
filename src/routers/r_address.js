import express from "express";
import {
  createAddress,
  allAddress,
  detailAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/c_address.js";

import { authentication, customer } from "../middleware/auth.js";

const ROUTER = express.Router();

ROUTER.post("/address/new", authentication, customer, createAddress);
ROUTER.get("/address/list", authentication, customer, allAddress);
ROUTER.get("/address/:_id/detail", authentication, customer, detailAddress);
ROUTER.put("/address/:_id/update", authentication, customer, updateAddress);
ROUTER.delete("/address/:_id/destroy", authentication, customer, deleteAddress);

export default ROUTER;
