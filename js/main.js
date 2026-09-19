/**
 * main.js - Generator Rex Nanite & Mechanical Gear Cyber Engine
 * Tokyo Night Colors (#1a1b26, #16161e, #7dcfff, #ff9e64, #7aa2f7, #bb9af7)
 * Features:
 *  - Show-accurate Generator Rex Nanites (3 articulated micro-claws, spinning micro-cogs, pulsing core)
 *  - Background Interlocking Mechanical Gear Systems (meshed spur gears with calculated gear ratios)
 *  - Rex Nanite Assembly & Magnetic Swarming
 *  - Mechanical Typewriter & Cyber Terminal
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Generator Rex Nanite & Mechanical Gear Canvas
  initNaniteAndGearCanvas();

  // 2. Initialize Mechanical Typewriter Effect
  initMechanicalTypewriter();

  // 3. Highlight Active Dock Item
  initDockNavigation();

  // 4. Initialize Interactive Cyber Terminal
  initCyberTerminal();
});

/* ==========================================================================
   1. Generator Rex Nanites & Mechanical Gears Canvas
   ========================================================================== */
function initNaniteAndGearCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 180, active: false };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
    mouse.active = false;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    setupGearSystems();
  });

  /* ------------------------------------------------------------------------
     A. Mechanical Gear Engine (Accurate Involute Spur Gears with Spokes)
     ------------------------------------------------------------------------ */
  function drawMechanicalGear(ctx, cx, cy, rOuter, rInner, teeth, angle, color, spokeRadius = 0, numSpokes = 4) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.2;

    const step = (Math.PI * 2) / teeth;
    ctx.beginPath();

    for (let i = 0; i < teeth; i++) {
      const a = i * step;
      const a1 = a + step * 0.15;
      const a2 = a + step * 0.35;
      const a3 = a + step * 0.65;
      const a4 = a + step * 0.85;

      // Tooth root
      const x0 = Math.cos(a) * rInner;
      const y0 = Math.sin(a) * rInner;
      if (i === 0) ctx.moveTo(x0, y0);
      else ctx.lineTo(x0, y0);

      // Incline to tip
      ctx.lineTo(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter);
      // Tooth crest
      ctx.lineTo(Math.cos(a2) * rOuter, Math.sin(a2) * rOuter);
      // Decline to root
      ctx.lineTo(Math.cos(a3) * rInner, Math.sin(a3) * rInner);
      // Root valley
      ctx.lineTo(Math.cos(a4) * rInner, Math.sin(a4) * rInner);
    }
    ctx.closePath();
    ctx.stroke();

    // Outer gear rim inner circle
    const rimInner = rInner * 0.78;
    ctx.beginPath();
    ctx.arc(0, 0, rimInner, 0, Math.PI * 2);
    ctx.stroke();

    // Central axle hub and keyway
    const hubR = rInner * 0.28;
    ctx.beginPath();
    ctx.arc(0, 0, hubR, 0, Math.PI * 2);
    ctx.stroke();

    // Axle center hole
    ctx.beginPath();
    ctx.arc(0, 0, hubR * 0.45, 0, Math.PI * 2);
    ctx.fill();

    // Spoke cutouts (Mechanical gear lightening windows)
    if (numSpokes > 0 && spokeRadius > 0) {
      const spokeDist = (rimInner + hubR) / 2;
      for (let s = 0; s < numSpokes; s++) {
        const sAngle = (s * Math.PI * 2) / numSpokes;
        const sx = Math.cos(sAngle) * spokeDist;
        const sy = Math.sin(sAngle) * spokeDist;
        ctx.beginPath();
        ctx.arc(sx, sy, spokeRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // Interlocking Gear Clusters (Subtle background blueprint mechanical assemblies)
  let gearClusters = [];

  function setupGearSystems() {
    gearClusters = [];

    // Cluster 1: Top Right Rex Mechanical Assembly (3 meshed gears)
    const g1Teeth = 20;
    const g1Outer = 95;
    const g1Inner = 80;

    const g2Teeth = 12;
    const g2Outer = 58;
    const g2Inner = 48;

    const g3Teeth = 8;
    const g3Outer = 40;
    const g3Inner = 32;

    const c1X = width - 120;
    const c1Y = 130;

    // Meshed center-to-center distance = rInner1 + rInner2 + toothDepth
    const dist12 = (g1Outer + g1Inner)/2 + (g2Outer + g2Inner)/2 - 8;
    const angle12 = Math.PI * 0.82;
    const c2X = c1X + Math.cos(angle12) * dist12;
    const c2Y = c1Y + Math.sin(angle12) * dist12;

    const dist23 = (g2Outer + g2Inner)/2 + (g3Outer + g3Inner)/2 - 6;
    const angle23 = angle12 + Math.PI * 0.55;
    const c3X = c2X + Math.cos(angle23) * dist23;
    const c3Y = c2Y + Math.sin(angle23) * dist23;

    gearClusters.push([
      { x: c1X, y: c1Y, rO: g1Outer, rI: g1Inner, teeth: g1Teeth, speed: 0.003, color: 'rgba(122, 162, 247, 0.07)', spokeR: 12, spokes: 5 },
      { x: c2X, y: c2Y, rO: g2Outer, rI: g2Inner, teeth: g2Teeth, speed: -0.003 * (g1Teeth / g2Teeth), color: 'rgba(255, 158, 100, 0.08)', spokeR: 8, spokes: 4 },
      { x: c3X, y: c3Y, rO: g3Outer, rI: g3Inner, teeth: g3Teeth, speed: 0.003 * (g1Teeth / g3Teeth), color: 'rgba(125, 207, 255, 0.08)', spokeR: 5, spokes: 3 }
    ]);

    // Cluster 2: Bottom Left Heavy Machinery Gear System (2 heavy meshed gears)
    const b1Teeth = 24;
    const b1Outer = 130;
    const b1Inner = 110;

    const b2Teeth = 14;
    const b2Outer = 75;
    const b2Inner = 62;

    const b1X = 140;
    const b1Y = height - 100;
    const distB = (b1Outer + b1Inner)/2 + (b2Outer + b2Inner)/2 - 10;
    const angleB = -Math.PI * 0.28;
    const b2X = b1X + Math.cos(angleB) * distB;
    const b2Y = b1Y + Math.sin(angleB) * distB;

    gearClusters.push([
      { x: b1X, y: b1Y, rO: b1Outer, rI: b1Inner, teeth: b1Teeth, speed: -0.002, color: 'rgba(122, 162, 247, 0.06)', spokeR: 18, spokes: 6 },
      { x: b2X, y: b2Y, rO: b2Outer, rI: b2Inner, teeth: b2Teeth, speed: 0.002 * (b1Teeth / b2Teeth), color: 'rgba(255, 158, 100, 0.07)', spokeR: 10, spokes: 4 }
    ]);
  }

  setupGearSystems();

  /* ------------------------------------------------------------------------
     B. Show-Accurate Generator Rex Nanites Class
     ------------------------------------------------------------------------ */
  class RexNanite {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.85;
      this.vy = (Math.random() - 0.5) * 0.85;
      this.angle = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.035;
      this.coreRadius = Math.random() * 2 + 2.5;

      // Tokyo Night Nanite Archetypes:
      // Overdrive Orange (Rex active build) vs Tokyo Cyan (Providence Standard)
      this.isOverdrive = Math.random() > 0.6;
      this.coreColor = this.isOverdrive ? '#ff9e64' : '#7dcfff';
      this.glowColor = this.isOverdrive ? 'rgba(255, 158, 100, ' : 'rgba(125, 207, 255, ';
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.microGearAngle = Math.random() * Math.PI * 2;
      this.microGearSpeed = (Math.random() > 0.5 ? 1 : -1) * 0.08;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.rotSpeed;
      this.pulsePhase += 0.06;
      this.microGearAngle += this.microGearSpeed;

      // Screen boundaries wrap / bounce
      if (this.x < 0) { this.x = 0; this.vx *= -1; }
      if (this.x > width) { this.x = width; this.vx *= -1; }
      if (this.y < 0) { this.y = 0; this.vy *= -1; }
      if (this.y > height) { this.y = height; this.vy *= -1; }

      // Generator Rex Nanite Assembly Magnetism (Attracted & clustering at cursor)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          this.vx += Math.cos(angle) * force * 0.35;
          this.vy += Math.sin(angle) * force * 0.35;

          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (speed > 3.2) {
            this.vx = (this.vx / speed) * 3.2;
            this.vy = (this.vy / speed) * 3.2;
          }
        }
      }

      this.vx *= 0.985;
      this.vy *= 0.985;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      const pulse = Math.sin(this.pulsePhase) * 0.25 + 0.9;

      // 1. Draw 3 Articulated Biomechanical Micro-Claws (Generator Rex intro style)
      ctx.lineWidth = 1;
      const claws = 3;
      for (let c = 0; c < claws; c++) {
        const cAngle = (c * Math.PI * 2) / claws;
        ctx.save();
        ctx.rotate(cAngle);

        // Arm segment 1: Upper mechanical strut
        const seg1Len = this.coreRadius * 2.2;
        const elbowX = seg1Len * 0.85;
        const elbowY = seg1Len * 0.45;

        ctx.strokeStyle = this.isOverdrive ? 'rgba(255, 158, 100, 0.7)' : 'rgba(125, 207, 255, 0.65)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(elbowX, elbowY);
        ctx.stroke();

        // Elbow joint dot
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(elbowX, elbowY, 0.9, 0, Math.PI * 2);
        ctx.fill();

        // Arm segment 2: Forearm claw pincer angled inward
        const tipX = elbowX + seg1Len * 0.75;
        const tipY = elbowY - seg1Len * 0.2;
        ctx.beginPath();
        ctx.moveTo(elbowX, elbowY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Micro-claw pincer point
        ctx.fillStyle = this.coreColor;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 1.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 2. Microscopic Rotating Nanite Cogwheel/Gear inside the hub
      ctx.save();
      ctx.rotate(this.microGearAngle);
      const mTeeth = 6;
      const mR_out = this.coreRadius * 1.5;
      const mR_in = this.coreRadius * 1.15;
      ctx.strokeStyle = this.isOverdrive ? 'rgba(255, 158, 100, 0.8)' : 'rgba(122, 162, 247, 0.75)';
      ctx.beginPath();
      for (let t = 0; t < mTeeth; t++) {
        const ta = (t * Math.PI * 2) / mTeeth;
        ctx.lineTo(Math.cos(ta) * mR_in, Math.sin(ta) * mR_in);
        ctx.lineTo(Math.cos(ta + 0.25) * mR_out, Math.sin(ta + 0.25) * mR_out);
        ctx.lineTo(Math.cos(ta + 0.5) * mR_out, Math.sin(ta + 0.5) * mR_out);
        ctx.lineTo(Math.cos(ta + 0.75) * mR_in, Math.sin(ta + 0.75) * mR_in);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // 3. Glowing Spherical Nanite Reactor Core (Tokyo Night glowing core)
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.coreRadius * 2 * pulse);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, this.coreColor);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, this.coreRadius * 2 * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Populate Nanite Swarm
  const nanites = [];
  const naniteCount = Math.min(65, Math.floor(width / 22));
  for (let i = 0; i < naniteCount; i++) {
    nanites.push(new RexNanite());
  }

  // Rotation angles for gear clusters
  let gearAngleTime = 0;
  const maxCircuitDist = 140;

  /* ------------------------------------------------------------------------
     C. Main Render Loop
     ------------------------------------------------------------------------ */
  function animate() {
    ctx.clearRect(0, 0, width, height);
    gearAngleTime += 0.015;

    // 1. Draw Background Mechanical Gear Assemblies
    for (let c = 0; c < gearClusters.length; c++) {
      const cluster = gearClusters[c];
      for (let g = 0; g < cluster.length; g++) {
        const gear = cluster[g];
        const currentAngle = gearAngleTime * gear.speed * 40;
        drawMechanicalGear(
          ctx,
          gear.x,
          gear.y,
          gear.rO,
          gear.rI,
          gear.teeth,
          currentAngle,
          gear.color,
          gear.spokeR,
          gear.spokes
        );
      }
    }

    // 2. Draw Nanite-to-Nanite Circuit Arcs & Nanite Bodies
    for (let i = 0; i < nanites.length; i++) {
      nanites[i].update();
      nanites[i].draw();

      for (let j = i + 1; j < nanites.length; j++) {
        const dx = nanites[i].x - nanites[j].x;
        const dy = nanites[i].y - nanites[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxCircuitDist) {
          const alpha = (1 - dist / maxCircuitDist) * 0.32;
          ctx.beginPath();
          ctx.moveTo(nanites[i].x, nanites[i].y);
          ctx.lineTo(nanites[j].x, nanites[j].y);

          if (nanites[i].isOverdrive || nanites[j].isOverdrive) {
            ctx.strokeStyle = `rgba(255, 158, 100, ${alpha * 1.3})`;
          } else {
            ctx.strokeStyle = `rgba(125, 207, 255, ${alpha})`;
          }
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // 3. Connect Nanites to Cursor (Rex Nanite Summoning Field)
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = mouse.x - nanites[i].x;
        const mdy = mouse.y - nanites[i].y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.radius) {
          const mAlpha = (1 - mdist / mouse.radius) * 0.55;
          ctx.beginPath();
          ctx.moveTo(nanites[i].x, nanites[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 158, 100, ${mAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Mechanical / Nanite Typewriter Effect
   ========================================================================== */
function initMechanicalTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    'NANITES: ONLINE // ISET Mahdia (RSI 2.1)',
    'MECHANICAL CONSTRUCT: Red Team Operator',
    'EXPLOIT RESEARCH // Cloud Penetration Testing',
    'REVERSE ENGINEERING // System Internals & Low-Level'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 60;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 65;
    }

    if (!isDeleting && charIndex === current.length) {
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. Floating Glass Dock Navigation
   ========================================================================== */
function initDockNavigation() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  const dockItems = document.querySelectorAll('.dock-item');

  dockItems.forEach(item => {
    const href = item.getAttribute('href');
    if (!href) return;
    const targetName = href.substring(href.lastIndexOf('/') + 1) || 'index.html';

    if (pageName === targetName || (pageName === '' && targetName === 'index.html')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

/* ==========================================================================
   4. Interactive Cyber Terminal (Rex / Providence Inspired)
   ========================================================================== */
function initCyberTerminal() {
  const modal = document.getElementById('terminal-modal');
  const openBtns = document.querySelectorAll('.terminal-trigger');
  const closeBtn = document.getElementById('terminal-close-btn');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  if (!modal || !terminalInput || !terminalOutput) return;

  const openTerminal = () => {
    modal.classList.add('open');
    setTimeout(() => terminalInput.focus(), 150);
  };

  const closeTerminal = () => {
    modal.classList.remove('open');
  };

  openBtns.forEach(btn => btn.addEventListener('click', openTerminal));
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTerminal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeTerminal();
    }
  });

  const commands = {
    help: () => `
<span style="color:#7dcfff">[NANITE_SYSTEM // COMMANDS]</span>
  <span style="color:#ff9e64">whoami</span>       - Display Akiless bio & red team status
  <span style="color:#ff9e64">nanites</span>      - Nanite swarm diagnostics
  <span style="color:#ff9e64">gears</span>        - Mechanical gear train telemetry
  <span style="color:#ff9e64">builds</span>       - Generator Rex mechanical construct roster
  <span style="color:#ff9e64">skills</span>       - Offensive security & engineering skills
  <span style="color:#ff9e64">projects</span>     - Mechanical builds & GitHub tooling
  <span style="color:#ff9e64">certs</span>        - Credential milestones & progress
  <span style="color:#ff9e64">blogs</span>        - Medium publications & security writeups
  <span style="color:#ff9e64">contact</span>      - GitHub / HTB / LinkedIn communication relays
  <span style="color:#ff9e64">clear</span>        - Clear terminal HUD
  <span style="color:#ff9e64">exit</span>         - Disengage terminal interface
`,
    whoami: () => `
<span style="color:#ff9e64">Akiless (@wajdi-cpu) // OPERATOR</span>
------------------------------------------------------
* Cybersecurity Student: ISET Mahdia (RSI 2.1)
* Field: Offensive Security, Adversary Emulation & Red Teaming
* Active Role: Summer Internship on an Enterprise Red Team
* Core Specialization: Cloud Penetration Testing & Binary Reverse Engineering
`,
    nanites: () => `
<span style="color:#7dcfff">[NANITE SWARM TELEMETRY]</span>
* Nanite Density:      100% [Nominal]
* Micro-Rotor RPM:     14,200 RPM
* Core Reaction:       Overdrive Orange (#ff9e64) & Tokyo Cyan (#7dcfff)
* Directive:           Autonomous Vulnerability Enumeration & Exploitation
`,
    gears: () => `
<span style="color:#7dcfff">[MECHANICAL GEAR TRAIN]</span>
* Gear Cluster A:      20T / 12T / 8T Meshed Ratio [1:2.5]
* Gear Cluster B:      24T / 14T Heavy Piston Drive [1:1.7]
* Involute Profile:    Active & Synchronized
* Construct Drive:     Hydraulic & Nanite Coupled
`,
    builds: () => `
<span style="color:#ff9e64">[GENERATOR REX MECHANICAL CONSTRUCTS]</span>
* Smack Hands:         Heavy mechanical fists for brute-forcing defenses
* Slam Cannon:         High-velocity rock launcher with side gear flywheels
* Boogie Pack:         Twin jet turbine wings for rapid reconnaissance
* BFS (Big Fat Sword): High-frequency tactical cutting blade
* Punk Busters:        Piston-powered jump boots for perimeter breach
`,
    skills: () => `
<span style="color:#7dcfff">[OFFENSIVE SECURITY COMPETENCIES]</span>
* Red Teaming, Kerberoasting, Active Directory
* Cloud Infrastructure Auditing (AWS / Azure)
* Low-Level Debugging & x86/ARM Reverse Engineering (Ghidra, GDB)
* Embedded Systems & Linux OS Internals
* Languages: Go, Python, C, Bash
`,
    projects: () => `
<span style="color:#7dcfff">[PROJECT REPOSITORIES]</span>
Inspect GitHub projects in the <a href="projects.html" style="color:#ff9e64; text-decoration:underline;">~/projects</a> tab.
`,
    certs: () => `
<span style="color:#7dcfff">[CERTIFICATIONS]</span>
Track earned credentials and in-progress tracks in the <a href="certifications.html" style="color:#ff9e64; text-decoration:underline;">~/certifications</a> tab.
`,
    blogs: () => `
<span style="color:#7dcfff">[MEDIUM WRITEUPS]</span>
Read technical publications in the <a href="blogs.html" style="color:#ff9e64; text-decoration:underline;">~/blogs</a> tab.
`,
    contact: () => `
<span style="color:#7dcfff">[COMMUNICATION CHANNELS]</span>
* GitHub:   <a href="https://github.com/wajdi-cpu" target="_blank" style="color:#ff9e64;">https://github.com/wajdi-cpu</a>
* HTB:      <a href="https://app.hackthebox.com/profile" target="_blank" style="color:#ff9e64;">Hack The Box Profile</a>
* LinkedIn: <a href="https://linkedin.com" target="_blank" style="color:#ff9e64;">LinkedIn Profile</a>
`,
    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    },
    exit: () => {
      closeTerminal();
      return 'Disengaging terminal session...';
    }
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = terminalInput.value.trim();
      const cmd = rawCmd.toLowerCase();
      terminalInput.value = '';

      if (!cmd) return;

      const cmdLine = document.createElement('div');
      cmdLine.className = 'terminal-line';
      cmdLine.innerHTML = `<span style="color:#ff9e64;">akiless@nanite-os:~$</span> <span style="color:#fff;">${rawCmd}</span>`;
      terminalOutput.appendChild(cmdLine);

      const respLine = document.createElement('div');
      respLine.className = 'terminal-line';

      if (commands[cmd]) {
        const out = commands[cmd]();
        if (out) {
          respLine.innerHTML = out;
          terminalOutput.appendChild(respLine);
        }
      } else {
        respLine.innerHTML = `<span style="color:#f7768e;">rex-sh: command not recognized: '${rawCmd}'. Type <span style="color:#7dcfff;">help</span> for available commands.</span>`;
        terminalOutput.appendChild(respLine);
      }

      const body = modal.querySelector('.terminal-body');
      if (body) body.scrollTop = body.scrollHeight;
    }
  });
}

// Global Image Fallback Handler
window.handleImageError = function(img) {
  if (img.dataset.hasFailed) return;
  img.dataset.hasFailed = 'true';
  img.src = './assets/placeholder.png';
};
