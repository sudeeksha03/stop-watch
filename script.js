let timer = document.getElementById('timer');
let startStopBtn = document.getElementById('startStop');
let resetBtn = document.getElementById('reset');
let lapBtn = document.getElementById('lap');
let laps = document.getElementById('laps');
let themeToggle = document.getElementById('themeToggle');
let themeSelect = document.getElementById('themeSelect');
let beep = document.getElementById('beep');

let startTime, updatedTime, difference, tInterval;
let running = false;
let secondsElapsed = 0;

function startTimer() {
  if (!running) {
    startTime = new Date().getTime() - (difference || 0);
    tInterval = setInterval(getShowTime, 1000);
    running = true;
    startStopBtn.innerHTML = 'Stop';
  } else {
    clearInterval(tInterval);
    running = false;
    startStopBtn.innerHTML = 'Start';
  }
}

function resetTimer() {
  clearInterval(tInterval);
  difference = 0;
  running = false;
  timer.innerHTML = '00:00:00';
  startStopBtn.innerHTML = 'Start';
  laps.innerHTML = '';
  secondsElapsed = 0;
}

function getShowTime() {
  updatedTime = new Date().getTime();
  difference = updatedTime - startTime;
  
  let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((difference % (1000 * 60)) / 1000);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  timer.innerHTML = `${hours}:${minutes}:${seconds}`;

  secondsElapsed++;
  if (secondsElapsed % 60 === 0) {
    beep.play();
  }
}


function recordLap() {
  // Allow lap recording only if timer is running and not at 00:00:00
  if (running && timer.innerHTML !== '00:00:00') {
    let li = document.createElement('li');
    li.innerText = `Lap ${laps.children.length + 1}: ${timer.innerHTML}`;
    laps.appendChild(li);
  }
}


// --- THEME LOGIC ---
const themes = ['theme-cute', 'theme-dark', 'theme-funky', 'theme-mint', 'theme-sunset'];
function setTheme(theme) {
  themes.forEach(t => document.body.classList.remove(t));
  document.body.classList.add(theme);
  localStorage.setItem('stopwatch-theme', theme);
  if (themeSelect) themeSelect.value = theme;
}

function nextTheme() {
  let current = themes.findIndex(t => document.body.classList.contains(t));
  let next = (current + 1) % themes.length;
  setTheme(themes[next]);
}

if (themeToggle) {
  themeToggle.addEventListener('click', nextTheme);
}

if (themeSelect) {
  themeSelect.addEventListener('change', (e) => setTheme(e.target.value));
}

// On load, set theme from localStorage or default
window.addEventListener('DOMContentLoaded', () => {
  let saved = localStorage.getItem('stopwatch-theme');
  setTheme(saved && themes.includes(saved) ? saved : 'theme-cute');
});

startStopBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);
