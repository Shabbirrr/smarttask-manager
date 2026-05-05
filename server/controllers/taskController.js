import prisma from "../configs/prisma";


// Create task
export const createTask = async (req,res) =>{
    try {
        const {userId} = await req.auth(); 
        const {projectId, title, description, type, status,
             priority, assigneeId, due_date} = req.body; 
        const origin= req.get('origin');

        // Check if the user is admin
        const project = await prisma.project.findUnique({
            where: {id: projectId},
            include: {members: {include: {user: true}}}
        })

        if(!project){
            return res.status(404).json({message: "Project not found"});
        } else if (project.team_lead !== userId){
            return res.status(403).json({message: "Only team lead can create task"});
        } else if(assigneeId && !project.members.some((member)=>
             member.userId === assigneeId)){
            return res.status(403).json({message: "Assignee must be a member of the project"});
        }

        const task = await prisma.task.create({
            data: {
                projectId,
                title,
                description,
                priority,
                assigneeId,
                status,
                due_date: due_date ? new Date(due_date) : null,
            }
        })

        const taskWithAssignee = await prisma.task.findUnique({
            where: {id: task.id},
            include: {assignee: true}
        })

        res.json({task: taskWithAssignee, message: "Task created successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message || error.code});
    }
}


// Updae task
export const updateTask = async (req,res) =>{
    try {
        const task= await prisma.task.findUnique({
            where: {id: req.params.id},
         })
         if(!task){
            return res.status(404).json({message: "Task not found"});
        }

        const {userId} = await req.auth();

        const project = await prisma.project.findUnique({
            where: {id: task.projectId},
            include: {members: {include: {user: true}}}
        })

        if(!project){
            return res.status(404).json({message: "Project not found"});
        } else if (project.team_lead !== userId){
            return res.status(403).json({message: "Only team lead can update task"});
        } 

        const updatedTask = await prisma.task.update({
            where: {id: req.params.id},
            data: req.body
        })

        res.json({task: updatedTask, message: "Task updated successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message || error.code});
    }
}


// Delete task
export const deleteTask = async (req,res) =>{
    try {
        const {userId} = await req.auth();
        const {taskIds} = req.body; // Expecting an array of task IDs

        const tasks = await prisma.task.findMany({
            where: {id: {in: taskIds}},
            })

        if(tasks.length === 0){
            return res.status(404).json({message: "No tasks found"});
        }

        const project = await prisma.project.findUnique({
            where: {id: tasks[0].projectId},
            include: {members: {include: {user: true}}}
        })

        if(!project){
            return res.status(404).json({message: "Project not found"});
        } else if (project.team_lead !== userId){
            return res.status(403).json({message: "Only team lead can delete task"});
        } 

        await prisma.task.deleteMany({
            where: {id: {in: taskIds}},
        })

        res.json({message: "Task deleted successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message || error.code});
    }
}