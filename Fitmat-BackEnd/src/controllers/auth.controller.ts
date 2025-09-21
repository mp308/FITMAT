import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import prisma from "../utils/prisma";
import { generateToken } from "../utils/jwt";

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;

const passwordResetMailer = emailUser && emailPassword
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    })
  : null;

const PASSWORD_RESET_TOKEN_BYTES = 6;
const PASSWORD_RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; 

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "USER",
      },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Failed to register user", error);
    return res.status(500).json({ message: "Failed to register user." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Failed to login user", error);
    return res.status(500).json({ message: "Failed to login user." });
  }
};


export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  if (!passwordResetMailer) {
    console.error("Password reset mailer is not configured.");
    return res.status(500).json({ message: "Email service is not configured." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = crypto.randomBytes(PASSWORD_RESET_TOKEN_BYTES).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    try {
      await passwordResetMailer.sendMail({
        from: `Fitmat Support <${emailUser}>`,
        to: user.email,
        subject: "Password Reset Request",
        text: [
          "Hello,",
          "",
          "We received a request to reset your password. Use the following token to reset your password:",
          "",
          "Token: " + resetToken,
          "",
          "If you did not request this, please ignore this email.",
          "",
          "Thank you,",
          "Fitmat Support",
        ].join("\n"),
        html: [
          "<p>Hello,</p>",
          "<p>We received a request to reset your password. Use the following token to reset your password:</p>",
          "<p><strong>Token:</strong> " + resetToken + "</p>",
          "<p>If you did not request this, please ignore this email.</p>",
          "<p>Thank you,<br/>Fitmat Support</p>",
        ].join(""),
      });
    } catch (emailError) {
      console.error("Failed to send password reset email", emailError);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
      return res.status(500).json({ message: "Failed to send password reset email." });
    }

    return res.status(200).json({ message: "Password reset token sent to email." });
  } catch (error) {
    console.error("Error during password reset request", error);
    return res.status(500).json({ message: "Failed to process password reset request." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body as { resetToken?: string; newPassword?: string };

  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: "resetToken and newPassword are required." });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error resetting password", error);
    return res.status(500).json({ message: "Failed to reset password." });
  }
};


