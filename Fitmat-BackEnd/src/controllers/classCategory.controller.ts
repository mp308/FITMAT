import { Request, Response } from "express";
import { Role } from "@prisma/client";
import prisma from "../utils/prisma";

export const createCategory = async (req: Request, res: Response) => {
  const { adminId, name, description } = req.body as {
    adminId?: number;
    name?: string;
    description?: string;
  };

  if (!adminId || !name) {
    return res.status(400).json({ message: "adminId and name are required." });
  }

  const admin = await prisma.user.findUnique({ where: { id: Number(adminId) } });
  if (!admin || admin.role !== Role.ADMIN) {
    return res.status(403).json({ message: "Only admins can create categories." });
  }

  try {
    const category = await prisma.classCategory.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json(category);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({ message: "Category name already exists." });
    }

    console.error("Failed to create category", error);
    return res.status(500).json({ message: "Failed to create category." });
  }
};

export const listCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.classCategory.findMany({
      orderBy: { createdAt: "asc" },
    });

    return res.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return res.status(500).json({ message: "Failed to fetch categories." });
  }
};
