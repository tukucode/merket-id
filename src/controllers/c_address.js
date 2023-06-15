import ModelAddress from "../models/m_address.js";

import Messages from "../utils/messages.js";
import isValidator from "../utils/validator.js";

const createAddress = async (req, res) => {
  const body = req.body;

  const rules = {
    name: "required|min:4|max:20",
    address: "required|min:10|max:255",
    province: {
      _id: "required",
      name: "required",
    },
    regency: {
      _id: "required",
      name: "required",
    },
    district: {
      _id: "required",
      name: "required",
    },
    village: {
      _id: "required",
      name: "required",
    },
    passcode: "required|numeric",
  };

  try {
    await isValidator(body, rules, null, async (err, status) => {
      if (!status) return Messages(res, 412, { ...err, status });

      const user_id = res.checkout_user._id;
      const name = body.name.toLowerCase().trim();
      const address = req.body.address.trim();

      const filter = {
        $and: [{ user_id }, { name }],
      };

      const findByName = await ModelAddress.findOne(filter);

      if (findByName)
        return Messages(res, 400, `Name ${name} has been registered`);

      const payload = { ...body, name, address, user_id };

      await new ModelAddress(payload).save();

      Messages(res, 201, "Create success");
    });
  } catch (error) {
    Messages(res, 500, error?.message || "Internal server error");
  }
};

const allAddress = async (req, res) => {
  const q = req.query.q ? req.query.q : "";

  const sort_by = req.query.sort_by ? req.query.sort_by.toLowerCase() : "desc";
  const sort_key = sort_by === "asc" ? 1 : -1;

  const page = req.query.page ? parseInt(req.query.page) : 1;
  const per_page = req.query.per_page ? parseInt(req.query.per_page) : 25;

  const pages = page === 1 ? 0 : (page - 1) * per_page;
  try {
    const user_id = res.checkout_user._id;
    const filter = {
      $and: [{ user_id }, { name: { $regex: q, $options: "i" } }],
    };

    const total = await ModelAddress.count(filter);
    const data = await ModelAddress.find(filter)
      .sort({ _id: sort_key })
      .skip(pages)
      .limit(per_page);

    Messages(res, 200, "All data", data, {
      page,
      per_page,
      total,
    });
  } catch (error) {
    Messages(res, 500, error?.message || "Internal server error");
  }
};

const detailAddress = async (req, res) => {
  const _id = req.params._id;
  const user_id = res.checkout_user._id;

  try {
    const filter = {
      $and: [{ user_id }, { _id }],
    };

    const findAddressByID = await ModelAddress.findOne(filter);
    if (!findAddressByID) return Messages(res, 404, "Data not found");

    Messages(res, 200, "Detail data", findAddressByID);
  } catch (error) {
    Messages(res, 500, error?.message || "Internal server error");
  }
};

const updateAddress = async (req, res) => {
  const _id = req.params._id;
  const user_id = res.checkout_user._id;
  const body = req.body;

  const rules = {
    name: "required|min:4|max:20",
    address: "required|min:10|max:255",
    province: {
      _id: "required",
      name: "required",
    },
    regency: {
      _id: "required",
      name: "required",
    },
    district: {
      _id: "required",
      name: "required",
    },
    village: {
      _id: "required",
      name: "required",
    },
    passcode: "required|numeric",
  };

  try {
    const filter = {
      $and: [{ user_id }, { _id }],
    };

    const findAddressByID = await ModelAddress.findOne(filter);
    if (!findAddressByID) return Messages(res, 404, "Data not found");

    await isValidator(body, rules, null, async (err, status) => {
      if (!status) return Messages(res, 412, { ...err, status });

      const name = req.body.name.toLowerCase().trim();
      const address = req.body.address.trim();

      const payload = { ...body, name, address };

      const data = await ModelAddress.findOneAndUpdate(filter, payload, {
        new: true,
      });

      Messages(res, 200, "Update success", data);
    });
  } catch (error) {
    Messages(res, 500, error?.message || "Internal server error");
  }
};

const deleteAddress = async (req, res) => {
  const _id = req.params._id;
  const user_id = res.checkout_user._id;
  try {
    const filter = {
      $and: [{ user_id }, { _id }],
    };

    const findAddressByID = await ModelAddress.findOne(filter);
    if (!findAddressByID) return Messages(res, 404, "Data not found");

    await ModelAddress.deleteOne(filter);

    Messages(res, 200, "Detele success");
  } catch (error) {
    Messages(res, 500, error?.message || "Internal server error");
  }
};

export {
  createAddress,
  allAddress,
  detailAddress,
  updateAddress,
  deleteAddress,
};
