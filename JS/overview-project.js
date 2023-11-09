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

    checkForDirectOpen();

    fetchProjectData();

});

const projectTitle = document.getElementById('project-title');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const projectID = urlParams.get('projectid')

const taskName = document.getElementById('taskname');
const taskDescription = document.getElementById('taskdescription');

const saveButton = document.getElementById('savebtn');

const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');

const taskIDStorage = document.getElementById('task-id-storage');

let isRunning = false;
let startTime;
let intervalId;

const hoursElement = document.querySelector('.hours');
const minutesElement = document.querySelector('.minutes');
const secondsElement = document.querySelector('.seconds');

startButton.addEventListener('click', (event) => {
    event.preventDefault();
    startTask();
});

stopButton.addEventListener('click', (event) => {
    event.preventDefault();
    stopTask();
});


saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    addTask();
});


async function fetchProjectData(){

        const user = await retrieveUser();
    
        const taskList = document.getElementById('tasks-table');
        taskList.innerHTML = "";

        const { data, error } = await supa
        .from('projects')
        .select('*')
        .eq('id', projectID)
        .single();
    
        if(error) {
            console.log(error);
            return;
        }

        projectTitle.innerHTML = "Overview - " + data.name;
        
        console.log(data);

        const { data: tasks, error: tasksError } = await supa
        .from('tasks')
        .select('*')
        .eq('project_id', projectID);


        if(tasksError) {
            console.log(tasksError);
            return;
        }

        console.log(tasks);
    
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
            <tr id="open-task-popup" data-task-id="${task.id}">
            <td class="open-task" data-task-id="${task.id}">${task.name}</td>
            <td class="open-task" data-task-id="${task.id}">${task.description}</td>
            <td class="open-task" data-task-id="${task.id}">${taskTime}</td>
            <td><img src="Asstes/Icons/delete.png" alt="delete" class="delete-task" data-task-id="${task.id}" ></td>
          </tr>
            `;
        });

        const openTaskButtons = document.querySelectorAll('.open-task');
        const deleteTaskButtons = document.querySelectorAll('.delete-task');

        openTaskButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                openTask(button.dataset.taskId, data.name);
            });
        });

        deleteTaskButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                deleteTask(button.dataset.taskId);
            });
        });

}

async function addTask() {

    const user = await retrieveUser();

    if(taskName.value == "") {
        alert("Bitte geben Sie einen Tasknamen ein.");
        console.log("No task name");
        return;
    }

    if(taskDescription.value == "") {
        alert("Bitte geben Sie eine Taskbeschreibung ein.");
        console.log("No task description");
        return;
    }

    const { data, error } = await supa
    .from('tasks')
    .insert([
        { name: taskName.value, description: taskDescription.value, project_id: projectID, user_id: user.id }
    ]);

    if(error) {
        console.log(error);
        return;
    }

    console.log(data);
    document.getElementById('id01').style.display='none';
    fetchProjectData();

}

async function openTask(taskID, projectName) {
    document.getElementById('open-task').style.display='block';
    const taskTimes = document.getElementById('task-times');
    const currentTaskDescription = document.getElementById('current-task-description');
    const currentProject = document.getElementById('current-project');
    const openTaskTitle = document.getElementById('open-task-title');

    taskTimes.innerHTML = "";

    const { data, error } = await supa
    .from('tasks')
    .select('*')
    .eq('id', taskID)
    .single();

    if(error) {
        console.log(error);
        return;
    }

    currentTaskDescription.innerHTML = data.description;
    currentProject.innerHTML = projectName;
    openTaskTitle.innerHTML = data.name;

    taskIDStorage.setAttribute('data-task-id', taskID);

    const { data: timeData, error: timeError } = await supa
    .from('time')
    .select('*')
    .eq('task_id', taskID)
    .eq('running', false);

    if(timeError) {
        console.log(timeError);
        return;
    }

    if(timeData.length == 0) {
        console.log("No times found");
        taskTimes.innerHTML = '<tr><td colspan="5">Sie haben noch keine Zeiten erfasst.</td><tr>';
        return;
    }

    console.log(timeData);



    timeData.forEach(time => {

        let startTime = new Date(time.start);
        let stopTime = new Date(time.stop);

        let totalTimeDifference = (stopTime.valueOf() - startTime.valueOf()) / 1000;

        let totalSeconds = totalTimeDifference;
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const padSec = String(seconds).padStart(2, '0');
        const padMin = String(minutes).padStart(2, '0');

        totalSeconds = padMin + "min:" + padSec + "s";    

        taskTimes.innerHTML += `
        <tr>
        <td>${startTime.toLocaleDateString()}</td>
        <td>${startTime.toLocaleTimeString()}</td>
        <td>${stopTime.toLocaleTimeString()}</td>
        <td>${totalSeconds}</td>
        <td><img src="Asstes/Icons/delete.png" alt="delete" class="delete-task delete-time" data-time-id="${time.id}" ></td>
      </tr>
        `;
    });

    const deleteTimeButtons = document.querySelectorAll('.delete-time');

    deleteTimeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            deleteTimeEntry(button.dataset.timeId);
        });
    });

    const { data: currentTimerData, error: currentTimerError } = await supa
    .from('time')
    .select('*')
    .eq('running', true)
    .eq('task_id', taskID);

    if(currentTimerError) {
        console.log(currentTimerError);
        return;
    }

    if(currentTimerData.length == 0) {
        console.log("No running timer found");
        return;
    }

    let currentTimer = currentTimerData[0];

    let timerStart = new Date(currentTimer.start);
    console.log(timerStart);
    let currentTime = new Date();
    console.log(currentTime);
    let timeDifference = (currentTime.valueOf() - timerStart.valueOf()) / 1000;

    timeDifference = Math.floor(timeDifference);

    console.log(timeDifference);

    setStopwatchTime(timeDifference);

    startButton.classList.add('hidden');
    stopButton.classList.remove('hidden');

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
        fetchProjectData();
}

async function startTask() {

    const user = await retrieveUser();

    const { data, error } = await supa
    .from('time')
    .insert([
        { task_id: taskIDStorage.dataset.taskId, user_id: user.id, start: new Date()}
    ]);

    if(error) {
        console.log(error);
        return;
    }

    console.log(data);

    startButton.classList.add('hidden');
    stopButton.classList.remove('hidden');

    startStopwatch();

}

async function stopTask() {

    const user = await retrieveUser();

    const { data: timeData, error: timeError } = await supa
    .from('time')
    .select('*')
    .eq('task_id', taskIDStorage.dataset.taskId)
    .eq('running', true)
    .limit(1)
    .single();

    if(timeError) {
        console.log(timeError);
        return;
    }

    console.log(timeData);

    let startTime = new Date(timeData.start);
    console.log(startTime);
    let stopTime = new Date();
    console.log(stopTime);
    let totalTimeDifference = (stopTime.valueOf() - startTime.valueOf()) / 1000;

    console.log(totalTimeDifference);

    let totalMinutes = Math.floor(totalTimeDifference);

    console.log(totalMinutes);
    console.log(timeData.id);

    const { data, error } = await supa
    .from('time')
    .update([
        { stop: new Date(), duration: totalMinutes, running: false}
    ])
    .eq('id', timeData.id);

    if(error) {
        console.log(error);
        return;
    }

    console.log(data);

    stopButton.classList.add('hidden');
    startButton.classList.remove('hidden');


    openTask(taskIDStorage.dataset.taskId, projectTitle.innerHTML);

    stopStopwatch();

    updateTotalTaskTime(taskIDStorage.dataset.taskId, totalMinutes, true);
}

async function deleteTimeEntry(timeEntryID) {

    const { data: timeData, error: timeError } = await supa
    .from('time')
    .select('duration')
    .eq('id', timeEntryID)
    .single();

    if(timeError) {
        console.log(timeError);
        return;
    }

    const { data, error } = await supa
    .from('time')
    .delete()
    .eq('id', timeEntryID);

    if(error) {
        console.log(error);
        return;
    }

    console.log(data);
    openTask(taskIDStorage.dataset.taskId, projectTitle.innerHTML);

    console.log(timeData);

    updateTotalTaskTime(taskIDStorage.dataset.taskId, Math.abs(timeData.duration), false);

}



function startStopwatch() {
    if (!isRunning) {
      isRunning = true;
      startButton.disabled = true;
      stopButton.disabled = false;
      startTime = Date.now() - (Number(hoursElement.textContent) * 3600000 + Number(minutesElement.textContent) * 60000 + Number(secondsElement.textContent) * 1000);
      intervalId = setInterval(updateStopwatch, 1000);
    }
  }
  
  function stopStopwatch() {
    if (isRunning) {
      isRunning = false;
      startButton.disabled = false;
      stopButton.disabled = true;
      clearInterval(intervalId);

      resetStopwatch();
    }
  }
  
  function updateStopwatch() {
    const elapsedMilliseconds = Date.now() - startTime;
    const totalSeconds = Math.floor(elapsedMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
  }

function setStopwatchTime(time) {
    const totalSeconds = time;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');

    startStopwatch();
}

function resetStopwatch() {
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
}

async function updateTotalTaskTime(targetTaskID, timeChange, addition) {

    const { data, error } = await supa
    .from('tasks')
    .select('*')
    .eq('id', targetTaskID)
    .single();

    if(error) {
        console.log(error);
        return;
    }

    console.log(data);

    let totalSeconds = data.total_time;

    if(totalSeconds === null) {
        totalSeconds = 0;
    }

    if(addition === false) {
        totalSeconds = totalSeconds - parseInt(timeChange);
    } else {
        totalSeconds += timeChange;
    }

    if(totalSeconds < 0) {
        totalSeconds = 0;
    }

    console.log(totalSeconds);

    const { data: updateData, error: updateError } = await supa
    .from('tasks')
    .update([
        { total_time: totalSeconds }
    ])
    .eq('id', targetTaskID);

    if(updateError) {
        console.log(updateError);
        return;
    }

    console.log(updateData);

    fetchProjectData();

}

function checkForDirectOpen() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if(urlParams.has('directopen')) {
        openTask(urlParams.get('directopen'), urlParams.get('projectname'));
    } else {
        console.log("No direct open");
        return;
    }
}


async function retrieveUser() {
    const { data: { user } } = await supa.auth.getUser();
    return user;
}