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

// ✅ Workspace Creation
const syncWorkspaceCreation = inngest.createFunction(
  {id: "Sync-Workspace-Creation"},
  { event: "clerk/organization.created" },
  async ({ event }) => {
    console.log("WORKSPACE CREATE RUNNING");
    const { data } = event;
    await prisma.workspace.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        ownerId: data.created_by,
        image: data.image_url,
      },
    });
    //Add the owner to the organization
    await prisma.workspaceMember.create({
      data: {
        userId: data.created_by,
        workspaceId: data.id,
        role: "ADMIN",
      },
    });
  }
);

// ✅ Workspace Update 
const syncWorkspaceUpdate = inngest.createFunction(
  {id: "Sync-Workspace-Update"},
  { event: "clerk/organization.updated" },
  async ({ event }) => {
    console.log("WORKSPACE UPDATE RUNNING");
    const { data } = event;
    await prisma.workspace.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug,
        image: data.image_url,
      },
    });
  }
);

// ✅ Workspace Deletion
const syncWorkspaceDeletion = inngest.createFunction(
  {id: "Sync-Workspace-Deletion"},
  {event: "clerk/organization.deleted" },
  async ({ event }) => {
    console.log("WORKSPACE DELETE RUNNING");
    const { data } = event;
    await prisma.workspace.delete({
      where: { id: data.id },
    });
  }
);

//✅ Workspace Member Data Save
const syncWorkspaceMemberCreation = inngest.createFunction(
  {id: "Sync-Workspace-Member-Data"},
  { event: "clerk/organizationInvitation.accepted" },
  async ({ event }) => {
    console.log("WORKSPACE MEMBER DATA SAVE RUNNING");
    const { data } = event;
    await prisma.workspaceMember.create({
      data: {
        userId: data.user_id,
        workspaceId: data.organization_id,
        role: String(data.role_name).toUpperCase(),
      },
    });
  }
);

// Export all functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate,
  syncWorkspaceCreation,
  syncWorkspaceUpdate,
  syncWorkspaceDeletion,
  syncWorkspaceMemberCreation,
];