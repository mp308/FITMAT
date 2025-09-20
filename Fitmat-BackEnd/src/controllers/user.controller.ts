import { Request, Response } from "express";
import { Role } from "@prisma/client";
import prisma from "../utils/prisma";

const isValidRole = (value: string): value is Role => {
  return value in Role;
};

export const listUsers = async (req: Request, res: Response) => {
  const { adminId, role } = req.query as { adminId?: string; role?: string };

  if (!adminId) {
    return res.status(400).json({ message: "adminId query parameter is required." });
  }

  const admin = await prisma.user.findUnique({ where: { id: Number(adminId) } });
  if (!admin || admin.role !== Role.ADMIN) {
    return res.status(403).json({ message: "Only admins can view users." });
  }

  let filterRole: Role | undefined;
  if (role) {
    if (!isValidRole(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }
    filterRole = role as Role;
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        role: filterRole,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json(users);
  } catch (error) {
    console.error("Failed to fetch users", error);
    return res.status(500).json({ message: "Failed to fetch users." });
  }
};

export const listRoles = (_req: Request, res: Response) => {
  return res.json(Object.values(Role));
};

export const updateUserRole = async (req: Request, res: Response) => {
  const { adminId } = req.body as { adminId?: number };
  const userId = Number(req.params.userId);
  const { role } = req.body as { role?: string };

  if (!adminId || Number.isNaN(userId) || !role) {
    return res.status(400).json({ message: "adminId, userId, and role are required." });
  }

  if (!isValidRole(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  const admin = await prisma.user.findUnique({ where: { id: Number(adminId) } });
  if (!admin || admin.role !== Role.ADMIN) {
    return res.status(403).json({ message: "Only admins can update user roles." });
  }

  if (role === Role.ADMIN && admin.id === userId) {
    return res.status(400).json({ message: "Cannot change own role to ADMIN again." });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as Role },
      select: {
        id: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return res.json(updatedUser);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "User not found." });
    }

    console.error("Failed to update user role", error);
    return res.status(500).json({ message: "Failed to update user role." });
  }
};
