import ModelCheckout from "../models/m_checkouts.js";

import Messages from "../utils/messages.js";
import isValidator from "../utils/validator.js";

const createCheckout = async (req, res) => {
  const body = req.body;

  // create invoice
  const invoice = `INVOICE${Date.now()}`;

  // get data user form response chekcout_user on auth
  const user = { ...res.checkout_user };

  // assign new property in body request
  body.invoice = invoice;
  body.user = user;
  body.status = false;

  // create rule validation
  const rules = {
    invoice: "required",
    user: {
      _id: "required",
      full_name: "required",
      email: "required",
    },
    cart: "required",
    address: {
      _id: "required",
      name: "required",
    },
    status: "required|boolean",
    total: "required|numeric",
  };

  try {
    await isValidator({ ...body }, rules, null, async (err, status) => {
      if (!status) return Messages(res, 412, { ...err, status });

      await new ModelCheckout(body).save();

      Messages(res, 201, "Create success", { invoice });
    });
  } catch (error) {
    Messages(res, 500, error?.message || "Internal server error");
  }
};

const allCheckout = async (req, res) => {
  const q = req.query.q ? req.query.q : "";

  const sort_by = req.query.sort_by ? req.query.sort_by.toLowerCase() : "desc";
  const sort_key = sort_by === "asc" ? 1 : -1;

  const page = req.query.page ? parseInt(req.query.page) : 1;
  const per_page = req.query.per_page ? parseInt(req.query.per_page) : 25;

  const pages = page === 1 ? 0 : (page - 1) * per_page;

  try {
    const filter = { invoice: { $regex: q, $options: "i" } };
    const total = await ModelCheckout.count(filter);
    const data = await ModelCheckout.find(filter)
      .sort({ _id: sort_key })
      .skip(pages)
      .limit(per_page);

    const currentTotal = data.map((item) => item.total);
    let incomes = undefined;

    if (currentTotal.length) {
      incomes = currentTotal.reduce((a, b) => a + b);
    }

    Messages(
      res,
      200,
      "All data",
      { incomes, data },
      {
        page,
        per_page,
        total,
      }
    );
  } catch (error) {
    Messages(res, 500, error?.message || "Internal server error");
  }
};

const historyCheckout = async (req, res) => {
  const _id = req.params._id;

  const q = req.query.q ? req.query.q : "";

  const sort_by = req.query.sort_by ? req.query.sort_by.toLowerCase() : "desc";
  const sort_key = sort_by === "asc" ? 1 : -1;

  const page = req.query.page ? parseInt(req.query.page) : 1;
  const per_page = req.query.per_page ? parseInt(req.query.per_page) : 25;

  const pages = page === 1 ? 0 : (page - 1) * per_page;

  try {
    const filter = {
      invoice: { $regex: q, $options: "i" },
    };

    const total = await ModelCheckout.count({
      $and: [{ "user._id": _id }, filter],
    });

    const data = await ModelCheckout.find({
      $and: [{ "user._id": _id }, filter],
    })
      .sort({ _id: sort_key })
      .skip(pages)
      .limit(per_page);

    const currentTotal = data.map((item) => item.total);
    let incomes = undefined;

    if (currentTotal.length) {
      incomes = currentTotal.reduce((a, b) => a + b);
    }

    Messages(
      res,
      200,
      "All data",
      { incomes, data },
      {
        page,
        per_page,
        total,
      }
    );
  } catch (error) {
    Messages(res, 500, error?.message || "Internal server error");
  }
};

const detailCheckout = async (req, res) => {
  const invoice = req.params.invoice;

  try {
    const filter = { invoice: { $regex: invoice, $options: "i" } };
    const findByInvoice = await ModelCheckout.findOne(filter);

    if (!findByInvoice) return Messages(res, 404, "Data not found");

    Messages(res, 200, "Detail data", findByInvoice);
  } catch (error) {
    Messages(res, 500, error?.message || "Internal server error");
  }
};

const confirmCheckout = async (req, res) => {
  const invoice = req.params.invoice;
  const status = req.body.status;

  const rules = {
    status: "required|boolean",
  };

  try {
    const filter = { invoice: { $regex: invoice, $options: "i" } };
    const findByInvoice = await ModelCheckout.findOne(filter);

    if (!findByInvoice) return Messages(res, 404, "Data not found");

    await isValidator({ status }, rules, null, async (err, state) => {
      if (!state) return Messages(res, 412, { ...err, state });

      const data = await ModelCheckout.findOneAndUpdate(
        filter,
        { status },
        { new: true }
      );

      Messages(res, 200, "Confirmation success", data);
    });
  } catch (error) {
    Messages(res, 500, error?.message || "Internal server error");
  }
};

const deleteCheckout = async (req, res) => {
  const invoice = req.params.invoice;

  try {
    const filter = { invoice: { $regex: invoice, $options: "i" } };
    const findByInvoice = await ModelCheckout.findOne(filter);

    if (!findByInvoice) return Messages(res, 404, "Data not found");

    await ModelCheckout.deleteOne(filter);

    Messages(res, 200, "Detele success");
  } catch (error) {
    Messages(res, 500, error?.message || "Internal server error");
  }
};

export {
  createCheckout,
  allCheckout,
  historyCheckout,
  detailCheckout,
  confirmCheckout,
  deleteCheckout,
};
