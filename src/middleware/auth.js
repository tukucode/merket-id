import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/secret.js";
import Messages from "../utils/messages.js";

const authentication = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) return Messages(res, 401, "Token is required");

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, SECRET_KEY, (err, result) => {
    if (err) {
      const JsonWebTokenError = ["JsonWebTokenError"].includes(err?.name);
      const TokenExpiredError = ["TokenExpiredError"].includes(err?.name);

      const errorMessage = TokenExpiredError
        ? "Token expired"
        : JsonWebTokenError
        ? "Invalid token"
        : err?.message;

      Messages(res, 403, errorMessage);
    }

    // create custome response for access role
    res.access = result.role && result.role.name;

    // create custome response for checkout
    res.checkout_user = {
      _id: result._id,
      full_name: result.full_name,
      email: result.email,
    };
    next();
  });
};

const admin = (req, res, next) => {
  const isAdminAccess = ["admin"].includes(res.access);

  if (!isAdminAccess) return Messages(res, 403, "Forbidden access");

  next();
};

const customer = (req, res, next) => {
  const isCustomerAccess = ["customer"].includes(res.access);

  if (!isCustomerAccess) return Messages(res, 403, "Forbidden access");

  next();
};

export { authentication, admin, customer };
