import express from "express";
import { createItem, editItem, getItem, getItems, getItemsByCategory, getItemsBySubCategory,  searchItem } from "../controllers/Item";

const router = express.Router(); // express router

// Item routes
router.post("/item", createItem); // create item
router.get("/items", getItems); // get all items
router.get("/item", getItem); // get single item by id or name
router.put("/item/:id", editItem); // edit item by id
router.get("/item/category/:id", getItemsByCategory); // get item by category id
router.get("/item/subcategory/:id", getItemsBySubCategory); // get item by subcategory id
router.get("/item/search", searchItem); // search item by name

export default router;