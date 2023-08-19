import express from "express";
import { provinces, regencies, districts, villages } from "../controllers/c_wilayah.js"


const ROUTER = express.Router();

ROUTER.get("/provinces", provinces);
ROUTER.get("/regencies/:id", regencies);
ROUTER.get("/districts/:id", districts);
ROUTER.get("/villages/:id", villages);

export default ROUTER;
