const { Actor } = require("../models/index");

const getAll = async () => {
  return await Actor.findAll({ raw: true });
};

const getOne = async (params) => {
  return await Actor.findOne({ where: params, raw: true });
};

module.exports = {
  getAll,
  getOne,
};
