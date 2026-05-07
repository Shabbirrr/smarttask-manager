import prisma from "../configs/prisma.js";

// Get all workspaces for user
export const getWorkspaces = async (req, res) => {
    try {
        const {userId} = await req.auth();
        const workspaces = await prisma.workspace.findMany({
            where: {
                members: {some: {userId: userId}}},
            include: {
                members: {include:{user:true}},
                projects:{
                    include: {
                        tasks: {include: {assignee: true, comments: {include: {user: true}}}},
                        members: {include: {user: true}}
                    }
                },
                owner: true
            }
        });
        res.json({workspaces});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to fetch workspaces"});
    }
};

// Add member to workspace
export const addMember = async (req, res) => {
    try {
        const {userId} = await req.auth();
        const { email, role, workspaceId, message}= req.body;
        // Check if the user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Check valid inputs
        if(!workspaceId || !role){
            return res.status(400).json({error: "Workspace ID and role are required"});
        }
        // Check user identity
        if(!["ADMIN", "MEMBER"].includes(role)){
            return res.status(400).json({error: "Role must be either ADMIN or MEMBER"});
        }
        //Fetch workspace
        const workspace = await prisma.workspace.findUnique({
             where: { id: workspaceId }, include: {members: true}});
        if(!workspace){
            return res.status(404).json({error: "Workspace not found"});
        }
        // Check if the requester is an admin
        if(!workspace.members.find((member) => member.userId === userId && member.role === "ADMIN")){
            return res.status(403).json({error: "Only team lead can add members"});
        }
        // Check if the user is already a member
        const existingMember = workspace.members.find((member)=> member.userId===userId);
        if(existingMember){
            return res.status(400).json({error: "User is already a member"});
        }
        // Add member to workspace
        const member =await prisma.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId,
                role , 
                message: message || "" 
            }
        })

        res.json({member, message: "Member added successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.code || error.message});
    }   


};


