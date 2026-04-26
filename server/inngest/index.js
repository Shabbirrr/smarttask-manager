import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

export const inngest = new Inngest({ id: "Project Management" });

// ✅ User Creation
export const syncUserCreation = inngest.createFunction(
  {
    id: "Sync-User-Creation"},
    { event: "clerk/user.created" },
  
  async ({ event }) => {
    console.log("CREATE RUNNING");

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
export const syncUserDeletion = inngest.createFunction(
  {
    id: "Sync-User-Deletion"},
    { event: "clerk/user.deleted" },
  async ({ event }) => {
    console.log("DELETE RUNNING");

    const { data } = event;

    await prisma.user.delete({
      where: { id: data.id },
    });
  }
);

// ✅ User Update
export const syncUserUpdate = inngest.createFunction(
  {
    id: "Sync-User-Update"},
    { event: "clerk/user.updated" },
  async ({ event }) => {
    console.log("UPDATE RUNNING");

    const { data } = event;

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data?.email_addresses?.[0]?.email_address,
        name: `${data?.first_name || ""} ${data?.last_name || ""}`,
        image: data?.image_url,
      },
    });
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate,
];