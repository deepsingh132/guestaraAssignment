import express from "express";
import {
  createSubCategory,
  editSubCategory,
  getSubCategories,
  getSubCategory,
  getSubCategoriesByCategory
} from "../controllers/SubCategory";

const router = express.Router(); // express router

// SubCategory routes
router.post("/subcategory", createSubCategory); // create subcategory
router.get("/subcategories", getSubCategories); // get all subcategories
router.get("/subcategory", getSubCategory); // get single subcategory by id or name
router.get("/subcategories/category/:id", getSubCategoriesByCategory); // get subcategory by category
router.put("/subcategory/:id", editSubCategory); // edit subcategory by id

export default router;
