import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

// create prisma client instance for database operations
const prisma = new PrismaClient();

/**
 * Creates a new category based on the provided request body data.
 *
 * @param {Request} req - The incoming HTTP request.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response | undefined>} A promise that resolves when the category has been created or an error has occurred.
 */
export const createCategory = async (req: Request, res: Response): Promise<Response | undefined> => {
  const { name, image, description, taxApplicable, tax, taxType } = req.body;

  // Guard clauses for validation
  if (!name || !image || !description || taxApplicable === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if taxApplicable is true and tax or taxType are not provided
  if (taxApplicable === true && (!tax && !taxType)) {
    return res.status(400).json({ message: "Tax or TaxType is required" });
  }

  // create a new category
  try {
    const category = await prisma.category.create({
      data: {
        name,
        image,
        description,
        taxApplicable: taxApplicable,
        tax,
        taxType,
      },
    });
    return res.status(201).json(category); // return created category
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Retrieves a list of all categories from the database.
 *
 * @param {Request} _req - The incoming HTTP request.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response | undefined>} A promise that resolves when the categories have been retrieved or an error has occurred.
 */
export const getCategories = async (_req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const categories = await prisma.category.findMany(); // get all categories

    // check if categories are empty
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "Categories not found" });
    }

    return res.status(200).json(categories); // return all categories
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


/**
 * Retrieves a category from the database by its id or name.
 *
 * @param {Request} req - The incoming HTTP request.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response | undefined>} A promise that resolves when the category has been retrieved or an error has occurred.
 */
export const getCategory = async (req: Request, res: Response): Promise<Response | undefined> => {
  const { id, name } = req.query as { id?: string; name?: string };

  // check if id or name is provided
  if (!id && !name) {
    return res.status(400).json({ message: "Id or name is required" });
  }

  // find category by id or name based on the query parameters
  try {
    const category = id
      ? await prisma.category.findFirst({ where: { id } })
      : await prisma.category.findFirst({
        where: { name: { contains: name, mode: "insensitive" } },
      });

    // check if category is not found
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(category); // return category
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Updates a category based on the provided request body data.
 *
 * @param {Request} req - The incoming HTTP request.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response | undefined>} A promise that resolves when the category has been updated or an error has occurred.
 */
export const editCategory = async (req: Request, res: Response): Promise<Response | undefined> => {
  const { id } = req.params;
  const { name, image, description, taxApplicable, tax, taxType } = req.body;

  // Guard clauses for validation
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  // check if at least one field is provided
  if (!name && !image && !description && taxApplicable === undefined && !tax && !taxType) {
    return res.status(400).json({ message: "At least one field is required" });
  }

  // check if taxApplicable is true and tax or taxType are not provided
  if (taxApplicable === true && (!tax && !taxType)) {
    return res.status(400).json({ message: "Tax or TaxType is required" });
  }

  try {
    // check if category exists before updating
    const category = await prisma.category.findFirst({ where: { id } });

    // Guard clause to prevent unnecessary database queries
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...name && { name }, // only update name if provided
        ...image && { image }, // only update image if provided
        ...description && { description }, // only update description if provided
        ...taxApplicable && { taxApplicable: taxApplicable }, // only update taxApplicable if provided
        ...tax && { tax }, // only update tax if provided
        ...taxType && { taxType }, // only update taxType if provided
      },
    });
    return res.status(200).json(updatedCategory); // return updated category
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};