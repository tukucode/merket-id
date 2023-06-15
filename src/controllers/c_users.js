import ModelUser from "../models/m_users.js";
import ModelRoles from "../models/m_roles.js";

import Cloudinary from "../config/cloudinary.js";
import Messages from "../utils/messages.js";
import isValidator from "../utils/validator.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/secret.js";

const registerUser = async (req, res) => {
  const body = req.body;

  const rules = {
    full_name: "required|min:4|max:30",
    email: "required|email",
    password: "required|min:8|max:12",
  };

  await isValidator(body, rules, null, async (err, status) => {
    if (!status) return Messages(res, 412, { ...err, status });

    const findByEmail = await ModelUser.findOne({ email: body.email });
    if (findByEmail) return Messages(res, 400, "Email has been register");

    const findRole = await ModelRoles.findOne({ name: "customer" });
    if (!findRole) return Messages(res, 400, "Role not found");

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(body.password, salt);

    await new ModelUser({
      ...body,
      password,
      image: {
        url: null,
        cloudinary_id: null,
      },
      role: {
        _id: findRole._id,
        name: findRole.name,
      },
      status: true,
      token: null,
    }).save();

    Messages(res, 200, "Register success");
  });
};

const loginUser = async (req, res) => {
  const body = req.body;

  const rules = {
    email: "required|email",
    password: "required|min:8|max:12",
  };
  try {
    await isValidator(body, rules, null, async (err, status) => {
      if (!status) return Messages(res, 412, { ...err, status });

      const findByEmail = await ModelUser.findOne({ email: body.email });
      if (!findByEmail) return Messages(res, 400, "Email not register");

      // compare password use bcrypt
      const isHashPassword = findByEmail.password;
      const comparePassword = bcrypt.compareSync(body.password, isHashPassword);

      if (!comparePassword)
        return Messages(res, 400, "Wrong password, please check again.");

      // check status account user
      const isStatus = findByEmail.status;
      if (!isStatus)
        return Messages(res, 400, "Your account is being deactivated");

      // variable id user
      const _id = findByEmail._id;

      // encode jwt
      const payload = {
        _id: findByEmail._id,
        role: {
          _id: findByEmail.role._id,
          name: findByEmail.role.name,
        },
        full_name: findByEmail.full_name,
        email: findByEmail.email,
      };

      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });

      await ModelUser.findByIdAndUpdate(_id, { token }, { new: true });

      Messages(res, 200, "Login success", {
        _id,
        token,
        role: { ...findByEmail.role },
      });
    });
  } catch (error) {
    Messages(res, 500, error?.messages | "Internal server error");
  }
};

const logoutUser = async (req, res) => {
  const _id = req.params._id;

  try {
    const findData = await ModelUser.findById({ _id });
    if (!findData) return Messages(res, 404, "User not found");

    const payload = { token: null };
    await ModelUser.findByIdAndUpdate(_id, payload, { new: true });

    Messages(res, 200, "Logout success");
  } catch (error) {
    Messages(res, 500, error?.messages | "Internal server error");
  }
};

const allData = async (req, res) => {
  const q = req.query.q ? req.query.q : "";

  const sort_by = req.query.sort_by ? req.query.sort_by.toLowerCase() : "desc";
  const sort_key = sort_by === "asc" ? 1 : -1;

  const page = req.query.page ? parseInt(req.query.page) : 1;
  const per_page = req.query.per_page ? parseInt(req.query.per_page) : 25;

  const pages = page === 1 ? 0 : (page - 1) * per_page;

  try {
    const filter = { full_name: { $regex: q, $options: "i" } };

    const total = await ModelUser.count(filter);
    const data = await ModelUser.find(filter)
      .sort({ _id: sort_key })
      .skip(pages)
      .limit(per_page);

    // delete propertie password
    const newData = data.map((item) => {
      delete item._doc.password;
      return {
        ...item._doc,
      };
    });

    Messages(res, 200, "All data", newData, {
      page,
      per_page,
      total,
    });
  } catch (error) {
    Messages(res, 500, error?.messages | "Internal server error");
  }
};

const detailUser = async (req, res) => {
  const _id = req.params._id;

  try {
    const findUser = await ModelUser.findById({ _id });
    if (!findUser) return Messages(res, 404, "Data not found");

    delete findUser._doc.password;
    Messages(res, 200, "Detail data", findUser);
  } catch (error) {
    Messages(res, 500, error?.messages | "Internal server error");
  }
};

const updateUser = async (req, res) => {
  const _id = req.params._id;
  const body = req.body;
  const file = req.file;

  const rules = {
    full_name: ["required", "min:4", "max:30"],
    status: "required|boolean",
  };

  try {
    const findUser = await ModelUser.findById({ _id });
    if (!findUser) return Messages(res, 404, "Data not found");

    await isValidator(body, rules, null, async (err, status) => {
      if (!status) return Messages(res, 412, { ...err, status });

      let payload = {};

      if (file) {
        const user_image = findUser._doc.image.url;
        const user_cloudinary_id = findUser._doc.image.cloudinary_id;

        // Delete image from cloudinary
        if (user_image) await Cloudinary.uploader.destroy(user_cloudinary_id);

        // Upload new image to cloudinary
        const result = await Cloudinary.uploader.upload(file.path);

        // assigned data secure_url & public_id to key image
        payload.image = {
          url: result.secure_url,
          cloudinary_id: result.public_id,
        };
      }

      payload = { ...payload, ...body, full_name: req.body.full_name.trim() };

      const updateData = await ModelUser.findByIdAndUpdate(_id, payload, {
        new: true,
      });

      delete updateData._doc.password;
      Messages(res, 200, "Update success", updateData);
    });
  } catch (error) {
    Messages(res, 500, error?.messages | "Internal server error");
  }
};

const deleteUser = async (req, res) => {
  const _id = req.params._id;

  try {
    const findUser = await ModelUser.findById({ _id });
    if (!findUser) return Messages(res, 404, "Data not found");

    const user_image = findUser._doc.image.url;
    const user_cloudinary_id = findUser._doc.image.cloudinary_id;

    // Delete image from cloudinary
    if (user_image) await Cloudinary.uploader.destroy(user_cloudinary_id);

    await ModelUser.deleteOne({ _id });

    Messages(res, 200, "Delete data success");
  } catch (error) {
    Messages(res, 500, error?.messages | "Internal server error");
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  allData,
  detailUser,
  updateUser,
  deleteUser,
};
