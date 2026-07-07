import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AdminUser } from "@prisma/client";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

export { SESSION_COOKIE, SESSION_MAX_AGE, createSession, verifySession } from "@/lib/auth/session";

export async function getAdminFromRequest(
  req: NextRequest,
): Promise<AdminUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = await verifySession(token);
  if (!userId) return null;
  const admin = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!admin || !admin.activo) return null;
  return admin;
}
