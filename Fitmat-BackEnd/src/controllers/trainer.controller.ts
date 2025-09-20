import { Request, Response } from "express";
import { Role } from "@prisma/client";
import prisma from "../utils/prisma";

export const listTrainers = async (_req: Request, res: Response) => {
  try {
    const trainers = await prisma.user.findMany({
      where: { role: Role.TRAINER },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        receivedReviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = trainers.map((trainer) => {
      const ratedReviews = trainer.receivedReviews.filter(
        (review) => review.rating !== null && review.rating !== undefined
      );
      const totalReviews = trainer.receivedReviews.length;
      const ratingCount = ratedReviews.length;
      const averageRating =
        ratingCount > 0
          ? ratedReviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) /
            ratingCount
          : null;

      return {
        id: trainer.id,
        email: trainer.email,
        role: trainer.role,
        createdAt: trainer.createdAt,
        updatedAt: trainer.updatedAt,
        totalReviews,
        averageRating,
      };
    });

    return res.json(formatted);
  } catch (error) {
    console.error("Failed to fetch trainers", error);
    return res.status(500).json({ message: "Failed to fetch trainers." });
  }
};
