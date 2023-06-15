const messages = (res, code, message, data, pagination) => {
  const result = { code, message, data, pagination };
  return res.status(code).send(result);
};

export default messages;
