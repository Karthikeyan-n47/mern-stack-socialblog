const Category = require("../models/Category");
const CatchAsync = require("../utils/CatchAsync");

exports.createCategory = CatchAsync(async (req, res, next) => {
  const newCat = await Category.create(req.body);
  res.status(201).json(newCat);
});

exports.getAllCategories = CatchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});
