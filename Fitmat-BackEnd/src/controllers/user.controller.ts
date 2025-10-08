import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { Role } from "@prisma/client";

const MAX_PROFILE_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const isValidRole = (value: unknown): value is Role => {
  if (typeof value !== "string") {
    return false;
  }

  return (Object.values(Role) as string[]).includes(value);
};

const normalizeProfileImage = (input: unknown): string | null => {
  if (input === null || input === undefined) {
    return null;
  }

  if (typeof input !== "string") {
    throw new Error("Profile image must be provided as a base64 encoded string.");
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const match = trimmed.match(/^data:(image\/[A-Za-z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) {
    throw new Error("Profile image must be a valid base64 data URL.");
  }

  const [, mimeType, rawBase64] = match;
  if (!ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
    throw new Error("Unsupported profile image type.");
  }

  const base64Data = rawBase64.replace(/\s/g, "");
  const byteLength = Buffer.from(base64Data, "base64").length;

  if (byteLength > MAX_PROFILE_IMAGE_BYTES) {
    throw new Error("Profile image must be 2MB or smaller.");
  }

  return `data:${mimeType};base64,${base64Data}`;
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        profileImage: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Failed to get user profile", error);
    return res.status(500).json({ message: "Failed to get user profile" });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { username, profileImage: rawProfileImage } = req.body as {
      username?: string | null;
      profileImage?: string | null;
    };

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          id: { not: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    const dataToUpdate: {
      username?: string | null;
      profileImage?: string | null;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (typeof username === "string") {
      dataToUpdate.username = username || null;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "profileImage")) {
      try {
        dataToUpdate.profileImage = normalizeProfileImage(rawProfileImage);
      } catch (imageError) {
        return res.status(400).json({
          message:
            imageError instanceof Error
              ? imageError.message
              : "Invalid profile image.",
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        username: true,
        profileImage: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user profile", error);
    return res.status(500).json({ message: "Failed to update user profile" });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password (you'll need to implement password verification)
    // For now, we'll skip this verification step
    // In a real app, you should verify the current password using bcrypt

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPassword, // In real app, hash this password
        updatedAt: new Date(),
      },
    });

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Failed to change password", error);
    return res.status(500).json({ message: "Failed to change password" });
  }
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

export const listUserRoles = async (_req: Request, res: Response) => {
  try {
    return res.json(Object.values(Role));
  } catch (error) {
    console.error("Failed to fetch user roles", error);
    return res.status(500).json({ message: "Failed to fetch user roles." });
  }
};

