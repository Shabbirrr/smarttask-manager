import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Project Management" });

//Inngest function to save user data
const syncUserCreation= inngest.createFunction(
    { id: "Sync User Creation" },
    { event: "clerk/user.created" },
    async ({ event}) => {
        const { data } = event;
        await prisma.user.create({
            data: {
                id: data.id,
                email: data?.email_addresses[0].email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        })
    }

)

//Inngest function to delete user data
const syncUserDeletion = inngest.createFunction(
    { id: "Sync User Deletion" },
    { event: "clerk/user.deleted" },
    async ({ event}) => {
        const { data } = event;
        await prisma.user.delete({
            where: {
                id: data.id,
            }
        })
    }
)

//Inngest function to update user data
const syncUserUpdate = inngest.createFunction(
    { id: "Sync User Update" },
    { event: "clerk/user.updated" },
    async ({ event}) => {
        const { data } = event;
        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: {
                email: data?.email_addresses[0].email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        })
    }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];