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
    fetchProjects();

});

const projectName = document.getElementById('projectname');
const projectDescription = document.getElementById('projectdescription');
const saveProjectButton = document.getElementById('save-added-project');


saveProjectButton.addEventListener('click', (event) => {
    event.preventDefault();
    addProject();
});


async function fetchProjects(){
    
        const user = await retrieveUser();
    
        const projectList = document.getElementsByClassName('projects-grid')[0];
        
        projectList.innerHTML = "";

        const { data, error } = await supa
        .from('projects')
        .select('*')
        .eq('user_id', user.id);
    
        if(error) {
            console.log(error);
            return;
        }
    
        if(data.length == 0) {
            console.log("No projects found");
            projectList.innerHTML = '<div class="projects-grid-item">No Projects Found<div class="projects-grid-item-desctription"><p>Click Add Project to add a new Project</p></div></div>';
            return;
        }
    
        console.log(data);


        data.forEach(project => {

            projectList.innerHTML += `
            <a class="link-to-overview-project" href="overview-project.html?projectid=${project.id}">
            <div class="projects-grid-item" data-project-name="${project.name}">${project.name}<div class="projects-grid-item-desctription"><p>${project.description}</p></div></div>
            </a>`;

        });
}

async function addProject(){

    if(projectName.value == "") {
        alert("Bitte geben Sie einen Projektnamen ein.");
        return;
    }

    if(projectDescription.value == "") {
        alert("Bitte geben Sie eine Projektbeschreibung ein.");
        return;
    }

    const user = await retrieveUser();

    const { data, error } = await supa
    .from('projects')
    .insert([
        {
            name: projectName.value,
            description: projectDescription.value,
            user_id: user.id
        }
    ]);

    if(error) {
        console.log(error);
        return;
    }

    console.log(data);

    fetchProjects();
    document.getElementById('id01').style.display='none';
}


async function retrieveUser() {
    const { data: { user } } = await supa.auth.getUser();
    return user;
}