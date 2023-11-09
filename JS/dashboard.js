import { supa } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initialisierung profile.js");

    async function getSession() {
        const { data, error } = await supa.auth.getSession();
        if (data.session == null) {
            window.location.href = "./index.html";
            console.log("No session");
        } else {
            const user = await retrieveUser();
            console.log(user);
        }
    }

    getSession();

    fetchDashboardData();
    

});

const recentProjects = document.getElementById('flex-recent-projects');

const taskList = document.querySelector('#table-recent-tasks tbody');


async function fetchDashboardData(){

    const user = await retrieveUser();

    const { data: projects, error: projectsError } = await supa
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3);

    if(projectsError) {
        console.log(projectsError);
        return;
    }

    recentProjects.innerHTML = "";

    if(projects.length == 0) {
        console.log("No projects found");
        recentProjects.innerHTML = '<div class="flex-item-recent-projects"><h2>No Recent Projects</h2></div>';
        return;
    }

    projects.forEach(project => {
        recentProjects.innerHTML += `<div class="flex-item-recent-projects" onclick="window.location.href='${"overview-project.html?projectid="+project.id}'"><h2>${project.name}</h2></div>`;
    });


    const { data: tasks, error: tasksError } = await supa
    .from('tasks')
    .select('*, projects!inner(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

    console.log(tasks);

    if(tasksError) {
        console.log(tasksError);
        return;
    }

    console.log(tasks);

    taskList.innerHTML = "";

    if(tasks.length == 0) {
        console.log("No Tasks found");
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5">Sie haben noch keine Tasks erfasst.</td>';
        taskList.appendChild(row);
        return;
    }

    tasks.forEach(task => {

        let taskTime = task.total_time;

        if(task.total_time === null) {
            taskTime = "00h:00min";
        } else {
            const totalSeconds = taskTime;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.ceil((totalSeconds % 3600) / 60);

            const padH = String(hours).padStart(2, '0');
            const padMin = String(minutes).padStart(2, '0');

            taskTime = padH + "h:" + padMin + "min";
        }

        taskList.innerHTML += `
        <tr data-task-id="${task.id}" data-project-id=${task.projects.id} data-project-name=${task.projects.name}>
        <td class="open-task" data-task-id="${task.id}" data-project-id=${task.projects.id} data-project-name=${task.projects.name}>${task.name}</td>
        <td class="open-task" data-task-id="${task.id}" data-project-id=${task.projects.id} data-project-name=${task.projects.name}>${task.description}</td>
        <td class="open-task" data-task-id="${task.id}" data-project-id=${task.projects.id} data-project-name=${task.projects.name}>${task.projects.name}</td>
        <td class="open-task" data-task-id="${task.id}" data-project-id=${task.projects.id} data-project-name=${task.projects.name}>${taskTime}</td>
        <td><img src="Asstes/Icons/delete.png" alt="delete" class="delete-task" data-task-id="${task.id}" ></td>
      </tr>
        `;
    });

    const openTaskButtons = document.querySelectorAll('.open-task');
    const deleteTaskButtons = document.querySelectorAll('.delete-task');

    openTaskButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = `./overview-project.html?projectid=${button.dataset.projectId}&directopen=${button.dataset.taskId}&projectname=${button.dataset.projectName}`;
        });
    });

    deleteTaskButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            deleteTask(button.dataset.taskId);
        });
    });

}

async function deleteTask(taskID) {
    
    const { data, error } = await supa
    .from('tasks')
    .delete()
    .eq('id', taskID);

    if(error) {
        console.log(error);
        return;
    }

    console.log(data);
    fetchDashboardData();
}



async function retrieveUser() {
    const { data: { user } } = await supa.auth.getUser();
    return user;
}