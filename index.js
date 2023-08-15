import express from "express";
import cors from "cors";
import { PORT } from "./src/config/secret.js";

// IMPORT ROUTER
import r_users from "./src/routers/r_users.js";
import r_roles from "./src/routers/r_roles.js";
import r_categories from "./src/routers/r_categories.js";
import r_products from "./src/routers/r_products.js";
import r_checkouts from "./src/routers/r_checkouts.js";
import r_address from "./src/routers/r_address.js";

const app = express();

app.options("/*", async (req, res) => {})

app.use(cors({origin: `http://localhost:${PORT}`}));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ROUTER
app.use("/api/v1", r_users);
app.use("/api/v1", r_roles);
app.use("/api/v1", r_categories);
app.use("/api/v1", r_products);
app.use("/api/v1", r_checkouts);
app.use("/api/v1", r_address);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
