import { Request, Response } from "express";
import { Role } from "@prisma/client";
import prisma from "../utils/prisma";

const USER_MEMBERSHIP_ROLES = new Set<Role>([
  Role.USER,
  Role.USER_BRONZE,
  Role.USER_GOLD,
  Role.USER_PLATINUM,
]);

const isUserMembershipRole = (role: Role) => USER_MEMBERSHIP_ROLES.has(role);

const formatClass = (clazz: any) => {
  const enrollmentCount = clazz._count?.enrollments ?? 0;
  const availableSpots =
    clazz.capacity !== null && clazz.capacity !== undefined
      ? Math.max(clazz.capacity - enrollmentCount, 0)
      : null;

  return {
    id: clazz.id,
    title: clazz.title,
    description: clazz.description,
    startTime: clazz.startTime,
    endTime: clazz.endTime,
    capacity: clazz.capacity,
    createdAt: clazz.createdAt,
    updatedAt: clazz.updatedAt,
    createdBy: clazz.createdBy,
    trainer: clazz.trainer,
    category: clazz.category,
    requiredRole: clazz.requiredRole,
    enrollmentCount,
    availableSpots,
  };
};
export const createClass = async (req: Request, res: Response) => {
  const {
    adminId,
    trainerId,
    categoryId,
    requiredRole,
    title,
    description,
    startTime,
    endTime,
    capacity,
  } = req.body as {
    adminId?: number;
    trainerId?: number;
    categoryId?: number;
    requiredRole?: Role;
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    capacity?: number;
  };

  if (!adminId || !trainerId || !title || !startTime || !endTime) {
    return res.status(400).json({
      message: "adminId, trainerId, title, startTime, and endTime are required.",
    });
  }

  if (requiredRole && !USER_MEMBERSHIP_ROLES.has(requiredRole)) {
    return res.status(400).json({
      message:
        "requiredRole must be one of USER, USER_BRONZE, USER_GOLD, USER_PLATINUM if provided.",
    });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ message: "startTime and endTime must be valid dates." });
  }

  if (end <= start) {
    return res.status(400).json({ message: "endTime must be after startTime." });
  }

  if (capacity !== undefined && capacity !== null && capacity <= 0) {
    return res
      .status(400)
      .json({ message: "capacity must be greater than zero if provided." });
  }

  try {
    const [admin, trainer, category] = await Promise.all([
      prisma.user.findUnique({ where: { id: Number(adminId) } }),
      prisma.user.findUnique({ where: { id: Number(trainerId) } }),
      categoryId !== undefined && categoryId !== null
        ? prisma.classCategory.findUnique({ where: { id: Number(categoryId) } })
        : Promise.resolve(null),
    ]);

    if (!admin || admin.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Only admins can create classes." });
    }

    if (!trainer || trainer.role !== Role.TRAINER) {
      return res.status(400).json({ message: "trainerId must reference a trainer user." });
    }

    if (categoryId && !category) {
      return res.status(400).json({ message: "categoryId must reference an existing category." });
    }

    const createdClass = await prisma.class.create({
      data: {
        title,
        description,
        startTime: start,
        endTime: end,
        capacity,
        createdById: admin.id,
        trainerId: trainer.id,
        categoryId: category ? category.id : null,
        requiredRole: requiredRole ?? null,
      },
      include: {
        createdBy: { select: { id: true, email: true, role: true } },
        trainer: { select: { id: true, email: true, role: true } },
        category: true,
      },
    });

    return res.status(201).json(createdClass);
  } catch (error) {
    console.error("Failed to create class", error);
    return res.status(500).json({ message: "Failed to create class." });
  }
};

export const listClasses = async (_req: Request, res: Response) => {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { startTime: "asc" },
      include: {
        createdBy: { select: { id: true, email: true, role: true } },
        trainer: { select: { id: true, email: true, role: true } },
        category: true,
        _count: { select: { enrollments: true } },
      },
    });

    const formatted = classes.map(formatClass);

    return res.json(formatted);
  } catch (error) {
    console.error("Failed to fetch classes", error);
    return res.status(500).json({ message: "Failed to fetch classes." });
  }
};

export const listUpcomingClasses = async (req: Request, res: Response) => {
  try {
    // ใช้เวลาปัจจุบัน (UTC) เปรียบเทียบกับ startTime ที่เก็บใน DB
    const now = new Date();

    const classes = await prisma.class.findMany({
      where: {
        startTime: { gt: now },
        // ถ้ามีสถานะยกเลิก/ปิดรับ สามารถกรองเพิ่มได้ เช่น:
        // status: "ACTIVE",
      },
      orderBy: { startTime: "asc" },
      include: {
        createdBy: { select: { id: true, email: true, role: true } },
        trainer: { select: { id: true, email: true, role: true } },
        category: true,
        _count: { select: { enrollments: true } },
      },
    });

    const formatted = classes.map(formatClass);
    return res.json(formatted);
  } catch (error) {
    console.error("Failed to fetch upcoming classes", error);
    return res.status(500).json({ message: "Failed to fetch upcoming classes." });
  }
};

export const enrollInClass = async (req: Request, res: Response) => {
  const { classId } = req.params;
  const { userId } = req.body as { userId?: number };

  if (!classId || !userId) {
    return res.status(400).json({ message: "classId and userId are required." });
  }

  try {
    const clazz = await prisma.class.findUnique({
      where: { id: Number(classId) },
      include: {
        _count: { select: { enrollments: true } },
      },
    });

    if (!clazz) {
      return res.status(404).json({ message: "Class not found." });
    }

    if (clazz.startTime <= new Date()) {
      return res
        .status(400)
        .json({ message: "Cannot enroll in a class that has started or finished." });
    }

    if (
      clazz.capacity !== null &&
      clazz.capacity !== undefined &&
      clazz._count.enrollments >= clazz.capacity
    ) {
      return res.status(400).json({ message: "Class is already full." });
    }

    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (
      clazz.requiredRole &&
      !isUserMembershipRole(user.role as Role) &&
      user.role !== Role.ADMIN &&
      user.role !== Role.TRAINER
    ) {
      return res.status(403).json({
        message: "This class is restricted to membership users.",
      });
    }

    if (
      clazz.requiredRole &&
      isUserMembershipRole(user.role as Role) &&
      user.role !== clazz.requiredRole
    ) {
      return res.status(403).json({
        message: `This class is only available to users with role ${clazz.requiredRole}.`,
      });
    }

    try {
      const enrollment = await prisma.classEnrollment.create({
        data: {
          classId: clazz.id,
          userId: user.id,
        },
      });

      return res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof Error && "code" in error && (error as any).code === "P2002") {
        return res.status(409).json({ message: "User already enrolled in this class." });
      }

      throw error;
    }
  } catch (error) {
    console.error("Failed to enroll in class", error);
    return res.status(500).json({ message: "Failed to enroll in class." });
  }
};

export const listClassEnrollments = async (req: Request, res: Response) => {
  const { classId } = req.params;

  if (!classId) {
    return res.status(400).json({ message: "classId parameter is required." });
  }

  try {
    const clazz = await prisma.class.findUnique({
      where: { id: Number(classId) },
      include: {
        createdBy: { select: { id: true, email: true, role: true } },
        trainer: { select: { id: true, email: true, role: true } },
        category: true,
      },
    });

    if (!clazz) {
      return res.status(404).json({ message: "Class not found." });
    }

    const enrollments = await prisma.classEnrollment.findMany({
      where: { classId: Number(classId) },
      include: {
        user: { select: { id: true, email: true, role: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return res.json({
      class: {
        id: clazz.id,
        title: clazz.title,
        description: clazz.description,
        startTime: clazz.startTime,
        endTime: clazz.endTime,
        capacity: clazz.capacity,
        createdBy: clazz.createdBy,
        trainer: clazz.trainer,
        category: clazz.category,
        requiredRole: clazz.requiredRole,
      },
      enrollments: enrollments.map((enrollment) => ({
        id: enrollment.id,
        createdAt: enrollment.createdAt,
        user: enrollment.user,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch class enrollments", error);
    return res.status(500).json({ message: "Failed to fetch class enrollments." });
  }
};

export const listTrainerClasses = async (req: Request, res: Response) => {
  const trainerId = Number(req.params.trainerId);

  if (Number.isNaN(trainerId)) {
    return res.status(400).json({ message: "trainerId parameter must be a valid number." });
  }

  try {
    const trainer = await prisma.user.findUnique({ where: { id: trainerId } });

    if (!trainer || trainer.role !== Role.TRAINER) {
      return res.status(404).json({ message: "Trainer not found." });
    }

    const classes = await prisma.class.findMany({
      where: { trainerId },
      orderBy: { startTime: "asc" },
      include: {
        category: true,
        _count: { select: { enrollments: true } },
      },
    });

    const formatted = classes.map(formatClass);

    return res.json({ trainer: { id: trainer.id, email: trainer.email }, classes: formatted });
  } catch (error) {
    console.error("Failed to fetch trainer classes", error);
    return res.status(500).json({ message: "Failed to fetch trainer classes." });
  }
};




export const getClassById = async (req: Request, res: Response) => {
  const classId = Number(req.params.classId);

  if (Number.isNaN(classId)) {
    return res.status(400).json({ message: "classId must be a valid number." });
  }

  try {
    const clazz = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        createdBy: { select: { id: true, email: true, role: true } },
        trainer: { select: { id: true, email: true, role: true } },
        category: true,
        _count: { select: { enrollments: true } },
        enrollments: {
          include: {
            user: { select: { id: true, email: true, role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!clazz) {
      return res.status(404).json({ message: "Class not found." });
    }

    const formatted = formatClass(clazz);

    return res.json({
      ...formatted,
      enrollments: clazz.enrollments.map((enrollment) => ({
        id: enrollment.id,
        createdAt: enrollment.createdAt,
        user: enrollment.user,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch class", error);
    return res.status(500).json({ message: "Failed to fetch class." });
  }
};




