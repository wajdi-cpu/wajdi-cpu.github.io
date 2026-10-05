document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('trial-form');
  const input = document.getElementById('trial-input');
  const output = document.getElementById('trial-output');
  const attemptCount = document.getElementById('trial-attempts');
  const emberState = document.getElementById('trial-ember-state');
  const souls = document.getElementById('trial-souls');
  const shellState = document.getElementById('trial-shell-state');
  const completion = document.getElementById('trial-completion');
  const resetButton = document.getElementById('trial-reset');
  if (!form || !input || !output) return;

  const opening = [
    ['The archive stirs as you approach.', 'trial-output-muted'],
    ['One word will wake the fire. The Keeper left a note; the smith left a mark.', ''],
    ['Type help to begin your search.', 'trial-output-accent']
  ];
  let attempts = 0;
  let hintLevel = 0;
  let completed = false;

  function addLine(text, className = '') {
    const line = document.createElement('p');
    if (className) line.className = className;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function clearOutput() {
    output.replaceChildren();
  }

  function updateStatus() {
    attemptCount.textContent = `ATTEMPTS ${attempts}`;
    emberState.textContent = completed ? 'BONFIRE LIT' : 'EMBER UNLIT';
    souls.textContent = completed ? 'SOULS 1,000' : 'SOULS 0';
    shellState.textContent = completed ? 'FLAME RESTORED' : 'AWAITING ASHEN ONE';
    completion.hidden = !completed;
  }

  function appendOpening() {
    opening.forEach(([text, className]) => addLine(text, className));
  }

  function decodeWord(word, shift) {
    const rotation = ((shift % 26) + 26) % 26;
    return word.replace(/[A-Z]/gi, (letter) => {
      const base = letter === letter.toUpperCase() ? 65 : 97;
      return String.fromCharCode(((letter.charCodeAt(0) - base + rotation) % 26) + base);
    });
  }

  function runCommand(rawCommand) {
    const command = rawCommand.trim();
    if (!command) return;
    addLine(`ashen@firelink:~$ ${command}`, 'trial-output-command');

    const [verbRaw, ...args] = command.split(/\s+/);
    const verb = verbRaw.toLowerCase();
    const target = args.join(' ').replace(/^\/+/, '').replace(/^archive\//i, '').toLowerCase();

    if (verb === 'help') {
      addLine('help                         show these commands');
      addLine('look                         survey the archive');
      addLine('ls [path]                    list the records');
      addLine('cat <file>                   read an archive record');
      addLine('decode <WORD> <SHIFT>        rotate letters by a signed number');
      addLine('submit <WORD>                offer your answer to the flame');
      addLine('hint                         reveal the next clue');
      addLine('clear                        clear the terminal');
      return;
    }

    if (verb === 'look') {
      addLine('A sealed bonfire waits beside two records in the Firelink archive. The ash carries a cipher.');
      return;
    }

    if (verb === 'ls') {
      if (!args.length || args[0] === '/archive' || args[0] === 'archive') {
        addLine('keeper.note');
        addLine('smith.mark');
      } else {
        addLine('ls: no such place in the archive');
      }
      return;
    }

    if (verb === 'cat') {
      if (target === 'keeper.note') {
        addLine('KEEPER’S NOTE: The smith pushed each letter three places forward. Walk three places back to read the mark.');
      } else if (target === 'smith.mark') {
        addLine('SMITH’S MARK: ERQILUH');
      } else {
        addLine('cat: record not found. Try ls.');
      }
      return;
    }

    if (verb === 'decode') {
      const word = args[0] || '';
      const shift = Number(args[1]);
      if (!/^[a-z]+$/i.test(word) || !Number.isInteger(shift) || shift < -25 || shift > 25) {
        addLine('Usage: decode <LETTERS> <SHIFT>  (example: decode ABC -1)', 'trial-output-error');
        return;
      }
      addLine(`Decoded mark: ${decodeWord(word, shift)}`, 'trial-output-success');
      return;
    }

    if (verb === 'submit') {
      attempts += 1;
      if ((args[0] || '').toUpperCase() === 'BONFIRE') {
        completed = true;
        addLine('The word is accepted. Warm light spills across the stone.', 'trial-output-success');
        addLine('BONFIRE KINDLED // +1,000 SOULS', 'trial-output-success');
      } else {
        addLine('The flame remains dark. Search the records and try again.', 'trial-output-error');
      }
      updateStatus();
      return;
    }

    if (verb === 'hint') {
      if (hintLevel === 0) addLine('Hint: the keeper’s note tells you what to do with the smith’s mark.');
      else addLine('Hint: the mark is ERQILUH. Decode it with a shift of -3.');
      hintLevel = Math.min(hintLevel + 1, 2);
      return;
    }

    if (verb === 'clear') {
      clearOutput();
      return;
    }

    addLine(`The archive knows no command named “${verb}”. Type help.`, 'trial-output-error');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    runCommand(input.value);
    input.value = '';
    input.focus();
  });

  document.querySelectorAll('[data-trial-command]').forEach((button) => {
    button.addEventListener('click', () => {
      runCommand(button.dataset.trialCommand || '');
      input.focus();
    });
  });

  resetButton?.addEventListener('click', () => {
    attempts = 0;
    hintLevel = 0;
    completed = false;
    clearOutput();
    appendOpening();
    updateStatus();
    input.value = '';
    input.focus();
  });

  updateStatus();
});
