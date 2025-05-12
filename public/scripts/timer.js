//text
let timerDisplay = document.getElementById('focus-time');
//buttons
let startStopBtn = document.getElementById('start');
let resetBtn = document.getElementById('reset')
let focusBtn = document.getElementById('focus');
let shortBreakBtn = document.getElementById('short-break');
let longBreakBtn = document.getElementById('long-break');
let editBtn = document.getElementById('edit-btn');
let closeBtn = document.getElementById('close-window-btn');
//sections
let editWindow = document.getElementById('edit-time');
//form
let timeForm = document.getElementById('edit-form');


let focusTime = 25;
let shortBreakTime = 5;
let longBreakTime = 15;
let startTime = focusTime;
let duration = startTime * 60;
let remainingTime = duration;
let intervalId = null;
let isRunning = false;

function updateDisplay(seconds)
{
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
}

function startTimer()
{
    if (intervalId) return;
    intervalId = setInterval(() => 
    {
        if (remainingTime > 0)
        {
            remainingTime--;
            updateDisplay(remainingTime);
        }
        else
        {
            startStopBtn.src = '/public/styles/resources/icons/play-fill.svg';
            startStopBtn.id = 'start';
            clearInterval(intervalId);
            intervalId = null;
            isRunning = false;
        }
    }, 1000);
}

function stopTimer() 
{
    startStopBtn.src = '/public/styles/resources/icons/play-fill.svg';
    startStopBtn.id = 'start';
    clearInterval(intervalId);
    intervalId = null;
}

function setTime(time)
{
    console.log('time change');
    stopTimer();
    duration = time;
    remainingTime = duration;
    updateDisplay(remainingTime); 
    isRunning = false;
    startStopBtn.src = '/public/styles/resources/icons/play-fill.svg';
    startStopBtn.id = 'start';
}

startStopBtn.addEventListener('click', () =>
{
    if(!isRunning)
    {
        startStopBtn.src = '/public/styles/resources/icons/pause-fill.svg';
        startStopBtn.id = 'stop';
        startTimer();
        isRunning = true;
    }
    else
    {
        startStopBtn.src = '/public/styles/resources/icons/play-fill.svg';
        startStopBtn.id = 'start';
        stopTimer();
        isRunning = false;
    }
})

editBtn.addEventListener('click', () => {
    let windowVisibility = window.getComputedStyle(editWindow).getPropertyValue("visibility");
    if(windowVisibility == 'hidden')
    {
        editWindow.style.visibility = 'visible';
    }
})

closeBtn.addEventListener('click', () => {
    let windowVisibility = window.getComputedStyle(editWindow).getPropertyValue("visibility");
    if(windowVisibility == 'visible')
    {
        editWindow.style.visibility = 'hidden';
    }
})

timeForm.addEventListener('submit', () => {
    focusTime = timeForm.elements[0].value;
    shortBreakTime = timeForm.elements[1].value;
    longBreakTime = timeForm.elements[2].value;
    setTime(focusTime * 60);
    editWindow.style.visibility = 'hidden';

    console.log('new times');
    event.preventDefault();
})

resetBtn.addEventListener('click', () => {setTime(duration)})

focusBtn.addEventListener('click', () => {setTime(focusTime * 60)})

shortBreakBtn.addEventListener('click', () => {setTime(shortBreakTime * 60)})

longBreakBtn.addEventListener('click', () => {setTime(longBreakTime * 60)})