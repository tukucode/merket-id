import ModelRoles from "../models/m_roles.js";

import Messages from "../utils/messages.js";
import isValidator from "../utils/validator.js";

const createRole = async (req, res) => {
  const name = req.body.name;

  const rules = {
    name: "required|min:4|max:20",
  };

  try {
    await isValidator({ name }, rules, null, async (err, status) => {
      if (!status) return Messages(res, 412, { ...err, status });

      const inputName = name.toLowerCase().trim();
      const filter = { name: { $regex: inputName, $options: "i" } };
      const isSameName = await ModelRoles.findOne(filter);

      if (isSameName)
        return Messages(res, 400, `${inputName} has been register on system`);

      // create role
      await new ModelRoles({ name: inputName }).save();

      Messages(res, 201, "Create success");
    });
  } catch (error) {
    Messages(res, 500, error?.messages | "Internal server error");
  }
};

const allRole = async (req, res) => {
  const q = req.query.q ? req.query.q : "";

  const sort_by = req.query.sort_by ? req.query.sort_by.toLowerCase() : "desc";
  const sort_key = sort_by === "asc" ? 1 : -1;

  const page = req.query.page ? parseInt(req.query.page) : 1;
  const per_page = req.query.per_page ? parseInt(req.query.per_page) : 25;

  const pages = page === 1 ? 0 : (page - 1) * per_page;

  try {
    const filter = { name: { $regex: q, $options: "i" } };

    const total = await ModelRoles.count(filter);
    const data = await ModelRoles.find(filter)
      .sort({ _id: sort_key })
      .skip(pages)
      .limit(per_page);

    Messages(res, 200, "All data", data, {
      page,
      per_page,
      total,
    });
  } catch (error) {
    Messages(res, 500, error?.messages | "Internal server error");
  }
};

const detailRole = async (req, res) => {
  const _id = req.params._id;

  try {
    const findData = await ModelRoles.findById({ _id });
    if (!findData) return Messages(res, 404, "Data not found");

    Messages(res, 200, "Detail data", findData);
  } catch (error) {
    Messages(res, 500, error?.messages | "Internal server error");
  }
};

const updateRole = async (req, res) => {
  const _id = req.params._id;
  const name = req.body.name;

  const rules = {
    name: "required|min:4|max:20",
  };

  try {
    // data yang mau diupdate
    const findData = await ModelRoles.findById({ _id });
    if (!findData) return Messages(res, 404, "Data not found");

    await isValidator({ name }, rules, null, async (err, status) => {
      if (!status) return Messages(res, 412, { ...err, status });

      const inputName = name.toLowerCase().trim();
      const filter = { name: { $regex: inputName, $options: "i" } };
      // pengecekan data dari input
      const isSameName = await ModelRoles.findOne(filter);

      const currentName = findData._doc.name !== inputName;

      if (isSameName && currentName)
        return Messages(res, 400, `${inputName} has been register on system`);

      const payload = { name: inputName };
      const updateData = await ModelRoles.findByIdAndUpdate(_id, payload, {
        new: true,
      });

      Messages(res, 200, "Update success", updateData);
    });
  } catch (error) {
    Messages(res, 500, error?.messages | "Internal server error");
  }
};

const deleteRole = async (req, res) => {
  const _id = req.params._id;

  try {
    const findData = await ModelRoles.findById({ _id });
    if (!findData) return Messages(res, 404, "Data not found");

    await ModelRoles.deleteOne({ _id });

    Messages(res, 200, "Delete success");
  } catch (error) {
    Messages(res, 500, error?.messages | "Internal server error");
  }
};

export { createRole, allRole, detailRole, updateRole, deleteRole };
