import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client
export const inngest = new Inngest({ id: "Project Management" });

// ✅ User Creation
const syncUserCreation = inngest.createFunction(
  {
    id: "Sync-User-Creation",
    triggers: { event: "clerk/user.created" }, // ✅ FIX
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.create({
      data: {
        id: data.id,
        email: data?.email_addresses?.[0]?.email_address,
        name: `${data?.first_name || ""} ${data?.last_name || ""}`,
        image: data?.image_url,
      },
    });
  }
);

// ✅ User Deletion
const syncUserDeletion = inngest.createFunction(
  {
    id: "Sync-User-Deletion",
    triggers: { event: "clerk/user.deleted" }, // ✅ FIX
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  }
);

// ✅ User Update
const syncUserUpdate = inngest.createFunction(
  {
    id: "Sync-User-Update",
    triggers: { event: "clerk/user.updated" }, // ✅ FIX
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data?.email_addresses?.[0]?.email_address,
        name: `${data?.first_name || ""} ${data?.last_name || ""}`,
        image: data?.image_url,
      },
    });
  }
);

// Export
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate,
];