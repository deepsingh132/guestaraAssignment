import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

/**
 * Creates a new item in the database.
 *
 * @param {Request} req - The incoming request object containing the item details.
 * @param {Response} res - The outgoing response object.
 * @return {Promise<Response>} A promise that resolves when the item has been created.
 */
export const createItem = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    name,
    image,
    description,
    taxApplicable,
    tax,
    baseAmount,
    discount,
    subCategory,
    category,
  } = req.body;

  // Guard clauses for validation
  if (
    !name ||
    !image ||
    !description ||
    taxApplicable === undefined ||
    !baseAmount ||
    (!subCategory && !category)
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // if subCategory or category is provided then check if it exists
  if (subCategory) {
    const subCategoryExists = await prisma.subCategory.findFirst({
      where: { id: subCategory },
    });
    if (!subCategoryExists) {
      return res
        .status(404)
        .json({ message: "SubCategory not found, unable to create item" });
    }
  }

  // if category is provided then check if it exists
  if (category) {
    const categoryExists = await prisma.category.findFirst({
      where: { id: category },
    });
    if (!categoryExists) {
      return res
        .status(404)
        .json({ message: "Category not found, unable to create item" });
    }
  }

  // create item
  try {
    const item = await prisma.item.create({
      data: {
        name,
        image,
        description,
        taxApplicable: taxApplicable,
        tax,
        baseAmount,
        discount: discount || 0, // set discount to 0 if not provided
        totalAmount: baseAmount - (discount || 0), // calculate total amount
        ...(subCategory && { subCategory: { connect: { id: subCategory } } }), // connect subCategory if provided
        ...(category && { category: { connect: { id: category } } }), // connect category if provided
      },
    });
    return res.status(201).json(item); // return created item
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Retrieves all items from the database.
 *
 * @param {Request} _req - The incoming HTTP request.
 * @param {Response} res - The outgoing HTTP response.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the HTTP response containing all items, or an error message if something went wrong.
 */
export const getItems = async (
  _req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const items = await prisma.item.findMany(); // get all items

    // if no items found, return 404
    if (!items || items.length === 0) {
      return res.status(404).json({ message: "Items not found" });
    }

    return res.status(200).json(items); // return all items
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Retrieves an item from the database by its id or name.
 *
 * @param {Request} req - The incoming HTTP request.
 * @param {Response} res - The outgoing HTTP response.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the HTTP response.
 */
export const getItem = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  const { id, name } = req.query as { id?: string; name?: string };

  // check if id or name is provided
  if (!id && !name) {
    return res.status(400).json({ message: "Id or name is required" });
  }

  // find item by id or name based on the query parameters
  try {
    const item = id
      ? await prisma.item.findFirst({ where: { id } })
      : await prisma.item.findFirst({
          where: { name: { contains: name, mode: "insensitive" } },
        });

    // check if item is not found
    if (!item) {
      return res.status(404).json({ message: "item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Retrieves items by their category ID.
 *
 * @param {Request} req - The incoming HTTP request.
 * @param {Response} res - The outgoing HTTP response.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the HTTP response.
 */
export const getItemsByCategory = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  const { id } = req.params;

  // check if id is provided
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  // find items by category id
  try {
    const items = await prisma.item.findMany({
      where: { category: { id } },
    });

    // check if items are not found
    if (!items || items.length === 0) {
      return res.status(404).json({ message: "Items not found" });
    }

    return res.status(200).json(items); // return items
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Retrieves items by their subcategory ID.
 *
 * @param {Request} req - The incoming HTTP request.
 * @param {Response} res - The outgoing HTTP response.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the HTTP response.
 */
export const getItemsBySubCategory = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  const { id } = req.params;

  // check if id is provided
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  // find items by subcategory id
  try {
    const items = await prisma.item.findMany({
      where: { subCategory: { id } },
    });

    // check if items are not found
    if (!items || items.length === 0) {
      return res.status(404).json({ message: "Items not found" });
    }

    return res.status(200).json(items); // return items
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Edits an existing item in the database.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @return {Promise<Response | undefined>} A promise that resolves when the item has been edited.
 */
export const editItem = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  const { id } = req.params;
  const {
    name,
    image,
    description,
    taxApplicable,
    tax,
    baseAmount,
    discount,
    subCategory,
    category,
  } = req.body;

  // Guard clauses for validation
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  // check if at least one field is provided
  if (
    !name &&
    !image &&
    !description &&
    !taxApplicable &&
    !tax &&
    !baseAmount &&
    !discount &&
    !subCategory &&
    !category
  ) {
    return res.status(400).json({ message: "At least one field is required" });
  }

  // check if taxApplicable is true and tax or taxType are not provided
  if (taxApplicable === true && !tax) {
    return res.status(400).json({ message: "Tax is required" });
  }

  // check if item exists before updating to prevent unnecessary database queries
  const itemExists = await prisma.item.findUnique({ where: { id } });
  if (!itemExists) {
    return res.status(404).json({ message: "Item not found with given id" });
  }

  // if subCategory or category is provided then check if it exists
  if (subCategory) {
    const subCategoryExists = await prisma.subCategory.findFirst({
      where: { id: subCategory },
    });
    if (!subCategoryExists) {
      return res
        .status(404)
        .json({ message: "SubCategory not found, unable to edit item" });
    }
  }

  // if category is provided then check if it exists
  if (category) {
    const categoryExists = await prisma.category.findFirst({
      where: { id: category },
    });
    if (!categoryExists) {
      return res
        .status(404)
        .json({ message: "Category not found, unable to edit item" });
    }
  }

  // update item
  try {
    const item = await prisma.item.update({
      where: { id },
      data: {
        ...name && { name }, // update name only if provided
        ...image && { image }, // update image only if provided
        ...description && { description }, // update description only if provided
        ...taxApplicable && { taxApplicable : taxApplicable }, // update taxApplicable only if provided
        ...tax && { tax }, // update tax only if provided
        ...baseAmount && { baseAmount }, // update baseAmount only if provided
        ...discount && { discount }, // update discount only if provided
        totalAmount: baseAmount - (discount || 0) || itemExists.totalAmount, // set totalAmount to existing value if not provided
        ...(subCategory && { subCategory: { connect: { id: subCategory } } }), // set subCategory only if provided
        ...(category && { category: { connect: { id: category } } }), // set category only if provided
      },
    });
    return res.status(200).json(item); // return updated item
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Searches for items in the menu based on the provided name.
 *
 * @param {Request} req - The incoming HTTP request.
 * @param {Response} res - The outgoing HTTP response.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the HTTP response.
 */
export const searchItem = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  const { name } = req.query as { name?: string };

  // check if name is provided
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  // find items by name
  try {
    const items = await prisma.item.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });

    // check if items are not found
    if (!items.length || items.length === 0) {
      return res.status(404).json({ message: "items not found" });
    }

    return res.status(200).json(items); // return items
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
