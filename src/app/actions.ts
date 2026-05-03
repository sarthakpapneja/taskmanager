"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function createProject(data: { name: string; description?: string }) {
  const session = await getSession();
  if (session.user.role !== "ADMIN") throw new Error("Forbidden");

  const project = await prisma.project.create({
    data: {
      ...data,
      ownerId: session.user.id,
    },
  });
  revalidatePath("/dashboard");
  return project;
}

export async function getProjects() {
  await getSession();
  return prisma.project.findMany({
    include: {
      owner: { select: { name: true } },
      tasks: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUsers() {
  await getSession();
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });
}

export async function createTask(data: {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  dueDate?: Date;
}) {
  const session = await getSession();
  const task = await prisma.task.create({
    data: {
      ...data,
    },
  });
  revalidatePath("/dashboard");
  return task;
}

export async function updateTaskStatus(id: string, status: string) {
  await getSession();
  const task = await prisma.task.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/dashboard");
  return task;
}

export async function deleteTask(id: string) {
  const session = await getSession();
  if (session.user.role !== "ADMIN") throw new Error("Forbidden");
  await prisma.task.delete({ where: { id } });
  revalidatePath("/dashboard");
}

export async function deleteProject(id: string) {
  const session = await getSession();
  if (session.user.role !== "ADMIN") throw new Error("Forbidden");
  await prisma.project.delete({ where: { id } });
  revalidatePath("/dashboard");
}
