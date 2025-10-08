import { Request, Response } from "express";
import prisma from "../utils/prisma";

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
    const { username, profileImage } = req.body;

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

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: username || null,
        profileImage: profileImage || null,
        updatedAt: new Date(),
      },
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