import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

/**
 * Creates a new subcategory within a category in the database based on the provided request body data.
 *
 * @param {Request} req - The request object containing the subcategory details.
 * @param {Response} res - The response object to send the result back to the client.
 * @return {Promise<Response | undefined>} A promise that resolves when the subcategory is created.
 */
export const createSubCategory = async (req: Request, res: Response): Promise<Response | undefined> => {
  const { name, image, description, taxApplicable, tax, categoryId } = req.body;

  // Guard clauses for validation
  if (!name || !image || !description || !categoryId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // find the category based on the categoryId
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    return res.status(404).json({ message: "Category not found, unable to create subcategory" });
  }

  // set default values for taxApplicable and tax
  const defaultTaxApplicable = category.taxApplicable;
  const defaultTax = category.tax;

  // create the subcategory
  try {
    const category = await prisma.subCategory.create({
      data: {
        name,
        image,
        description,
        taxApplicable: taxApplicable || defaultTaxApplicable, // set default value if not provided
        tax: tax || defaultTax, // set default value if not provided
        categoryId,
      },
    });
    return res.status(200).json(category); // return the created subcategory
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Retrieves all subcategories from the database.
 *
 * @param {Request} _req - The incoming HTTP request.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response | undefined>} A promise that resolves when the subcategories have been retrieved or an error has occurred.
 */
export const getSubCategories = async (_req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const subCategories = await prisma.subCategory.findMany();

    // if no subcategories found, return 404
    if (!subCategories || subCategories.length === 0) {
      return res.status(404).json({ message: "SubCategories not found" });
    }

    return res.status(200).json(subCategories); // return all subcategories
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Retrieves subcategories from the database that belong to a specific category based on the provided category id.
 *
 * @param {Request} req - The incoming HTTP request containing the category id.
 * @param {Response} res - The outgoing HTTP response to send the subcategories back to the client.
 * @return {Promise<Response | undefined>} A promise that resolves when the subcategories have been retrieved or an error has occurred.
 */
export const getSubCategoriesByCategory = async (req: Request, res: Response): Promise<Response | undefined> => {
  const { id } = req.params;

  // check if id is provided
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  // find subcategories by category id
  try {
    const subCategories = await prisma.subCategory.findMany({
      where: { categoryId: id },
    });

    // if no subcategories found, return 404
    if (!subCategories || subCategories.length === 0) {
      return res.status(404).json({ message: "SubCategories not found" });
    }

    return res.status(200).json(subCategories); // return subcategories
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Retrieves a subcategory from the database by its id or name.
 *
 * @param {Request} req - The incoming HTTP request containing the id or name of the subcategory.
 * @param {Response} res - The outgoing HTTP response to send the subcategory back to the client.
 * @return {Promise<Response | undefined>} A promise that resolves when the subcategory has been retrieved or an error has occurred.
 */
export const getSubCategory = async (req: Request, res: Response): Promise<Response | undefined> => {
  const { id, name } = req.query as { id?: string; name?: string };

  // check if id or name is provided
  if (!id && !name) {
    return res.status(400).json({ message: "Id or name is required" });
  }

  // find subcategory based on the id or name
  try {
    const subCategory = id
      ? await prisma.subCategory.findFirst({ where: { id } })
      : await prisma.subCategory.findFirst({
        where: { name : { contains: name, mode: "insensitive" }},
      });

    // if no subcategory found, return 404
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    return res.status(200).json(subCategory); // return subcategory
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Edits an existing subcategory in the database.
 *
 * @param {Request} req - The incoming HTTP request containing the id and updated details of the subcategory.
 * @param {Response} res - The outgoing HTTP response to send the updated subcategory back to the client or an error message.
 * @return {Promise<Response | undefined>} A promise that resolves when the subcategory has been updated or an error has occurred.
 */
export const editSubCategory = async (req: Request, res: Response): Promise<Response | undefined> => {
  const { id } = req.params;
  const { name, image, description, taxApplicable, tax } = req.body;

  // Guard clauses for validation
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  // check if at least one field is provided
  if (!name && !image && !description && taxApplicable === undefined && !tax) {
    return res.status(400).json({ message: "At least one field is required" });
  }

  // find the subCategory based on the id
  const subCategory = await prisma.subCategory.findUnique({ where: { id } });
  if (!subCategory) {
    return res.status(404).json({ message: "SubCategory not found" });
  }

  // update the subcategory
  try {
    const subCategory = await prisma.subCategory.update({
      where: { id },
      data: {
        ...name && { name }, // only update if name is provided
        ...image && { image }, // only update if image is provided
        ...description && { description }, // only update if description is provided
        ...taxApplicable && { taxApplicable: taxApplicable }, // only update if taxApplicable is provided
        ...tax && { tax }, // only update if tax is provided
      },
    });
    return res.status(200).json(subCategory); // return updated subcategory
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
