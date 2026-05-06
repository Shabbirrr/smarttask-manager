import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";
import sendEmail from "../configs/nodemailer.js";

export const inngest = new Inngest({ id: "Project Management" });

// ✅ User Creation
export const syncUserCreation = inngest.createFunction(
  {id: "Sync-User-Creation"},
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
      }
    })
  }
)

// ✅ User Deletion
export const syncUserDeletion = inngest.createFunction(
  {id: "Sync-User-Deletion"},
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    console.log("DELETE RUNNING");

    const { data } = event;

    await prisma.user.delete({
      where: { id: data.id }
    })
  }
)

// ✅ User Update
export const syncUserUpdate = inngest.createFunction(
  {id: "Sync-User-Update"},
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
      }
    })
  }
)

// ✅ Workspace Creation
const syncWorkspaceCreation = inngest.createFunction(
  {id: "Sync-Workspace-Creation"},
  {event: "clerk/organization.created" },
  async ({ event }) => {
    
    const { data } = event;
    await prisma.workspace.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        ownerId: data.created_by,
        image_url: data.image_url,
      },
    });
    //Add the owner to the organization
    await prisma.workspaceMember.create({
      data: {
        userId: data.created_by,
        workspaceId: data.id,
        role: "ADMIN",
      }
    })
  }
)

// ✅ Workspace Update 
const syncWorkspaceUpdate = inngest.createFunction(
  {id: "Sync-Workspace-Update"},
  { event: "clerk/organization.updated" },
  async ({ event }) => {
    
    const { data } = event;
    await prisma.workspace.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug,
        image_url: data.image_url,
      }
    })
  }
)

// ✅ Workspace Deletion
const syncWorkspaceDeletion = inngest.createFunction(
  {id: "Sync-Workspace-Deletion"},
  {event: "clerk/organization.deleted" },
  async ({ event }) => {
    
    const { data } = event;
    await prisma.workspace.delete({
      where: { id: data.id }
    })
  }
)

//✅ Workspace Member Data Save
const syncWorkspaceMemberCreation = inngest.createFunction(
  {id: "Sync-Workspace-Member-Data"},
  { event: "clerk/organizationInvitation.accepted" },
  async ({ event }) => {
    
    const { data } = event;
    await prisma.workspaceMember.create({
      data: {
        userId: data.user_id,
        workspaceId: data.organization_id,
        role: String(data.role_name).toUpperCase(),
      }
    })
  }
)

// ✅ Send Task Assignment Email
const sendTaskAssignmentEmail = inngest.createFunction(
  { id: "Send-Task-Assignment-Email" },
  { event: "app/task.created" },

  async ({ event, step }) => {
    const { taskId, origin } = event.data;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignee: true, project: true },
    });

    await sendEmail({
      to: task.assignee.email,

      subject: `New Task Assigned in ${task.project.name}`,

      body: `<div style="max-width: 600px;">
        <h2>Hi ${task.assignee.name}, 👋</h2>

        <p style="font-size: 16px;">
          You've been assigned a new task:
        </p>

        <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">
          ${task.title}
        </p>

        <div style="border: 1px solid #ddd; padding: 12px 16px; border-radius: 6px; margin-bottom: 30px;">
          <p style="margin: 6px 0;">
            <strong>Description:</strong> ${task.description}
          </p>

          <p style="margin: 6px 0;">
            <strong>Due Date:</strong>
            ${new Date(task.due_date).toLocaleDateString()}
          </p>
        </div>

        <a
          href="${origin}"
          style="background-color: #007bff; padding: 12px 24px; border-radius: 5px; color: #fff; font-weight: 600; font-size: 16px; text-decoration: none;"
        >
          View Task
        </a>

        <p style="margin-top: 20px; font-size: 14px; color: #6c757d;">
          Please make sure to review and complete it before the due date.
        </p>
      </div>`
    });

    if (
      new Date(task.due_date).toLocaleDateString() !==
      new Date().toLocaleDateString()
    ) {

      await step.sleepUntil(
        "wait-for-the-due-date",
        new Date(task.due_date)
      );

      await step.run("check-task-completion", async () => {

        const task = await prisma.task.findUnique({
          where: { id: taskId },
          include: { assignee: true, project: true },
        });

        if (!task) return;

        if (task.status !== "DONE") {

          await step.run(
            "send-due-date-reminder",
            async () => {

              await sendEmail({
                to: task.assignee.email,

                subject: `Reminder: Task "${task.title}" is due today!`,

                body: `<div style="max-width: 600px;">
                  <h2>Hi ${task.assignee.name}, 👋</h2>

                  <p style="font-size: 16px;">
                    You have a task due in ${task.project.name}!
                  </p>

                  <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">
                    ${task.title}
                  </p>

                  <div style="border: 1px solid #ddd; padding: 12px 16px; border-radius: 6px; margin-bottom: 30px;">

                    <p style="margin: 6px 0;">
                      <strong>Description:</strong>
                      ${task.description}
                    </p>

                    <p style="margin: 6px 0;">
                      <strong>Due Date:</strong>
                      ${new Date(task.due_date).toLocaleDateString()}
                    </p>

                  </div>

                  <a
                    href="${origin}"
                    style="background-color: #007bff; padding: 12px 24px; border-radius: 5px; color: #fff; font-weight: 600; font-size: 16px; text-decoration: none;"
                  >
                    View Task
                  </a>

                  <p style="margin-top: 20px; font-size: 14px; color: #6c757d;">
                    Please make sure to review and complete it before the due date.
                  </p>
                </div>`
              });

            }
          );

        }

      });

    }

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
  sendTaskAssignmentEmail,
];