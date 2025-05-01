
// Dragging functionality
document.querySelectorAll('.window-title').forEach(titleBar => {
    let offsetX, offsetY;
    const windowEl = titleBar.parentElement;

    titleBar.onmousedown = function(e) {
        offsetX = windowEl.offsetLeft - e.clientX;
        offsetY = windowEl.offsetTop - e.clientY;

        document.onmousemove = function(e) {
            windowEl.style.left = e.clientX + offsetX + 'px';
            windowEl.style.top = e.clientY + offsetY + 'px';
        };

        document.onmouseup = function() {
            document.onmousemove = null;
        };
    };
});

// Banner Generator
function createBanner() {
    const asciiArt = `
████████╗██╗  ██╗██╗   ██╗███╗   ██╗██████╗ ███████╗██████╗ ██████╗ ██╗██████╗ ██████╗ 
╚══██╔══╝██║  ██║██║   ██║████╗  ██║██╔══██╗██╔════╝██╔══██╗██╔══██╗██║██╔══██╗██╔══██╗
   ██║   ███████║██║   ██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝██████╔╝██║██████╔╝██║  ██║
   ██║   ██╔══██║██║   ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗██╔══██╗██║██╔══██╗██║  ██║
   ██║   ██║  ██║╚██████╔╝██║ ╚████║██████╔╝███████╗██║  ██║██████╔╝██║██║  ██║██████╔╝
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═╝╚═════╝
`.trim();

    return `
        <div class="banner-container">${asciiArt}</div>
        <div class="welcome-box">
          <div class="welcome-box-inner">
            ┌───────────────────────┐<br>
            │   WELCOME TO THE BBS  │<br>
            └───────────────────────┘
          </div>
        </div>
    `;
}

// Modem Connection Sequence
function startModemSequence() {
    const modemText = document.getElementById('modem-text');
    const modemSequence = [
        "ATZ",
        "OK",
        "ATDT555-1234",
        "CONNECT 2400",
        "NEGOTIATING PROTOCOL...",
        "HANDSHAKE COMPLETE",
        "LOGGING INTO SYSTEM...",
        "CONNECTION ESTABLISHED"
    ];

    let step = 0;
    function nextStep() {
        if (step < modemSequence.length) {
            modemText.innerHTML += modemSequence[step] + "<br>";
            step++;
            setTimeout(nextStep, 800);
        } else {
            document.getElementById('modem-sequence').style.display = 'none';
            document.getElementById('bbs-interface').style.display = 'block';
            document.getElementById('message-display').innerHTML = createBanner();
        }
    }
    nextStep();
}

// Command handler
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('bbs-command').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim().toUpperCase();
            const terminal = document.getElementById('message-display');

            if (command === 'HELP') {
                terminal.innerHTML += '\n\nCOMMANDS: HELP, LOGIN, LIST, QUIT';
            } else if (command === 'LOGIN') {
                terminal.innerHTML += '\n\nLOGIN FEATURE COMING SOON';
            } else if (command === 'LIST') {
                terminal.innerHTML += '\n\nMESSAGES: NONE';
            } else if (command === 'QUIT') {
                terminal.innerHTML += '\n\nDISCONNECTING...';
            } else {
                terminal.innerHTML += '\n\nUNKNOWN COMMAND';
            }

            this.value = '';
            terminal.scrollTop = terminal.scrollHeight;
        }
    });

    document.querySelector('.btn.clear').addEventListener('click', function() {
        document.getElementById('message-display').innerHTML = createBanner();
    });

    window.onload = function() {
        setTimeout(startModemSequence, 500);
    };
});
