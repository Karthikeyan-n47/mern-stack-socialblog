const router = require("express").Router();
const categoriesController = require("../controllers/categoriesController");
const authController = require("../controllers/authController");

// create a category
router.post("/", authController.protect, categoriesController.createCategory);

// get all categories
router.get("/", categoriesController.getAllCategories);
module.exports = router;

// ----------------------------------------------------------------------------------

/*

const router = require("express").Router();
const Category = require("../models/Category");

// create a category
router.post("/", async (req, res) => {
  try {
    const newCat = await Category.create(req.body);
    res.status(201).json(newCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;


*/
