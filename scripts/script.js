// Boot Sequence
const bootScreen = document.getElementById('boot-screen');
const bootIcon = document.getElementById('boot-icon');
const bootDialog = document.getElementById('boot-dialog');
const bootText = document.getElementById('bootText');
const progressSection = document.getElementById('progressSection');
const progressBar = document.getElementById('progressBar');
const status = document.getElementById('status');
const desktopContainer = document.getElementById('desktop-container');
const modemSequence = document.getElementById('modem-sequence');
const modemText = document.getElementById('modem-text');
const bbsWindow = document.getElementById('bbs-window');
const messageDisplay = document.getElementById('message-display');
const bbsCommand = document.getElementById('bbs-command');

// Audio Elements
const systemChirp = document.getElementById('systemChirp');
const fanSound1 = document.getElementById('fanSound1');
const fanSound2 = document.getElementById('fanSound2');
const clicksSound = document.getElementById('clicksSound');
const bootBeep = document.getElementById('bootBeep');
const startupSound = document.getElementById('startupSound');

// Boot-Up Sequence
const bootLines = [
  "Running diagnostics... <span class='ok'>[OK]</span>",
  "Testing memory... <span class='ok'>[OK]</span>",
  "Booting from ROM BIOS... <span class='ok'>[OK]</span>",
  "Checking floppy disk drives... <span class='fail'>[FAIL - No floppy detected]</span>",
  "Probing PCI buses... <span class='ok'>[OK]</span>",
  "Loading quantum cache... <span class='ok'>[OK]</span>",
  "Verifying hexadecimal transport matrix... <span class='ok'>[OK]</span>",
  "Initializing THUNDERBIRD OS... <span class='ok'>[OK]</span>",
  "Syncing with orbital relays... <span class='ok'>[OK]</span>",
  "Finalizing system integrity check... <span class='ok'>[OK]</span>"
];

let bootIndex = 0;
let isChirping = true;

function initBootScreen() {
  systemChirp.volume = 0.3;
  systemChirp.onerror = () => console.log('System chirp failed to load');

  if (systemChirp.canPlayType('audio/mpeg')) {
    systemChirp.play().catch(err => console.log('Error playing system chirp:', err));
  } else {
    console.log('System chirp audio format not supported or file not found.');
  }

  bootIcon.addEventListener('click', () => {
    isChirping = false;
    if (systemChirp.canPlayType('audio/mpeg')) {
      systemChirp.pause();
    }
    document.querySelector('.boot-icon-label .question-mark').style.animation = 'none';
    document.querySelector('.boot-icon-label .question-mark').style.opacity = '1';
    startBoot();
  });
}

function startBoot() {
  bootDialog.style.display = 'block';

  fanSound1.volume = 0.4;
  fanSound2.volume = 0;
  clicksSound.volume = 0.3;
  startupSound.volume = 0.3;

  fanSound1.onerror = () => console.log('Fan sound 1 failed to load');
  fanSound2.onerror = () => console.log('Fan sound 2 failed to load');
  clicksSound.onerror = () => console.log('Clicks sound failed to load');
  bootBeep.onerror = () => console.log('Boot beep failed to load');

  if (fanSound1.canPlayType('audio/mpeg')) {
    fanSound1.play().catch(err => console.log('Error playing fan sound 1:', err));
  }

  const crossfadeDuration = 2000;
  let isFirstPlaying = true;

  function crossfade() {
    if (isFirstPlaying) {
      fanSound2.currentTime = 0;
      if (fanSound2.canPlayType('audio/mpeg')) {
        fanSound2.play().catch(err => console.log('Error playing fan sound 2:', err));
      }
      fadeOut(fanSound1, crossfadeDuration);
      fadeIn(fanSound2, crossfadeDuration);
    } else {
      fanSound1.currentTime = 0;
      if (fanSound1.canPlayType('audio/mpeg')) {
        fanSound1.play().catch(err => console.log('Error playing fan sound 1:', err));
      }
      fadeOut(fanSound2, crossfadeDuration);
      fadeIn(fanSound1, crossfadeDuration);
    }
    isFirstPlaying = !isFirstPlaying;
  }

  fanSound1.addEventListener('timeupdate', function() {
    if (fanSound1.duration - fanSound1.currentTime <= crossfadeDuration / 1000) {
      crossfade();
    }
  });

  fanSound2.addEventListener('timeupdate', function() {
    if (fanSound2.duration - fanSound2.currentTime <= crossfadeDuration / 1000) {
      crossfade();
    }
  });

  // Manually loop clicksSound during boot sequence
  function loopClicksSound() {
    clicksSound.currentTime = 0;
    if (clicksSound.canPlayType('audio/mpeg')) {
      clicksSound.play().catch(err => console.log('Error playing clicks sound:', err));
    }
  }

  if (clicksSound.canPlayType('audio/mpeg')) {
    clicksSound.play().catch(err => console.log('Error playing clicks sound:', err));
    clicksSound.addEventListener('ended', loopClicksSound);
  }

  if (bootBeep.canPlayType('audio/mpeg')) {
    bootBeep.play().catch(err => console.log('Error playing boot beep:', err));
  }

  function fadeIn(audio, duration) {
    let volume = 0;
    const increment = 0.4 / (duration / 50);
    const interval = setInterval(() => {
      if (volume >= 0.4) {
        clearInterval(interval);
        audio.volume = 0.4;
      } else {
        volume += increment;
        audio.volume = Math.min(volume, 0.4);
      }
    }, 50);
  }

  function fadeOut(audio, duration) {
    let volume = audio.volume;
    const decrement = volume / (duration / 50);
    const interval = setInterval(() => {
      if (volume <= 0) {
        clearInterval(interval);
        audio.volume = 0;
        audio.pause();
        if (audio === clicksSound) {
          audio.removeEventListener('ended', loopClicksSound);
          console.log('Clicks sound stopped and loop event listener removed');
        }
      } else {
        volume -= decrement;
        audio.volume = Math.max(volume, 0);
      }
    }, 50);
  }

  showNextLine();
}

function simulateLoading() {
  let progress = 0;
  const stages = [
    'Initializing...',
    'Connecting to THUNDERBIRD Network...',
    'Fetching Messages...',
    'Boot Complete!'
  ];
  let stageIndex = 0;

  const interval = setInterval(() => {
    if (progress >= 100) {
      progressBar.textContent = '[▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲] 100%';
      clearInterval(interval);
      status.textContent = 'Boot Complete!';
      setTimeout(() => {
        // Explicitly pause clicksSound and remove its loop event listener before fade-out
        clicksSound.pause();
        clicksSound.removeEventListener('ended', loopClicksSound);
        console.log('Clicks sound paused and loop event listener removed before fade-out');
        fadeOut(fanSound1, 1000);
        fadeOut(fanSound2, 1000);
        fadeOut(clicksSound, 1000);
      }, 1000); // 1000ms before the 2000ms delay ends
      setTimeout(() => {
        bootScreen.style.display = 'none';
        bootDialog.style.display = 'none';
        desktopContainer.style.display = 'block';
        startupSound.play();
        systemChirp.volume = 0.2;
        systemChirp.play();
      }, 2000);
    } else {
      progress += 2;
      const triangles = Math.floor(progress / 5);
      const spaces = 20 - triangles;
      progressBar.textContent = '[' + '▲'.repeat(triangles) + ' '.repeat(spaces) + '] ' + Math.round(progress) + '%';
      if (progress % 25 === 0 && stageIndex < stages.length - 1) {
        stageIndex++;
        status.textContent = stages[stageIndex];
      }
      if (clicksSound.canPlayType('audio/mpeg')) {
        clicksSound.volume = 0.2 + Math.random() * 0.1;
      }
    }
  }, 100);
}

function showNextLine() {
  if (bootIndex < bootLines.length) {
    bootText.innerHTML += bootLines[bootIndex] + '\n';
    bootText.style.opacity = 1;
    bootText.style.display = 'block';
    bootIndex++;
    setTimeout(showNextLine, 2600);
  } else {
    progressSection.style.display = 'block';
    simulateLoading();
  }
}

// Desktop Icon Click Handler
document.querySelectorAll('.desktop-icon').forEach(icon => {
  icon.addEventListener('click', () => {
    const target = icon.getAttribute('data-target');
    if (target === 'bbs-window') {
      modemSequence.style.display = 'block';
      simulateModemConnection();
    }
  });
});

// Modem Connection Simulation
const modemMessages = [
  "Initializing Modem...",
  "Dialing: 555-0134...",
  "CONNECT 2400",
  "Carrier Detected...",
  "Logging in...",
  "Connected to THUNDERBIRD BBS!"
];

function simulateModemConnection(index = 0) {
  if (index < modemMessages.length) {
    modemText.textContent += modemMessages[index] + "\n";
    setTimeout(() => simulateModemConnection(index + 1), 1000);
  } else {
    setTimeout(() => {
      modemSequence.style.display = 'none';
      modemText.textContent = '';
      bbsWindow.style.display = 'block';
      displayWelcomeMessage();
    }, 1000);
  }
}

// BBS Welcome Message
function displayWelcomeMessage() {
  const banner = `
  ╔════════════════════════════════════╗
  ║        THUNDERBIRD BBS v1.0        ║
  ║   Established: April 29, 1989      ║
  ║  SysOp: Grok, AI Assistant         ║
  ║  Online: 24/7 at 2400 baud         ║
  ╚════════════════════════════════════╝
  `;
  const welcomeBox = `
  Welcome to THUNDERBIRD BBS!
  Type /HELP for a list of commands.
  `;
  messageDisplay.innerHTML = `
    <div class="banner-container">${banner}</div>
    <div class="welcome-box">
      <div class="welcome-box-inner">${welcomeBox}</div>
    </div>
  `;
  messageDisplay.scrollTop = messageDisplay.scrollHeight;
}

// Command Processing
function processCommand(command) {
  const output = document.createElement('div');
  output.textContent = `> ${command}`;
  messageDisplay.appendChild(output);

  const normalizedCommand = command.toLowerCase().trim();
  switch (normalizedCommand) {
    case '/help':
      const helpText = `
      Available Commands:
      /HELP   - Display this help message
      /WHO    - List online users
      /MSG    - Post a message
      /EXIT   - Exit the BBS
      `;
      const helpOutput = document.createElement('div');
      helpOutput.textContent = helpText;
      messageDisplay.appendChild(helpOutput);
      break;
    case '/who':
      const users = "Online Users: SysOp (Grok), Guest";
      const usersOutput = document.createElement('div');
      usersOutput.textContent = users;
      messageDisplay.appendChild(usersOutput);
      break;
    case '/msg':
      const msgPrompt = "Enter your message (type /END to finish):";
      const msgOutput = document.createElement('div');
      msgOutput.textContent = msgPrompt;
      messageDisplay.appendChild(msgOutput);
      break;
    case '/exit':
      bbsWindow.style.display = 'none';
      break;
    case '/end':
      const lastMessage = "Message posted!";
      const endOutput = document.createElement('div');
      endOutput.textContent = lastMessage;
      messageDisplay.appendChild(endOutput);
      break;
    default:
      const error = `Unknown command: ${command}. Type /HELP for a list of commands.`;
      const errorOutput = document.createElement('div');
      errorOutput.textContent = error;
      messageDisplay.appendChild(errorOutput);
  }
  messageDisplay.scrollTop = messageDisplay.scrollHeight;
}

// BBS Command Input Handler
document.querySelector('.btn-default').addEventListener('click', () => {
  const command = bbsCommand.value;
  if (command) {
    processCommand(command);
    bbsCommand.value = '';
  }
});

bbsCommand.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const command = bbsCommand.value;
    if (command) {
      processCommand(command);
      bbsCommand.value = '';
    }
  }
});

// Draggable Windows
function makeDraggable(element) {
  const draggie = new Draggabilly(element, {
    handle: '.title-bar',
    containment: 'body'
  });
  element.classList.add('draggable');
}

makeDraggable(bbsWindow);
makeDraggable(modemSequence);

// Menu Functionality
function initMenus() {
  const menuItems = document.querySelectorAll('[role="menu-item"][aria-haspopup="true"]');
  menuItems.forEach(item => {
    const menu = item.querySelector('[role="menu"]');
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('[role="menu"]').forEach(menu => {
      menu.style.display = 'none';
    });
  });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  initBootScreen();
  initMenus();
});
