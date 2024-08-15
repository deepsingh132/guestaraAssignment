import express from "express";
import {
  createCategory,
  editCategory,
  getCategories,
  getCategory,
} from "../controllers/Category";

const router = express.Router(); // express router

// Category routes
router.post("/category", createCategory); // create category
router.get("/categories", getCategories); // get all categories
router.get("/category", getCategory); // get single category by id or name
router.put("/category/:id", editCategory); // edit category

export default router;