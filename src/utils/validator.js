import Validator from "validatorjs";

const isValidator = async (data, rules, customMessages, callback) => {
  const validation = new Validator(data, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

export default isValidator;
