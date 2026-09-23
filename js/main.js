/**
 * main.js - Generator Rex Nanite & Mechanical Gear Cyber Engine
 * Tokyo Night Palette (#1a1b26, #16161e, #1f2335, #7dcfff, #ff9e64, #7aa2f7, #bb9af7)
 * Features:
 *  - Show-accurate Generator Rex Nanites (Hexagonal carapace, 4 articulated hydraulic limbs, spinning micro-cog, glowing plasma core, energy lattice arcs)
 *  - Show-accurate Interlocking Mechanical Gear Assemblies (Slam Cannon & Smack Hand style spur gears with involute teeth, spoke windows, keyways, meshing gear trains)
 *  - Organized Cyber Terminal with categorized commands, quick action toolbar, and command history
 *  - Clean Typewriter & Glass Dock Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initNaniteAndGearCanvas();
  initMechanicalTypewriter();
  initDockNavigation();
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

  let mouse = { x: null, y: null, radius: 200, active: false };

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
     A. Mechanical Gear Engine (Generator Rex Slam Cannon & Smack Hand Style)
     ------------------------------------------------------------------------ */
  function drawMechanicalGear(ctx, cx, cy, rOuter, rInner, teeth, angle, color, spokeRadius = 0, numSpokes = 5) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.3;

    const step = (Math.PI * 2) / teeth;
    ctx.beginPath();

    // Involute tooth geometry with chamfered tips
    for (let i = 0; i < teeth; i++) {
      const a = i * step;
      const a1 = a + step * 0.18;
      const a2 = a + step * 0.38;
      const a3 = a + step * 0.62;
      const a4 = a + step * 0.82;

      // Tooth root
      const x0 = Math.cos(a) * rInner;
      const y0 = Math.sin(a) * rInner;
      if (i === 0) ctx.moveTo(x0, y0);
      else ctx.lineTo(x0, y0);

      // Flank rise to outer tip
      ctx.lineTo(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter);
      // Tooth crest / crown
      ctx.lineTo(Math.cos(a2) * rOuter, Math.sin(a2) * rOuter);
      // Flank descent to root
      ctx.lineTo(Math.cos(a3) * rInner, Math.sin(a3) * rInner);
      // Root valley
      ctx.lineTo(Math.cos(a4) * rInner, Math.sin(a4) * rInner);
    }
    ctx.closePath();
    ctx.stroke();

    // Outer gear rim inner circle
    const rimInner = rInner * 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, rimInner, 0, Math.PI * 2);
    ctx.stroke();

    // Concentric pitch circle guideline (blueprint dashed line)
    const pitchR = (rOuter + rInner) / 2;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = color.replace(/[\d\.]+\)$/, '0.04)');
    ctx.beginPath();
    ctx.arc(0, 0, pitchR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Central axle hub
    const hubR = rInner * 0.32;
    ctx.beginPath();
    ctx.arc(0, 0, hubR, 0, Math.PI * 2);
    ctx.stroke();

    // Axle center hole with rectangular drive keyway notch
    const holeR = hubR * 0.45;
    ctx.beginPath();
    ctx.arc(0, 0, holeR, 0, Math.PI * 2);
    // Keyway slot
    ctx.rect(-holeR * 0.35, -holeR * 1.35, holeR * 0.7, holeR * 0.7);
    ctx.stroke();

    // Lightening hole spoke cutouts (Rex construct blueprint windows)
    if (numSpokes > 0 && spokeRadius > 0) {
      const spokeDist = (rimInner + hubR) / 2;
      for (let s = 0; s < numSpokes; s++) {
        const sAngle = (s * Math.PI * 2) / numSpokes;
        const sx = Math.cos(sAngle) * spokeDist;
        const sy = Math.sin(sAngle) * spokeDist;
        ctx.beginPath();
        ctx.arc(sx, sy, spokeRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Mechanical rivet / bolt near rim
        const boltX = Math.cos(sAngle + step) * (rimInner * 0.94);
        const boltY = Math.sin(sAngle + step) * (rimInner * 0.94);
        ctx.beginPath();
        ctx.arc(boltX, boltY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // Interlocking Gear Clusters (Blueprint Mechanical Assemblies)
  let gearClusters = [];

  function setupGearSystems() {
    gearClusters = [];

    // Cluster 1: Top Right Rex Mechanical Assembly (3 meshed gears)
    const g1Teeth = 20;
    const g1Outer = 100;
    const g1Inner = 84;

    const g2Teeth = 12;
    const g2Outer = 62;
    const g2Inner = 50;

    const g3Teeth = 8;
    const g3Outer = 44;
    const g3Inner = 34;

    const c1X = width - 110;
    const c1Y = 120;

    // Center-to-center pitch distance
    const dist12 = (g1Outer + g1Inner) / 2 + (g2Outer + g2Inner) / 2 - 8;
    const angle12 = Math.PI * 0.8;
    const c2X = c1X + Math.cos(angle12) * dist12;
    const c2Y = c1Y + Math.sin(angle12) * dist12;

    const dist23 = (g2Outer + g2Inner) / 2 + (g3Outer + g3Inner) / 2 - 6;
    const angle23 = angle12 + Math.PI * 0.52;
    const c3X = c2X + Math.cos(angle23) * dist23;
    const c3Y = c2Y + Math.sin(angle23) * dist23;

    gearClusters.push([
      { x: c1X, y: c1Y, rO: g1Outer, rI: g1Inner, teeth: g1Teeth, speed: 0.003, color: 'rgba(122, 162, 247, 0.09)', spokeR: 13, spokes: 5 },
      { x: c2X, y: c2Y, rO: g2Outer, rI: g2Inner, teeth: g2Teeth, speed: -0.003 * (g1Teeth / g2Teeth), color: 'rgba(255, 158, 100, 0.1)', spokeR: 8, spokes: 4 },
      { x: c3X, y: c3Y, rO: g3Outer, rI: g3Inner, teeth: g3Teeth, speed: 0.003 * (g1Teeth / g3Teeth), color: 'rgba(125, 207, 255, 0.09)', spokeR: 5, spokes: 3 }
    ]);

    // Cluster 2: Bottom Left Heavy Machinery Gear System (2 heavy meshed gears)
    const b1Teeth = 24;
    const b1Outer = 135;
    const b1Inner = 114;

    const b2Teeth = 14;
    const b2Outer = 80;
    const b2Inner = 66;

    const b1X = 130;
    const b1Y = height - 100;
    const distB = (b1Outer + b1Inner) / 2 + (b2Outer + b2Inner) / 2 - 10;
    const angleB = -Math.PI * 0.28;
    const b2X = b1X + Math.cos(angleB) * distB;
    const b2Y = b1Y + Math.sin(angleB) * distB;

    gearClusters.push([
      { x: b1X, y: b1Y, rO: b1Outer, rI: b1Inner, teeth: b1Teeth, speed: -0.002, color: 'rgba(122, 162, 247, 0.08)', spokeR: 18, spokes: 6 },
      { x: b2X, y: b2Y, rO: b2Outer, rI: b2Inner, teeth: b2Teeth, speed: 0.002 * (b1Teeth / b2Teeth), color: 'rgba(255, 158, 100, 0.09)', spokeR: 11, spokes: 4 }
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
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.angle = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.coreRadius = Math.random() * 2 + 2.8;

      // Tokyo Night Nanite Archetypes:
      // Overdrive Amber (Rex active construct) vs Tokyo Cyan (Providence Standard)
      this.isOverdrive = Math.random() > 0.65;
      this.coreColor = this.isOverdrive ? '#ff9e64' : '#7dcfff';
      this.limbColor = this.isOverdrive ? 'rgba(255, 158, 100, 0.85)' : 'rgba(125, 207, 255, 0.8)';
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.microGearAngle = Math.random() * Math.PI * 2;
      this.microGearSpeed = (Math.random() > 0.5 ? 1 : -1) * 0.07;
      this.legsCount = 4; // Show-accurate 4 articulated limbs
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.rotSpeed;
      this.pulsePhase += 0.05;
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
          this.vx += Math.cos(angle) * force * 0.4;
          this.vy += Math.sin(angle) * force * 0.4;

          // Turn toward movement direction when swarming
          this.angle = angle + Math.PI / 2;

          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (speed > 3.5) {
            this.vx = (this.vx / speed) * 3.5;
            this.vy = (this.vy / speed) * 3.5;
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

      const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.95;

      // 1. Draw 4 Articulated Biomechanical Hydraulic Limbs (Show-accurate Generator Rex style)
      ctx.lineWidth = 1.1;
      const legFlex = Math.sin(this.pulsePhase * 1.5) * 0.15;

      for (let c = 0; c < this.legsCount; c++) {
        // Position legs at corners: 45°, 135°, 225°, 315°
        const cAngle = (c * Math.PI * 2) / this.legsCount + (Math.PI / 4);
        ctx.save();
        ctx.rotate(cAngle);

        const seg1Len = this.coreRadius * 2.1;
        const kneeX = seg1Len * (0.8 + legFlex);
        const kneeY = seg1Len * 0.55;

        // Limb Segment 1: Upper mechanical femur strut
        ctx.strokeStyle = this.limbColor;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(kneeX, kneeY);
        ctx.stroke();

        // Knee hinge joint
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 0.95, 0, Math.PI * 2);
        ctx.fill();

        // Limb Segment 2: Articulated lower tibia pincer claw angled forward
        const tipX = kneeX + seg1Len * 0.85;
        const tipY = kneeY - seg1Len * 0.35;
        ctx.beginPath();
        ctx.moveTo(kneeX, kneeY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Micro-claw needle tip
        ctx.fillStyle = this.coreColor;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 2. Armored Hexagonal Outer Pod / Chassis (Rex Nanite hull)
      const hexR = this.coreRadius * 1.6;
      ctx.strokeStyle = this.isOverdrive ? 'rgba(255, 158, 100, 0.65)' : 'rgba(122, 162, 247, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const ha = (h * Math.PI) / 3;
        const hx = Math.cos(ha) * hexR;
        const hy = Math.sin(ha) * hexR;
        if (h === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();

      // 3. Rotating Microscopic Internal Cogwheel (Nano-gear)
      ctx.save();
      ctx.rotate(this.microGearAngle);
      const mTeeth = 6;
      const mR_out = this.coreRadius * 1.35;
      const mR_in = this.coreRadius * 1.05;
      ctx.strokeStyle = this.isOverdrive ? 'rgba(255, 158, 100, 0.75)' : 'rgba(125, 207, 255, 0.7)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      for (let t = 0; t < mTeeth; t++) {
        const ta = (t * Math.PI * 2) / mTeeth;
        ctx.lineTo(Math.cos(ta) * mR_in, Math.sin(ta) * mR_in);
        ctx.lineTo(Math.cos(ta + 0.22) * mR_out, Math.sin(ta + 0.22) * mR_out);
        ctx.lineTo(Math.cos(ta + 0.45) * mR_out, Math.sin(ta + 0.45) * mR_out);
        ctx.lineTo(Math.cos(ta + 0.68) * mR_in, Math.sin(ta + 0.68) * mR_in);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // 4. Glowing Plasma Reactor Core
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.coreRadius * 2.2 * pulse);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, this.coreColor);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, this.coreRadius * 2.2 * pulse, 0, Math.PI * 2);
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

  let gearAngleTime = 0;
  const maxCircuitDist = 145;

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

    // 2. Draw Nanite-to-Nanite Circuit Arcs & Nanites
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

          // Occasional energy flow pulse packet traveling between nanites
          if (Math.sin(gearAngleTime * 3 + i) > 0.8) {
            const t = (Math.sin(gearAngleTime * 5 + j) + 1) / 2;
            const px = nanites[i].x + (nanites[j].x - nanites[i].x) * t;
            const py = nanites[i].y + (nanites[j].y - nanites[i].y) * t;
            ctx.fillStyle = nanites[i].isOverdrive ? '#ff9e64' : '#7dcfff';
            ctx.beginPath();
            ctx.arc(px, py, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
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
   4. Interactive Cyber Terminal (Rex / Providence Inspired) - Organized
   ========================================================================== */
function initCyberTerminal() {
  const modal = document.getElementById('terminal-modal');
  const openBtns = document.querySelectorAll('.terminal-trigger');
  const closeBtn = document.getElementById('terminal-close-btn');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  if (!modal || !terminalInput || !terminalOutput) return;

  // Command History Buffer
  const commandHistory = [];
  let historyIndex = -1;

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
<div style="margin-bottom:0.4rem; color:#7dcfff; font-weight:700;">// GENERATOR REX CYBER TERMINAL &mdash; COMMAND DIRECTORY</div>
<table style="width:100%; border-collapse:collapse; font-size:0.83rem;">
  <tr style="border-bottom:1px solid rgba(125,207,255,0.2);"><td colspan="2" style="color:#bb9af7; padding:4px 0; font-weight:600;">[1] IDENTITY &amp; BIO</td></tr>
  <tr><td style="color:#ff9e64; width:110px; padding:3px 0;">whoami</td><td style="color:#c0caf5;">Akiless operator bio, specialization &amp; academic path</td></tr>
  <tr><td style="color:#ff9e64; padding:3px 0;">skills</td><td style="color:#c0caf5;">Offensive security toolset &amp; technical proficiencies</td></tr>
  <tr><td style="color:#ff9e64; padding:3px 0;">contact</td><td style="color:#c0caf5;">Relay channels (GitHub, LinkedIn, HTB)</td></tr>

  <tr style="border-bottom:1px solid rgba(125,207,255,0.2);"><td colspan="2" style="color:#bb9af7; padding:8px 0 4px; font-weight:600;">[2] NANITE &amp; GEAR TELEMETRY</td></tr>
  <tr><td style="color:#ff9e64; padding:3px 0;">nanites</td><td style="color:#c0caf5;">Biomechanical swarm diagnostics &amp; core reaction state</td></tr>
  <tr><td style="color:#ff9e64; padding:3px 0;">gears</td><td style="color:#c0caf5;">Mechanical spur gear ratios &amp; drive train telemetry</td></tr>
  <tr><td style="color:#ff9e64; padding:3px 0;">builds</td><td style="color:#c0caf5;">Generator Rex construct roster (Slam Cannon, Smack Hands)</td></tr>

  <tr style="border-bottom:1px solid rgba(125,207,255,0.2);"><td colspan="2" style="color:#bb9af7; padding:8px 0 4px; font-weight:600;">[3] ARCHIVES &amp; INDEX</td></tr>
  <tr><td style="color:#ff9e64; padding:3px 0;">projects</td><td style="color:#c0caf5;">Repository index &amp; security tooling builds</td></tr>
  <tr><td style="color:#ff9e64; padding:3px 0;">certs</td><td style="color:#c0caf5;">Earned credentials &amp; in-progress study paths</td></tr>
  <tr><td style="color:#ff9e64; padding:3px 0;">blogs</td><td style="color:#c0caf5;">Medium publications &amp; technical writeups</td></tr>

  <tr style="border-bottom:1px solid rgba(125,207,255,0.2);"><td colspan="2" style="color:#bb9af7; padding:8px 0 4px; font-weight:600;">[4] SYSTEM CONTROLS</td></tr>
  <tr><td style="color:#ff9e64; padding:3px 0;">clear</td><td style="color:#c0caf5;">Reset viewport buffer</td></tr>
  <tr><td style="color:#ff9e64; padding:3px 0;">exit</td><td style="color:#c0caf5;">Disengage terminal session</td></tr>
</table>
`,
    whoami: () => `
<div style="color:#ff9e64; font-weight:700;">// OPERATOR IDENTIFIER: Akiless (@wajdi-cpu)</div>
<div style="color:#565f89;">----------------------------------------------------------------</div>
<div><span style="color:#7dcfff;">Academic:</span>   ISET Mahdia (RSI 2.1) &mdash; Network Systems &amp; Cybersecurity</div>
<div><span style="color:#7dcfff;">Focus:</span>      Offensive Security, Cloud Pentesting, Adversary Emulation</div>
<div><span style="color:#7dcfff;">Internship:</span> Red Team Intern (Enterprise Adversary Simulation)</div>
<div><span style="color:#7dcfff;">Research:</span>   Low-Level Reverse Engineering &amp; Binary Exploitation</div>
`,
    nanites: () => `
<div style="color:#7dcfff; font-weight:700;">// NANITE SWARM TELEMETRY &mdash; PROVIDENCE SUITE</div>
<div>* Nanite Density:      100% [Nominal Swarm Active]</div>
<div>* Micro-Rotor RPM:     14,200 RPM Synchronous</div>
<div>* Carapace Architecture: Hexagonal Biomechanical Hull (4 Articulated Limbs)</div>
<div>* Core Reaction:       Overdrive Amber (#ff9e64) &amp; Tokyo Cyan (#7dcfff)</div>
<div>* Directive:           Autonomous Vulnerability Enumeration &amp; Exploitation</div>
`,
    gears: () => `
<div style="color:#7dcfff; font-weight:700;">// MECHANICAL GEAR TRAIN TELEMETRY</div>
<div>* Cluster A (Top-Right): 20T / 12T / 8T Involute Spur Train [Ratio 1:2.5]</div>
<div>* Cluster B (Bottom-Left): 24T / 14T Heavy Piston Drive [Ratio 1:1.7]</div>
<div>* Profile Standard:    Full-depth involute teeth with lightening spoke windows</div>
<div>* Coupling:            Hydraulic &amp; Nanite Coupled Drive</div>
`,
    builds: () => `
<div style="color:#ff9e64; font-weight:700;">// GENERATOR REX MECHANICAL CONSTRUCT ROSTER</div>
<div>* <span style="color:#7dcfff;">Smack Hands:</span>  Heavy pneumatic fists for brute-forcing perimeter defenses</div>
<div>* <span style="color:#7dcfff;">Slam Cannon:</span>  High-velocity kinetic launcher with lateral gear flywheels</div>
<div>* <span style="color:#7dcfff;">Boogie Pack:</span>  Twin jet turbine wings for reconnaissance &amp; rapid pivoting</div>
<div>* <span style="color:#7dcfff;">BFS Blade:</span>    High-frequency tactical cutting blade for binary segmentation</div>
<div>* <span style="color:#7dcfff;">Punk Busters:</span> Piston-powered jump boots for deep network penetration</div>
`,
    skills: () => `
<div style="color:#7dcfff; font-weight:700;">// OFFENSIVE SECURITY COMPETENCIES</div>
<div>* Active Directory Attacks (Kerberoasting, DCSync, BloodHound)</div>
<div>* Cloud Infrastructure Auditing &amp; IAM Assessment (AWS / Azure)</div>
<div>* Binary Reverse Engineering (Ghidra, GDB, x86_64, ARM)</div>
<div>* Network Reconnaissance &amp; Web Vulnerability Research (Burp Suite, Wireshark)</div>
<div>* Automation &amp; Exploit Dev: Python, Go, C, Bash</div>
`,
    projects: () => `
<div style="color:#7dcfff;">// PROJECT ARCHIVES</div>
<div>Direct link to technical tooling: <a href="projects.html" style="color:#ff9e64; text-decoration:underline;">projects.html</a></div>
`,
    certs: () => `
<div style="color:#7dcfff;">// CREDENTIAL VERIFICATION</div>
<div>Direct link to certification tracks: <a href="certifications.html" style="color:#ff9e64; text-decoration:underline;">certifications.html</a></div>
`,
    blogs: () => `
<div style="color:#7dcfff;">// MEDIUM PUBLICATIONS</div>
<div>Direct link to security writeups: <a href="blogs.html" style="color:#ff9e64; text-decoration:underline;">blogs.html</a></div>
`,
    contact: () => `
<div style="color:#7dcfff; font-weight:700;">// RELAY CHANNELS</div>
<div>* GitHub:   <a href="https://github.com/wajdi-cpu" target="_blank" style="color:#ff9e64;">https://github.com/wajdi-cpu</a></div>
<div>* LinkedIn: <a href="https://linkedin.com" target="_blank" style="color:#ff9e64;">LinkedIn Profile</a></div>
<div>* HTB:      <a href="https://app.hackthebox.com/profile" target="_blank" style="color:#ff9e64;">Hack The Box Profile</a></div>
`,
    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    },
    exit: () => {
      closeTerminal();
      return '<span style="color:#565f89;">Session disengaged.</span>';
    }
  };

  // Execute Command Helper
  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Push to history
    commandHistory.push(rawCmd.trim());
    historyIndex = commandHistory.length;

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
      respLine.innerHTML = `<span style="color:#f7768e;">rex-sh: command '${rawCmd}' not recognized. Type <span style="color:#7dcfff;">help</span> for command directory.</span>`;
      terminalOutput.appendChild(respLine);
    }

    const body = modal.querySelector('.terminal-body');
    if (body) body.scrollTop = body.scrollHeight;
  };

  // Keyboard Event (Enter, Up, Down for history)
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = terminalInput.value;
      terminalInput.value = '';
      executeCommand(rawCmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  // Attach quick action toolbar chips if present
  const quickChips = modal.querySelectorAll('.terminal-chip');
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
        terminalInput.focus();
      }
    });
  });
}

// Global Image Fallback Handler
window.handleImageError = function(img) {
  if (img.dataset.hasFailed) return;
  img.dataset.hasFailed = 'true';
  img.src = './assets/placeholder.png';
};
