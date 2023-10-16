let isRunning = false;
let startTime;
let intervalId;

const hoursElement = document.querySelector('.hours');
const minutesElement = document.querySelector('.minutes');
const secondsElement = document.querySelector('.seconds');

const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');

startButton.addEventListener('click', startStopwatch);
stopButton.addEventListener('click', stopStopwatch);

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
