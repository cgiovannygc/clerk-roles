"use server";

import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";

export async function setRole(formData: FormData) {
  const client = await clerkClient();

  if (!checkRole("admin")) {
    return { message: "No autorizado" };
  }

  try {
    const res = await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: formData.get("role") },
      },
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient();

  if (!checkRole("admin")) {
    return { message: "No autorizado" };
  }

  try {
    const res = await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: null },
      },
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

export async function deleteUser(formData: FormData) {
  const client = await clerkClient();

  if (!checkRole("admin")) {
    return { message: "No autorizado" };
  }

  try {
    await client.users.deleteUser(formData.get("id") as string);
    return { message: "Usuario eliminado" };
  } catch (err) {
    return { message: err };
  }
}
