/**
 * main.js - Generator Rex Nanite & Mechanical Gear Cyber Engine
 * Navy and Gold Palette (#191925, #171722, #242435, #e6bd68, #91b6ee, #f2d58c, #aa8234)
 *
 * Features:
 *  - Show-Accurate Generator Rex Nanites:
 *      * Glowing gold orb core inside a reflective glass capsule
 *      * Six uneven, dark rods around each nanite
 *      * Intermittent red-gold electrical crackles and long falling gold trails
 *      * Show-accurate circuit board traces (45°/90° chamfered bends & circular junction pads)
 *      * High-velocity nanite data/energy packets traversing the lattice
 *      * Crackling bio-electric lightning arcs with branching forks
 *  - Show-Accurate Mechanical Gear Assemblies (Slam Cannon & Punk Busters):
 *      * Involute spur gears with chamfered crests, dedendum roots, and precise meshing pitch velocity
 *      * Multi-spoke lightening windows with bevel flanges
 *      * Keyed central drive axle with hex-bolt ring pattern
 *      * 360-degree calibration dial graduation ticks and technical blueprint labels
 *      * Live reciprocating hydraulic piston & connecting rod mechanism (Punk Busters / Slam Cannon)
 *      * Tooth contact electric sparks at gear meshing pitch points
 *  - Interactive Nanite Overdrive Controller (toggleable from UI and terminal)
 *  - Complete Linux Virtual File System & Interactive Shell Engine:
 *      * Full hierarchical file system (/home/AkilesTheDark, /etc, /var/log, /bin)
 *      * Standard Unix/Linux commands: ls (supports -l, -a, -la), cd, cat, pwd, tree, head, tail, grep, echo, whoami, id, uname, date, history, clear, exit, help
 *      * Generator Rex cyber commands: overdrive, nanites, gears, scan
 *      * Tab auto-completion for commands and file/directory paths
 *      * Dynamic working directory prompt (AkilesTheDark@nanite-os:~$ / ~/blogs$ / /etc$)
 */

// Global State
window.GeneratorRexEngine = {
  isOverdrive: false,
  triggerConstructPulse: null,
  toggleOverdrive: null
};

document.addEventListener('DOMContentLoaded', () => {
  initHomeBootSequence();
  initMechanicalTypewriter();
  initDockNavigation();
  initCursorAfterNavigation();
  initOverdriveToggle();
  initCyberTerminal();
});

function initCursorAfterNavigation() {
  let lastPointerPosition = null;

  document.addEventListener('mousemove', event => {
    lastPointerPosition = { x: event.clientX, y: event.clientY };
  }, { passive: true });

  window.addEventListener('pagehide', () => {
    if (!lastPointerPosition) return;
    try {
      sessionStorage.setItem('ds3-cursor-position', JSON.stringify(lastPointerPosition));
    } catch (_) { /* Cursor styling still works when storage is unavailable. */ }
  });

  window.addEventListener('pageshow', () => {
    let position = lastPointerPosition;
    try {
      position = position || JSON.parse(sessionStorage.getItem('ds3-cursor-position') || 'null');
    } catch (_) { /* Fall back to applying the cursor to the page body. */ }

    const target = position && position.x >= 0 && position.y >= 0
      ? document.elementFromPoint(position.x, position.y)
      : null;
    const cursorTarget = target || document.body;
    cursorTarget.style.setProperty('cursor', 'none', 'important');
    void cursorTarget.offsetWidth;

    requestAnimationFrame(() => {
      cursorTarget.style.setProperty('cursor', 'url("./assets/cursor-normal.png") 0 0, auto', 'important');
    });
  });
}

function initHomeBootSequence() {
  const bootScreen = document.getElementById('boot-screen');
  if (!bootScreen) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bootDuration = prefersReducedMotion ? 600 : 3200;

  // Keep the reveal anchored at the top instead of restoring a stale scroll position.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const fadeStartedAt = performance.now();
  const fadeBootScreen = (now) => {
    const progress = Math.min((now - fadeStartedAt) / bootDuration, 1);
    bootScreen.style.opacity = String(1 - progress);
    if (progress < 1) window.requestAnimationFrame(fadeBootScreen);
  };
  window.requestAnimationFrame(fadeBootScreen);

  window.setTimeout(() => {
    bootScreen.style.opacity = '0';
    bootScreen.classList.add('is-finished');
    document.body.classList.remove('is-booting');
    window.setTimeout(() => {
      bootScreen.remove();
      window.scrollTo(0, 0);
    }, prefersReducedMotion ? 0 : 900);
  }, bootDuration);
}

/* ==========================================================================
   1. Generator Rex Nanites & Mechanical Gear Engine (Canvas)
   ========================================================================== */
function initNaniteAndGearCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 170, active: false };
  let shockwaves = [];
  let sparks = [];
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];
  let galaxyDust = [];

  function resetStars() {
    const count = Math.min(190, Math.max(70, Math.round((width * height) / 11500)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.15 + 0.25,
      phase: Math.random() * Math.PI * 2,
      warmth: Math.random()
    }));
    galaxyDust = Array.from({ length: 150 }, () => ({
      arm: Math.floor(Math.random() * 4),
      progress: Math.random(),
      offset: (Math.random() - 0.5) * 0.42,
      radius: Math.random() * 1.35 + 0.35,
      phase: Math.random() * Math.PI * 2,
      warmth: Math.random()
    }));
  }

  resetStars();

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
    resetStars();
    setupGearAssemblies();
  });

  // Click creates an expanding Nanite Construct Shockwave & Excitation Pulse
  window.addEventListener('click', (e) => {
    if (prefersReducedMotion || e.target.closest('#boot-screen, #terminal-modal, input, button, a')) return;
    triggerPulseAt(e.clientX, e.clientY);
  });

  function triggerPulseAt(x, y, power = 1.0) {
    shockwaves.push({
      x: x,
      y: y,
      radius: 5,
      maxRadius: Math.max(width, height) * 0.28 * power,
      speed: 9 * power,
      alpha: 1.0,
      color: window.GeneratorRexEngine.isOverdrive ? '#91b6ee' : '#e6bd68'
    });

    // Spawn burst of contact sparks
    for (let s = 0; s < 8; s++) {
      const spkAngle = Math.random() * Math.PI * 2;
      const spkSpeed = Math.random() * 6 + 3;
      sparks.push({
        x: x,
        y: y,
        vx: Math.cos(spkAngle) * spkSpeed,
        vy: Math.sin(spkAngle) * spkSpeed,
        life: 1.0,
        decay: Math.random() * 0.04 + 0.02,
        color: Math.random() > 0.4 ? '#91b6ee' : '#e6bd68',
        size: Math.random() * 2 + 1.2
      });
    }
  }

  window.GeneratorRexEngine.triggerConstructPulse = (power = 1.2) => {
    triggerPulseAt(width / 2, height / 2, power);
  };

  /* ------------------------------------------------------------------------
     A. Precision Mechanical Gear Drawing (Involute Spur Teeth & Blueprints)
     ------------------------------------------------------------------------ */
  function drawMechanicalGear(ctx, cx, cy, rOuter, rInner, teeth, angle, color, spokeRadius = 0, numSpokes = 5, label = '', isHeavy = false) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = isHeavy ? 1.6 : 1.2;

    const step = (Math.PI * 2) / teeth;
    ctx.beginPath();

    // 1. Involute tooth geometry with chamfered tips & fillet roots
    for (let i = 0; i < teeth; i++) {
      const a = i * step;
      const a1 = a + step * 0.16;
      const a2 = a + step * 0.36;
      const a3 = a + step * 0.64;
      const a4 = a + step * 0.84;

      const x0 = Math.cos(a) * rInner;
      const y0 = Math.sin(a) * rInner;
      if (i === 0) ctx.moveTo(x0, y0);
      else ctx.lineTo(x0, y0);

      ctx.lineTo(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter);
      ctx.lineTo(Math.cos(a2) * rOuter, Math.sin(a2) * rOuter);
      ctx.lineTo(Math.cos(a3) * rInner, Math.sin(a3) * rInner);
      ctx.lineTo(Math.cos(a4) * rInner, Math.sin(a4) * rInner);
    }
    ctx.closePath();
    ctx.stroke();

    // 2. Outer gear rim inner reinforcement circle
    const rimInner = rInner * 0.82;
    ctx.beginPath();
    ctx.arc(0, 0, rimInner, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Concentric pitch circle guideline (blueprint dashed line)
    const pitchR = (rOuter + rInner) / 2;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = color.replace(/[\d\.]+\)$/, '0.12)');
    ctx.beginPath();
    ctx.arc(0, 0, pitchR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 4. Perimeter degree dial graduation ticks (360° machine index)
    if (rOuter > 70) {
      ctx.save();
      ctx.strokeStyle = color.replace(/[\d\.]+\)$/, '0.08)');
      ctx.lineWidth = 0.8;
      const totalTicks = teeth * 2;
      for (let t = 0; t < totalTicks; t++) {
        const tAngle = (t * Math.PI * 2) / totalTicks;
        const isMajor = t % 4 === 0;
        const rTickStart = rimInner * 0.94;
        const rTickEnd = rTickStart - (isMajor ? 6 : 3);
        ctx.beginPath();
        ctx.moveTo(Math.cos(tAngle) * rTickStart, Math.sin(tAngle) * rTickStart);
        ctx.lineTo(Math.cos(tAngle) * rTickEnd, Math.sin(tAngle) * rTickEnd);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. Central axle hub & keyed shaft
    const hubR = rInner * 0.32;
    ctx.beginPath();
    ctx.arc(0, 0, hubR, 0, Math.PI * 2);
    ctx.stroke();

    // Keyed bore hole
    const holeR = hubR * 0.48;
    ctx.beginPath();
    ctx.arc(0, 0, holeR, 0, Math.PI * 2);
    ctx.rect(-holeR * 0.32, -holeR * 1.35, holeR * 0.64, holeR * 0.6);
    ctx.stroke();

    // Hex-bolt circle pattern encircling hub
    const boltCircleR = (hubR + rimInner) * 0.38;
    const numBolts = 6;
    for (let b = 0; b < numBolts; b++) {
      const bAngle = (b * Math.PI * 2) / numBolts;
      const bx = Math.cos(bAngle) * boltCircleR;
      const by = Math.sin(bAngle) * boltCircleR;
      ctx.beginPath();
      ctx.arc(bx, by, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Lightening spoke windows
    if (numSpokes > 0 && spokeRadius > 0) {
      const spokeDist = (rimInner + hubR) / 2;
      for (let s = 0; s < numSpokes; s++) {
        const sAngle = (s * Math.PI * 2) / numSpokes;
        const sx = Math.cos(sAngle) * spokeDist;
        const sy = Math.sin(sAngle) * spokeDist;

        if (isHeavy) {
          ctx.save();
          ctx.rotate(sAngle);
          ctx.beginPath();
          const r1 = hubR * 1.25;
          const r2 = rimInner * 0.88;
          const w1 = r1 * 0.38;
          const w2 = r2 * 0.38;
          ctx.moveTo(r1, -w1);
          ctx.lineTo(r2, -w2);
          ctx.lineTo(r2, w2);
          ctx.lineTo(r1, w1);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(sx, sy, spokeRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        const rivetAngle = sAngle + step * 0.5;
        const rivetX = Math.cos(rivetAngle) * (rimInner * 0.94);
        const rivetY = Math.sin(rivetAngle) * (rimInner * 0.94);
        ctx.beginPath();
        ctx.arc(rivetX, rivetY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();

    // 7. Technical Stamped Blueprint Typography
    if (label) {
      ctx.save();
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = color.replace(/[\d\.]+\)$/, '0.35)');
      ctx.textAlign = 'center';
      ctx.fillText(label, cx, cy + rOuter + 14);
      ctx.restore();
    }
  }

  /* ------------------------------------------------------------------------
     B. Hydraulic Piston & Connecting Rod Mechanism (Punk Busters / Slam Cannon)
     ------------------------------------------------------------------------ */
  function drawHydraulicPistonMechanism(ctx, crankX, crankY, crankRadius, crankAngle, color) {
    const pinX = crankX + Math.cos(crankAngle) * (crankRadius * 0.65);
    const pinY = crankY + Math.sin(crankAngle) * (crankRadius * 0.65);

    const cylAxisY = crankY;
    const rodLength = crankRadius * 2.6;

    const dy = pinY - cylAxisY;
    const dx = Math.sqrt(Math.max(0, rodLength * rodLength - dy * dy));
    const pistonX = pinX + dx;
    const pistonY = cylAxisY;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.3;

    // Connecting rod
    ctx.beginPath();
    ctx.moveTo(pinX, pinY);
    ctx.lineTo(pistonX, pistonY);
    ctx.stroke();

    // Pins
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(pinX, pinY, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(pistonX, pistonY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Piston slider
    const pWidth = 26;
    const pHeight = 22;
    ctx.strokeStyle = color;
    ctx.strokeRect(pistonX - pWidth / 2, pistonY - pHeight / 2, pWidth, pHeight);

    // Pressure rings
    ctx.beginPath();
    ctx.moveTo(pistonX - pWidth / 4, pistonY - pHeight / 2);
    ctx.lineTo(pistonX - pWidth / 4, pistonY + pHeight / 2);
    ctx.moveTo(pistonX + pWidth / 4, pistonY - pHeight / 2);
    ctx.lineTo(pistonX + pWidth / 4, pistonY + pHeight / 2);
    ctx.stroke();

    // Cylinder sleeve
    const cylStartX = crankX + crankRadius * 0.8;
    const cylEndX = cylStartX + rodLength * 1.15;
    const cylHeight = 32;

    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = color.replace(/[\d\.]+\)$/, '0.22)');
    ctx.beginPath();
    ctx.moveTo(cylStartX, cylAxisY - cylHeight / 2);
    ctx.lineTo(cylEndX, cylAxisY - cylHeight / 2);
    ctx.moveTo(cylStartX, cylAxisY + cylHeight / 2);
    ctx.lineTo(cylEndX, cylAxisY + cylHeight / 2);
    ctx.lineTo(cylEndX, cylAxisY - cylHeight / 2);
    ctx.stroke();

    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = color.replace(/[\d\.]+\)$/, '0.4)');
    ctx.textAlign = 'left';
    ctx.fillText('// HYD-PSI: 4800 [PUNK-BUSTERS PISTON-01]', cylStartX, cylAxisY - cylHeight / 2 - 6);
    ctx.restore();

    ctx.restore();
  }

  /* ------------------------------------------------------------------------
     C. Interlocking Gear Clusters (Blueprint Mechanical Assemblies)
     ------------------------------------------------------------------------ */
  let gearClusters = [];

  function setupGearAssemblies() {
    gearClusters = [];

    // Cluster 1: Top-Right Rex Slam Cannon Lateral Gear Assembly (3 meshed gears)
    const g1Teeth = 24;
    const g1Outer = 108;
    const g1Inner = 90;

    const g2Teeth = 14;
    const g2Outer = 66;
    const g2Inner = 52;

    const g3Teeth = 8;
    const g3Outer = 42;
    const g3Inner = 32;

    const c1X = width - 120;
    const c1Y = 130;

    const pitch1 = (g1Outer + g1Inner) / 2;
    const pitch2 = (g2Outer + g2Inner) / 2;
    const pitch3 = (g3Outer + g3Inner) / 2;

    const dist12 = pitch1 + pitch2 - 1.5;
    const angle12 = Math.PI * 0.78;
    const c2X = c1X + Math.cos(angle12) * dist12;
    const c2Y = c1Y + Math.sin(angle12) * dist12;

    const dist23 = pitch2 + pitch3 - 1.2;
    const angle23 = angle12 + Math.PI * 0.54;
    const c3X = c2X + Math.cos(angle23) * dist23;
    const c3Y = c2Y + Math.sin(angle23) * dist23;

    gearClusters.push({
      name: 'SLAM_CANNON_LATERAL',
      gears: [
        { x: c1X, y: c1Y, rO: g1Outer, rI: g1Inner, teeth: g1Teeth, speed: 0.0035, color: 'rgba(242, 213, 140, 0.12)', spokeR: 15, spokes: 6, label: '[SLAM-CANNON // FLYWHEEL-A]', isHeavy: true },
        { x: c2X, y: c2Y, rO: g2Outer, rI: g2Inner, teeth: g2Teeth, speed: -0.0035 * (g1Teeth / g2Teeth), color: 'rgba(145, 182, 238, 0.13)', spokeR: 9, spokes: 4, label: '[IDLER-02]' },
        { x: c3X, y: c3Y, rO: g3Outer, rI: g3Inner, teeth: g3Teeth, speed: 0.0035 * (g1Teeth / g3Teeth), color: 'rgba(230, 189, 104, 0.13)', spokeR: 5, spokes: 3, label: '[PINION-03]' }
      ],
      meshPoints: [
        { x: c1X + Math.cos(angle12) * pitch1, y: c1Y + Math.sin(angle12) * pitch1 },
        { x: c2X + Math.cos(angle23) * pitch2, y: c2Y + Math.sin(angle23) * pitch2 }
      ]
    });

    // Cluster 2: Bottom-Left Punk Busters / Smack Hands Heavy Piston Assembly
    const b1Teeth = 20;
    const b1Outer = 120;
    const b1Inner = 100;

    const b2Teeth = 12;
    const b2Outer = 74;
    const b2Inner = 60;

    const b1X = 140;
    const b1Y = height - 120;

    const pitchB1 = (b1Outer + b1Inner) / 2;
    const pitchB2 = (b2Outer + b2Inner) / 2;
    const distB = pitchB1 + pitchB2 - 2;
    const angleB = -Math.PI * 0.32;
    const b2X = b1X + Math.cos(angleB) * distB;
    const b2Y = b1Y + Math.sin(angleB) * distB;

    gearClusters.push({
      name: 'PUNK_BUSTERS_PISTON',
      hasPiston: true,
      pistonGearIndex: 0,
      gears: [
        { x: b1X, y: b1Y, rO: b1Outer, rI: b1Inner, teeth: b1Teeth, speed: -0.0028, color: 'rgba(242, 213, 140, 0.11)', spokeR: 16, spokes: 6, label: '[PUNK-BUSTERS // CRANK-GEAR]', isHeavy: true },
        { x: b2X, y: b2Y, rO: b2Outer, rI: b2Inner, teeth: b2Teeth, speed: 0.0028 * (b1Teeth / b2Teeth), color: 'rgba(145, 182, 238, 0.12)', spokeR: 10, spokes: 4, label: '[PINION-RATIO 1:1.6]' }
      ],
      meshPoints: [
        { x: b1X + Math.cos(angleB) * pitchB1, y: b1Y + Math.sin(angleB) * pitchB1 }
      ]
    });
  }

  setupGearAssemblies();

  /* ------------------------------------------------------------------------
     D. Show-Accurate Generator Rex Nanites Class
     ------------------------------------------------------------------------ */
  class RexNanite {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -Math.random() * 80;
      this.vx = (Math.random() - 0.5) * 0.18;
      this.vy = 1.8 + Math.random() * 1.3;
      this.trail = [];
      this.angle = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.015;
      this.coreRadius = Math.random() * 2.2 + 3.0;
      this.rods = Array.from({ length: 6 }, (_, index) => ({
        angle: (index * Math.PI) / 3 + (Math.random() - 0.5) * 0.26,
        length: this.coreRadius * (1.5 + Math.random() * 1.1),
        width: 4 + Math.random() * 2.5
      }));

      this.archetype = 'omega';
      this.coreColor = '#91b6ee';

      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
      const speedMult = window.GeneratorRexEngine.isOverdrive ? 1.25 : 1.0;

      this.x += this.vx * speedMult;
      this.y += this.vy * speedMult;
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 42) this.trail.shift();
      this.angle += this.rotSpeed * speedMult;
      this.pulsePhase += 0.025 * speedMult;

      if (this.x < 0) { this.x = 0; this.vx *= -1; }
      if (this.x > width) { this.x = width; this.vx *= -1; }
      if (this.y > height + 24) {
        this.reset(false);
        return;
      }

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          this.vx += Math.cos(angle) * force * 0.025;

          this.angle = angle + Math.PI / 2;

          const maxSpd = window.GeneratorRexEngine.isOverdrive ? 2.2 : 1.6;
          const currentSpd = Math.abs(this.vx);
          if (currentSpd > maxSpd) {
            this.vx = Math.sign(this.vx) * maxSpd;
          }
        }
      }

      this.vx *= 0.985;
      this.vy = Math.max(1.6, this.vy * 0.999);
    }

    drawTrail() {
      if (this.trail.length < 2) return;
      const tail = this.trail[0];
      const head = this.trail[this.trail.length - 1];
      const goldFade = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      goldFade.addColorStop(0, 'rgba(145, 182, 238, 0)');
      goldFade.addColorStop(0.72, 'rgba(145, 182, 238, 0.42)');
      goldFade.addColorStop(1, 'rgba(215, 228, 255, 0.95)');

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = goldFade;
      ctx.lineWidth = 3.2;
      ctx.shadowColor = '#91b6ee';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.lineWidth = 1.1;
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.restore();
    }

    draw() {
      this.drawTrail();
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      const pulse = Math.sin(this.pulsePhase) * 0.06 + 1;
      const orbRadius = this.coreRadius * 1.2 * pulse;

      // Six short, individually sized dark rods around a compact golden orb.
      for (const rod of this.rods) {
        ctx.save();
        ctx.rotate(rod.angle);
        const root = orbRadius * 0.82;
        const tip = orbRadius + rod.length;
        const shaftEnd = root + (tip - root) * 0.78;

        ctx.beginPath();
        ctx.moveTo(root, -rod.width * 0.42);
        ctx.lineTo(shaftEnd, -rod.width * 0.3);
        ctx.lineTo(tip, 0);
        ctx.lineTo(shaftEnd, rod.width * 0.3);
        ctx.lineTo(root, rod.width * 0.42);
        ctx.closePath();
        // A pale rim keeps the dark rod silhouettes readable over the dark page.
        ctx.strokeStyle = 'rgba(230, 189, 104, 0.98)';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.fillStyle = '#090b12';
        ctx.fill();

        ctx.strokeStyle = 'rgba(230, 189, 104, 0.95)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(root + 0.4, -rod.width * 0.2);
        ctx.lineTo(shaftEnd, -rod.width * 0.16);
        ctx.stroke();

        ctx.fillStyle = '#91b6ee';
        ctx.beginPath();
        ctx.arc(root, 0, 0.75, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Rounded, bright core with a small specular highlight and a soft gold glow.
      const orbGradient = ctx.createRadialGradient(
        -orbRadius * 0.3, -orbRadius * 0.35, orbRadius * 0.05,
        0, 0, orbRadius
      );
      orbGradient.addColorStop(0, '#e6eaff');
      orbGradient.addColorStop(0.28, '#91b6ee');
      orbGradient.addColorStop(0.72, '#91b6ee');
      orbGradient.addColorStop(1, '#617ab7');

      ctx.shadowColor = '#91b6ee';
      ctx.shadowBlur = 10;
      ctx.fillStyle = orbGradient;
      ctx.beginPath();
      ctx.arc(0, 0, orbRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Clear glass capsule around the golden core, with a red rim and glints.
      const glassRadius = orbRadius + 1.5;
      ctx.fillStyle = 'rgba(242, 213, 140, 0.08)';
      ctx.beginPath();
      ctx.arc(0, 0, glassRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(230, 189, 104, 0.95)';
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      ctx.arc(0, 0, glassRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(-orbRadius * 0.08, -orbRadius * 0.08, glassRadius * 0.78, Math.PI * 1.08, Math.PI * 1.48);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.ellipse(-orbRadius * 0.42, -orbRadius * 0.48, 1.1, 0.55, -0.7, 0, Math.PI * 2);
      ctx.fill();

      // Occasional short red-gold crackles make the contained nanite look unstable.
      if (Math.random() < 0.018) {
        const zapAngle = Math.random() * Math.PI * 2;
        const zapLength = 4 + Math.random() * 5;
        const x1 = Math.cos(zapAngle) * glassRadius * 0.72;
        const y1 = Math.sin(zapAngle) * glassRadius * 0.72;
        const x2 = Math.cos(zapAngle) * (glassRadius + zapLength);
        const y2 = Math.sin(zapAngle) * (glassRadius + zapLength);
        const dx = x2 - x1;
        const dy = y2 - y1;
        const color = Math.random() < 0.65 ? '#e6bd68' : '#91b6ee';

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.25;
        ctx.shadowColor = color;
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + dx * 0.34 + (Math.random() - 0.5) * 4, y1 + dy * 0.34 + (Math.random() - 0.5) * 4);
        ctx.lineTo(x1 + dx * 0.68 + (Math.random() - 0.5) * 4, y1 + dy * 0.68 + (Math.random() - 0.5) * 4);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }
  }

  const nanites = [];
  const naniteCount = Math.min(42, Math.floor(width / 30));
  for (let i = 0; i < naniteCount; i++) {
    nanites.push(new RexNanite());
  }

  let gearTime = 0;
  const maxCircuitDist = 150;

  function drawSpaceBackdrop(time) {
    ctx.save();

    // A broad, low-contrast nebula band adds depth without competing with page text.
    ctx.save();
    ctx.translate(width * 0.5, height * 0.48);
    ctx.rotate(-0.34);
    const nebula = ctx.createLinearGradient(-width * 0.48, 0, width * 0.48, 0);
    nebula.addColorStop(0, 'rgba(145, 182, 238, 0)');
    nebula.addColorStop(0.28, 'rgba(145, 182, 238, 0.045)');
    nebula.addColorStop(0.52, 'rgba(230, 189, 104, 0.065)');
    nebula.addColorStop(0.76, 'rgba(145, 182, 238, 0.035)');
    nebula.addColorStop(1, 'rgba(145, 182, 238, 0)');
    ctx.fillStyle = nebula;
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.56, Math.max(32, height * 0.105), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Centered spiral galaxy with a bright core, layered arms, and rotating dust.
    ctx.save();
    const galaxyRadius = Math.min(width, height) * 0.25;
    ctx.translate(width * 0.5, height * 0.5);
    ctx.rotate(-0.12 + time * 0.22);
    ctx.scale(1, 0.56);

    const galaxyHalo = ctx.createRadialGradient(0, 0, galaxyRadius * 0.04, 0, 0, galaxyRadius);
    galaxyHalo.addColorStop(0, 'rgba(242, 213, 140, 0.2)');
    galaxyHalo.addColorStop(0.16, 'rgba(145, 182, 238, 0.14)');
    galaxyHalo.addColorStop(0.52, 'rgba(89, 111, 174, 0.075)');
    galaxyHalo.addColorStop(1, 'rgba(45, 57, 93, 0)');
    ctx.fillStyle = galaxyHalo;
    ctx.beginPath();
    ctx.arc(0, 0, galaxyRadius, 0, Math.PI * 2);
    ctx.fill();

    for (let arm = 0; arm < 4; arm++) {
      const armOffset = (Math.PI * 2 * arm) / 4;
      ctx.beginPath();
      for (let step = 0; step <= 120; step++) {
        const progress = step / 120;
        const angle = armOffset + progress * Math.PI * 3.7;
        const radius = galaxyRadius * (0.06 + progress * 0.91);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (step === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const armColor = arm % 2 === 0 ? 'rgba(145, 182, 238, 0.16)' : 'rgba(230, 189, 104, 0.13)';
      ctx.strokeStyle = armColor;
      ctx.lineWidth = Math.max(8, galaxyRadius * 0.075);
      ctx.shadowColor = arm % 2 === 0 ? 'rgba(145, 182, 238, 0.48)' : 'rgba(230, 189, 104, 0.42)';
      ctx.shadowBlur = galaxyRadius * 0.12;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = arm % 2 === 0 ? 'rgba(204, 220, 255, 0.24)' : 'rgba(255, 224, 155, 0.22)';
      ctx.lineWidth = Math.max(1.5, galaxyRadius * 0.012);
      ctx.stroke();
    }

    for (const dust of galaxyDust) {
      const angle = (dust.arm * Math.PI * 0.5) + dust.progress * Math.PI * 3.7 + dust.offset;
      const radius = galaxyRadius * (0.06 + dust.progress * 0.91);
      const twinkle = 0.3 + (Math.sin(time * 1.1 + dust.phase) + 1) * 0.26;
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = dust.warmth > 0.58 ? '#ffe4a1' : '#c4d7ff';
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * radius, Math.sin(angle) * radius, dust.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const galacticCore = ctx.createRadialGradient(0, 0, 1, 0, 0, galaxyRadius * 0.18);
    galacticCore.addColorStop(0, 'rgba(255, 248, 224, 0.88)');
    galacticCore.addColorStop(0.16, 'rgba(255, 224, 155, 0.55)');
    galacticCore.addColorStop(0.52, 'rgba(145, 182, 238, 0.2)');
    galacticCore.addColorStop(1, 'rgba(145, 182, 238, 0)');
    ctx.fillStyle = galacticCore;
    ctx.beginPath();
    ctx.arc(0, 0, galaxyRadius * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    for (const star of stars) {
      const twinkle = 0.35 + (Math.sin(time * 0.7 + star.phase) + 1) * 0.22;
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = star.warmth > 0.72 ? '#f2d58c' : '#b8cafa';
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
      ctx.fill();

      if (star.radius > 1.05 && twinkle > 0.72) {
        ctx.globalAlpha = (twinkle - 0.6) * 0.36;
        ctx.fillRect(star.x * width - 3.5, star.y * height - 0.35, 7, 0.7);
        ctx.fillRect(star.x * width - 0.35, star.y * height - 3.5, 0.7, 7);
      }
    }
    ctx.globalAlpha = 1;

    const holes = [
      { x: width * 0.19, y: height * 0.34, r: Math.max(27, Math.min(54, width * 0.035)), tilt: -0.28, phase: 0 },
      { x: width * 0.82, y: height * 0.68, r: Math.max(22, Math.min(40, width * 0.026)), tilt: 0.34, phase: 2.4 }
    ];

    for (const hole of holes) {
      const r = hole.r;
      const pulse = 0.88 + Math.sin(time * 0.45 + hole.phase) * 0.08;
      const halo = ctx.createRadialGradient(hole.x, hole.y, r * 0.68, hole.x, hole.y, r * 2.5);
      halo.addColorStop(0, 'rgba(230, 189, 104, 0.12)');
      halo.addColorStop(0.38, 'rgba(145, 182, 238, 0.06)');
      halo.addColorStop(1, 'rgba(15, 16, 28, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, r * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // The luminous accretion disk sits behind the dark event horizon.
      ctx.save();
      ctx.translate(hole.x, hole.y);
      ctx.rotate(hole.tilt + time * 0.035 + Math.sin(time * 0.12 + hole.phase) * 0.025);
      ctx.globalAlpha = pulse;
      ctx.shadowColor = 'rgba(230, 189, 104, 0.75)';
      ctx.shadowBlur = r * 0.62;
      const disk = ctx.createLinearGradient(-r * 2.15, 0, r * 2.15, 0);
      disk.addColorStop(0, 'rgba(230, 189, 104, 0)');
      disk.addColorStop(0.2, 'rgba(230, 189, 104, 0.12)');
      disk.addColorStop(0.48, 'rgba(255, 224, 155, 0.62)');
      disk.addColorStop(0.54, 'rgba(145, 182, 238, 0.28)');
      disk.addColorStop(0.82, 'rgba(230, 189, 104, 0.16)');
      disk.addColorStop(1, 'rgba(230, 189, 104, 0)');
      ctx.fillStyle = disk;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 2.15, r * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Orbiting hot particles animate the accretion flow around each horizon.
      for (let particle = 0; particle < 15; particle++) {
        const angle = time * (0.72 + (particle % 4) * 0.08) + (particle * Math.PI * 2) / 15 + hole.phase;
        const orbitX = Math.cos(angle) * r * (1.32 + (particle % 3) * 0.19);
        const orbitY = Math.sin(angle) * r * (0.31 + (particle % 4) * 0.055);
        const particleSize = 0.7 + (particle % 3) * 0.38;
        ctx.globalAlpha = 0.34 + (Math.sin(angle * 1.7) + 1) * 0.2;
        ctx.fillStyle = particle % 5 === 0 ? '#b9d3ff' : '#ffe4a1';
        ctx.shadowColor = particle % 5 === 0 ? '#91b6ee' : '#e6bd68';
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.arc(orbitX, orbitY, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(255, 220, 150, 0.54)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.58, r * 0.32, 0, Math.PI * 0.05, Math.PI * 0.95);
      ctx.stroke();

      const eventHorizon = ctx.createRadialGradient(-r * 0.2, -r * 0.25, r * 0.12, 0, 0, r);
      eventHorizon.addColorStop(0, '#080911');
      eventHorizon.addColorStop(0.72, '#05060b');
      eventHorizon.addColorStop(0.94, '#131521');
      eventHorizon.addColorStop(1, 'rgba(230, 189, 104, 0.5)');
      ctx.fillStyle = eventHorizon;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(230, 189, 104, 0.38)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.04, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  function drawCircuitLattice(n1, n2, dist, alpha) {
    const isOverdriveArc = window.GeneratorRexEngine.isOverdrive || n1.archetype === 'overdrive' || n2.archetype === 'overdrive';
    const strokeColor = isOverdriveArc ? `rgba(145, 182, 238, ${alpha * 1.35})` : `rgba(230, 189, 104, ${alpha})`;

    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = isOverdriveArc ? 1.3 : 1.0;

    const dx = n2.x - n1.x;
    const dy = n2.y - n1.y;

    ctx.beginPath();
    ctx.moveTo(n1.x, n1.y);

    if (Math.abs(dx) > Math.abs(dy)) {
      const midX = n1.x + Math.sign(dx) * (Math.abs(dx) - Math.abs(dy));
      ctx.lineTo(midX, n1.y);
      ctx.lineTo(n2.x, n2.y);
    } else {
      const midY = n1.y + Math.sign(dy) * (Math.abs(dy) - Math.abs(dx));
      ctx.lineTo(n1.x, midY);
      ctx.lineTo(n2.x, n2.y);
    }
    ctx.stroke();

    ctx.fillStyle = isOverdriveArc ? '#91b6ee' : '#e6bd68';
    const midX = (n1.x + n2.x) / 2;
    const midY = (n1.y + n2.y) / 2;
    ctx.beginPath();
    ctx.arc(midX, midY, 1.2, 0, Math.PI * 2);
    ctx.fill();

    const packetT = ((gearTime * 2.5 + n1.x * 0.05) % 10) / 10;
    const px = n1.x + (n2.x - n1.x) * packetT;
    const py = n1.y + (n2.y - n1.y) * packetT;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawElectricArc(x1, y1, x2, y2, color) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(3, Math.floor(dist / 22));
    const dx = (x2 - x1) / steps;
    const dy = (y2 - y1) / steps;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);

    for (let s = 1; s < steps; s++) {
      const jitter = (Math.random() - 0.5) * 8;
      const px = x1 + dx * s - (dy / dist) * jitter;
      const py = y1 + dy * s + (dx / dist) * jitter;
      ctx.lineTo(px, py);

      if (Math.random() > 0.75) {
        ctx.lineTo(px + (Math.random() - 0.5) * 10, py + (Math.random() - 0.5) * 10);
        ctx.moveTo(px, py);
      }
    }

    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  let previousFrame = 0;
  function animate(timestamp) {
    if (!prefersReducedMotion && timestamp - previousFrame < 1000 / 30) {
      requestAnimationFrame(animate);
      return;
    }
    previousFrame = timestamp;
    ctx.clearRect(0, 0, width, height);

    const speedMult = window.GeneratorRexEngine.isOverdrive ? 1.25 : 1.0;
    gearTime += 0.009 * speedMult;

    // Cosmic layer is painted first so the moving nanites remain in front.
    drawSpaceBackdrop(gearTime);

    // 1. Draw Background Mechanical Gear Assemblies
    for (let c = 0; c < gearClusters.length; c++) {
      const cluster = gearClusters[c];
      for (let g = 0; g < cluster.gears.length; g++) {
        const gear = cluster.gears[g];
        const currentAngle = gearTime * gear.speed * 40;
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
          gear.spokes,
          gear.label,
          gear.isHeavy
        );
      }

      if (cluster.hasPiston) {
        const pGear = cluster.gears[cluster.pistonGearIndex];
        const pAngle = gearTime * pGear.speed * 40;
        drawHydraulicPistonMechanism(ctx, pGear.x, pGear.y, pGear.rO, pAngle, 'rgba(242, 213, 140, 0.22)');
      }

      if (cluster.meshPoints && Math.random() < (window.GeneratorRexEngine.isOverdrive ? 0.12 : 0.04)) {
        for (let m = 0; m < cluster.meshPoints.length; m++) {
          const mp = cluster.meshPoints[m];
          const spkAngle = Math.random() * Math.PI * 2;
          sparks.push({
            x: mp.x + (Math.random() - 0.5) * 4,
            y: mp.y + (Math.random() - 0.5) * 4,
            vx: Math.cos(spkAngle) * (Math.random() * 2 + 1),
            vy: Math.sin(spkAngle) * (Math.random() * 2 + 1),
            life: 1.0,
            decay: 0.06,
            color: Math.random() > 0.5 ? '#91b6ee' : '#e6bd68',
            size: Math.random() * 1.5 + 1.0
          });
        }
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
          const alpha = (1 - dist / maxCircuitDist) * 0.22;
          drawCircuitLattice(nanites[i], nanites[j], dist, alpha);

          if (dist < 85 && Math.random() < 0.015) {
            const arcColor = (window.GeneratorRexEngine.isOverdrive || nanites[i].archetype === 'overdrive')
              ? 'rgba(145, 182, 238, 0.85)'
              : 'rgba(230, 189, 104, 0.8)';
            drawElectricArc(nanites[i].x, nanites[i].y, nanites[j].x, nanites[j].y, arcColor);
          }
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const mdx = mouse.x - nanites[i].x;
        const mdy = mouse.y - nanites[i].y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.radius) {
          const mAlpha = (1 - mdist / mouse.radius) * 0.22;
          ctx.beginPath();
          ctx.moveTo(nanites[i].x, nanites[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = window.GeneratorRexEngine.isOverdrive
            ? `rgba(145, 182, 238, ${mAlpha})`
            : `rgba(230, 189, 104, ${mAlpha})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();

          if (Math.random() < 0.01) {
            drawElectricArc(nanites[i].x, nanites[i].y, mouse.x, mouse.y, 'rgba(145, 182, 238, 0.7)');
          }
        }
      }
    }

    // 3. Render Expanding Shockwaves
    for (let w = shockwaves.length - 1; w >= 0; w--) {
      const sw = shockwaves[w];
      sw.radius += sw.speed;
      sw.alpha = 1 - (sw.radius / sw.maxRadius);

      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        shockwaves.splice(w, 1);
        continue;
      }

      ctx.save();
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.alpha * 0.7;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([8, 8]);
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius * 0.88, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Render Spark Particles
    for (let s = sparks.length - 1; s >= 0; s--) {
      const spk = sparks[s];
      spk.x += spk.vx;
      spk.y += spk.vy;
      spk.life -= spk.decay;

      if (spk.life <= 0) {
        sparks.splice(s, 1);
        continue;
      }

      ctx.save();
      ctx.fillStyle = spk.color;
      ctx.globalAlpha = spk.life;
      ctx.beginPath();
      ctx.arc(spk.x, spk.y, spk.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (!prefersReducedMotion) requestAnimationFrame(animate);
  }

  animate(0);
}

/* ==========================================================================
   2. Mechanical / Nanite Typewriter Effect
   ========================================================================== */
function initMechanicalTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  el.textContent = 'NANITES: ONLINE // Digging below the abstraction layer';
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
   4. Interactive Nanite Overdrive Controller
   ========================================================================== */
function initOverdriveToggle() {
  const toggleBtns = document.querySelectorAll('.overdrive-toggle-btn, .hero-status-pill');

  function setOverdriveState(state) {
    window.GeneratorRexEngine.isOverdrive = state;
    document.body.classList.toggle('nanite-overdrive', state);

    const pills = document.querySelectorAll('.hero-status-pill span:not(.pulse-dot)');
    pills.forEach(pill => {
      pill.textContent = state
        ? 'NANITES: OVERDRIVE [100% REACTION] • SURGE ACTIVE'
        : 'NANITES: ONLINE • PROVIDENCE STANDARD';
    });

    if (window.GeneratorRexEngine.triggerConstructPulse) {
      window.GeneratorRexEngine.triggerConstructPulse(1.5);
    }
  }

  window.GeneratorRexEngine.toggleOverdrive = () => {
    setOverdriveState(!window.GeneratorRexEngine.isOverdrive);
    return window.GeneratorRexEngine.isOverdrive;
  };

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.GeneratorRexEngine.toggleOverdrive();
    });
  });
}

/* ==========================================================================
   5. Complete Linux Virtual File System & Interactive Shell Engine
   ========================================================================== */
function initCyberTerminal() {
  const modal = document.getElementById('terminal-modal');
  const openBtns = document.querySelectorAll('.terminal-trigger');
  const closeBtn = document.getElementById('terminal-close-btn');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const promptLabel = document.getElementById('terminal-prompt-label');
  const promptContext = document.getElementById('terminal-prompt-context');

  if (!modal || !terminalInput || !terminalOutput) return;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Browser-based virtual terminal');

  const terminalWindow = modal.querySelector('.terminal-window');
  const terminalHeader = modal.querySelector('.terminal-header');
  const terminalBody = modal.querySelector('.terminal-body');
  let terminalClock;

  if (terminalWindow && terminalHeader && terminalBody) {
    const statusbar = document.createElement('div');
    statusbar.className = 'omarchy-statusbar';
    statusbar.innerHTML = '<span class="omarchy-status-brand"><span class="omarchy-status-dot"></span> AKILESTHEDARK <span class="omarchy-status-muted">/ WORKSPACE 1</span></span><time id="terminal-clock"></time><span class="omarchy-status-state">SIMULATED SYSTEM <span>•</span> NETWORK ISOLATED</span>';

    const workspace = document.createElement('div');
    workspace.className = 'omarchy-workspace';

    const leftColumn = document.createElement('div');
    leftColumn.className = 'omarchy-left-column';

    const shellPane = document.createElement('section');
    shellPane.className = 'omarchy-pane omarchy-shell-pane';
    shellPane.setAttribute('aria-label', 'Interactive virtual shell');
    shellPane.innerHTML = '<div class="omarchy-pane-heading"><span>›_ SHELL</span><span>/bin/bash</span></div>';
    shellPane.appendChild(terminalBody);

    const filesPane = document.createElement('section');
    filesPane.className = 'omarchy-pane omarchy-files-pane';
    filesPane.setAttribute('aria-label', 'Virtual home directory');
    filesPane.innerHTML = '<div class="omarchy-pane-heading"><span>▸ VIRTUAL FILES</span><span>~/</span></div><div class="omarchy-file-tree"><div class="omarchy-tree-path">📁 ~/AkilesTheDark</div><div>├─ <span>README.md</span></div><div>├─ <span>whoami.txt</span></div><div>├─ <span>skills.txt</span></div><div>├─ <span>contact.json</span></div><div>├─ <span>projects/</span></div><div>└─ <span>.nanite/</span></div></div><div class="omarchy-files-footnote">BROWSER VIRTUAL FILESYSTEM</div>';

    leftColumn.append(shellPane, filesPane);

    const monitor = document.createElement('aside');
    monitor.className = 'omarchy-monitor-column';
    monitor.setAttribute('aria-label', 'Simulated system dashboard');
    monitor.innerHTML = `
      <section class="omarchy-pane omarchy-cpu-pane">
        <div class="omarchy-pane-heading"><span>⌁ CPU</span><span>PRESET · LIVE SIMULATION</span></div>
        <div class="omarchy-cpu-summary"><strong>CPU</strong><span data-cpu-value>12.8%</span><span data-cpu-temp>46°C</span></div>
        <div class="omarchy-meter" data-cpu-meter><span data-cpu-bar style="width:13%"></span></div>
        <div class="omarchy-core-grid">${Array.from({ length: 8 }, (_, i) => `<span data-core-index="${i}">C${i}<i><b data-core-bar style="width:${12 + ((i * 17) % 46)}%"></b></i><em data-core-value>1%</em></span>`).join('')}</div>
        <div class="omarchy-pane-foot">UP 02:07:05 <span>LOAD 0.20 0.10 0.07</span></div>
      </section>
      <div class="omarchy-resource-grid">
        <section class="omarchy-pane omarchy-memory-pane">
          <div class="omarchy-pane-heading"><span>⌁ MEMORY</span></div>
          <strong><span data-memory-used>2.1</span> <small>/ 7.7 GiB</small></strong><div class="omarchy-meter"><span data-memory-bar style="width:28%"></span></div>
          <p>Available <b data-memory-available>5.2 GiB</b></p><p>Cache <b data-memory-cache>1.8 GiB</b></p>
        </section>
        <section class="omarchy-pane omarchy-disk-pane">
          <div class="omarchy-pane-heading"><span>⌁ DISK</span></div>
          <strong>8.2 <small>/ 24 GiB</small></strong><div class="omarchy-meter"><span style="width:36%"></span></div>
          <p>Root <b>36%</b></p><p>Virtual home <b>10%</b></p>
        </section>
      </div>
      <section class="omarchy-pane omarchy-process-pane">
        <div class="omarchy-pane-heading"><span>⌁ PROCESSES</span><span>PID · PROGRAM · USER · MEM · CPU</span></div>
        <div class="omarchy-process-row" data-process-index="0"><b>581</b><span>nanite-monitor</span><em>AkilesTheDark</em><small data-process-memory>82M</small><strong data-process-cpu>1.2%</strong></div>
        <div class="omarchy-process-row" data-process-index="1"><b>412</b><span>bash</span><em>AkilesTheDark</em><small data-process-memory>14M</small><strong data-process-cpu>0.3%</strong></div>
        <div class="omarchy-process-row" data-process-index="2"><b>1</b><span>systemd</span><em>root</em><small data-process-memory>68M</small><strong data-process-cpu>0.1%</strong></div>
        <div class="omarchy-process-row" data-process-index="3"><b>620</b><span>terminal-ui</span><em>AkilesTheDark</em><small data-process-memory>124M</small><strong data-process-cpu>0.4%</strong></div>
        <div class="omarchy-pane-foot">LIVE SIMULATION · BROWSER ONLY</div>
      </section>
      <section class="omarchy-pane omarchy-network-pane">
        <div class="omarchy-pane-heading"><span>⌁ NETWORK</span><span>OFFLINE</span></div>
        <div class="omarchy-network-bars" aria-hidden="true">▂ ▄ ▃ ▅ ▂ ▆ ▃ ▄ ▂ ▅ ▃ ▆ ▂ ▄ ▅ ▃ ▂ ▆ ▄ ▃</div>
        <div class="omarchy-network-labels"><span>↑ 0 B/s</span><span>↓ 0 B/s</span></div>
      </section>`;

    terminalHeader.after(statusbar);
    workspace.append(leftColumn, monitor);
    statusbar.after(workspace);
    terminalClock = statusbar.querySelector('#terminal-clock');
  }

  const updateTerminalClock = () => {
    if (terminalClock) terminalClock.textContent = new Intl.DateTimeFormat(undefined, {
      weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).format(new Date());
  };
  updateTerminalClock();

  const systemMonitor = terminalWindow?.querySelector('.omarchy-monitor-column');
  let systemMetricsInterval = null;
  let metricsTick = 0;
  let cpuLoad = 14;
  let memoryUsed = 2.1;

  const updateSystemMetrics = () => {
    if (!systemMonitor) return;
    metricsTick++;

    const cpuTarget = 7 + Math.random() * 62 + Math.sin(metricsTick / 4) * 9;
    cpuLoad = Math.max(2, Math.min(88, cpuLoad + (cpuTarget - cpuLoad) * 0.32));
    if (metricsTick % 17 === 0) cpuLoad = Math.min(91, cpuLoad + 8 + Math.random() * 12);

    memoryUsed = Math.min(6.7, memoryUsed + 0.004 + Math.random() * 0.035);
    if (metricsTick % 40 === 0) memoryUsed = Math.max(1.8, memoryUsed - 0.12 - Math.random() * 0.2);
    const cacheUsed = 1.1 + Math.random() * 0.8;
    const available = Math.max(0.2, 7.7 - memoryUsed - cacheUsed);

    const cpuPercent = `${cpuLoad.toFixed(1)}%`;
    const cpuValue = systemMonitor.querySelector('[data-cpu-value]');
    const cpuBar = systemMonitor.querySelector('[data-cpu-bar]');
    const cpuTemp = systemMonitor.querySelector('[data-cpu-temp]');
    if (cpuValue) cpuValue.textContent = cpuPercent;
    if (cpuBar) cpuBar.style.width = `${cpuLoad.toFixed(1)}%`;
    if (cpuTemp) cpuTemp.textContent = `${Math.round(41 + cpuLoad * 0.28 + Math.random() * 3)}°C`;

    systemMonitor.querySelectorAll('[data-core-index]').forEach((core) => {
      const load = Math.max(1, Math.min(99, cpuLoad * (0.38 + Math.random() * 0.95) + Math.random() * 11));
      const bar = core.querySelector('[data-core-bar]');
      const value = core.querySelector('[data-core-value]');
      if (bar) bar.style.width = `${load.toFixed(0)}%`;
      if (value) value.textContent = `${load.toFixed(0)}%`;
    });

    const usedLabel = systemMonitor.querySelector('[data-memory-used]');
    const availableLabel = systemMonitor.querySelector('[data-memory-available]');
    const cacheLabel = systemMonitor.querySelector('[data-memory-cache]');
    const memoryBar = systemMonitor.querySelector('[data-memory-bar]');
    if (usedLabel) usedLabel.textContent = memoryUsed.toFixed(1);
    if (availableLabel) availableLabel.textContent = `${available.toFixed(1)} GiB`;
    if (cacheLabel) cacheLabel.textContent = `${cacheUsed.toFixed(1)} GiB`;
    if (memoryBar) memoryBar.style.width = `${(memoryUsed / 7.7 * 100).toFixed(1)}%`;

    const processShares = [0.56, 0.22, 0.08, 0.14];
    const processMemoryBase = [82, 14, 68, 124];
    systemMonitor.querySelectorAll('[data-process-index]').forEach((row) => {
      const index = Number(row.dataset.processIndex);
      const cpu = row.querySelector('[data-process-cpu]');
      const memory = row.querySelector('[data-process-memory]');
      const processLoad = Math.max(0.1, cpuLoad * processShares[index] + Math.random() * 1.1);
      const processMemory = processMemoryBase[index] + Math.round(memoryUsed * [12, 3, 2, 22][index]);
      if (cpu) cpu.textContent = `${processLoad.toFixed(1)}%`;
      if (memory) memory.textContent = `${processMemory}M`;
    });
  };

  updateSystemMetrics();

  // Complete Virtual File System Tree (VFS)
  const vfs = {
    type: 'dir',
    perms: 'drwxr-xr-x',
    owner: 'root',
    group: 'root',
    size: '4096',
    date: 'Sep 01 00:00',
    entries: {
      'home': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        size: '4096',
        date: 'Sep 01 00:00',
        entries: {
          'AkilesTheDark': {
            type: 'dir',
            perms: 'drwxr-xr-x',
            owner: 'AkilesTheDark',
            group: 'AkilesTheDark',
            size: '4096',
            date: 'Oct 01 10:45',
            entries: {
              'README.md': {
                type: 'file',
                perms: '-rw-r--r--',
                owner: 'AkilesTheDark',
                group: 'AkilesTheDark',
                size: '1.2K',
                date: 'Oct 01 10:45',
                content: `# AkilesTheDark (@wajdi-cpu)
Offensive Security Practitioner & Cybersecurity Researcher
Specialized in Web Penetration Testing, Active Directory Exploitation, and Reverse Engineering.

Welcome to Nanite OS! (Providence Linux 6.8.0-rex)
Explore this browser-based virtual shell using commands such as:
  ls, cd, cat, pwd, tree, find, grep, head, tail, wc, sort, uniq
  mkdir, touch, cp, mv, rm, chmod, echo, printf, history, help
Use pipes, redirection, quoting, environment variables, and command chaining.

Generator Rex diagnostics:
  overdrive, nanites, gears, scan`
              },
              'whoami.txt': {
                type: 'file',
                perms: '-rw-r--r--',
                owner: 'AkilesTheDark',
                group: 'AkilesTheDark',
                size: '840B',
                date: 'Oct 01 09:12',
                content: `[OPERATOR IDENTITY]
Handle:     AkilesTheDark (@wajdi-cpu)
Name:       Wajdi
Education:  ISET Mahdia (RSI 2.1) - Network Systems & Cybersecurity
Focus:      Offensive Security, Cloud Pentesting, Adversary Emulation
Role:       Red Team Operator / Security Researcher
Status:     Authorized Operator [UID 1000]
Relay:      https://github.com/wajdi-cpu`
              },
              'skills.txt': {
                type: 'file',
                perms: '-rw-r--r--',
                owner: 'AkilesTheDark',
                group: 'AkilesTheDark',
                size: '950B',
                date: 'Sep 28 14:20',
                content: `[TECHNICAL COMPETENCIES]
* Active Directory Attacks (Kerberoasting, DCSync, AS-REP Roasting, BloodHound)
* Web Application Security (Burp Suite Pro, SQLi, DOM-XSS, SSRF, IDOR, OAuth)
* Cloud Auditing & IAM Assessment (AWS / Azure, ScoutSuite, Pacu)
* Reverse Engineering (Ghidra, GDB, x86_64 / ARM disassembly, binary patching)
* Scripting & Exploit Dev: Python, Go, C, Bash, PowerShell`
              },
              'contact.json': {
                type: 'file',
                perms: '-rw-r--r--',
                owner: 'AkilesTheDark',
                group: 'AkilesTheDark',
                size: '340B',
                date: 'Sep 24 16:00',
                content: `{\n  "operator": "AkilesTheDark",\n  "github": "https://github.com/wajdi-cpu",\n  "linkedin": "https://linkedin.com",\n  "hackthebox": "https://app.hackthebox.com/profile",\n  "medium": "https://medium.com/@wajdi-cpu"\n}`
              },
              'flag.txt': {
                type: 'file',
                perms: '-r--------',
                owner: 'AkilesTheDark',
                group: 'AkilesTheDark',
                size: '42B',
                date: 'Sep 15 03:37',
                content: `REX{n4n1t3s_0v3rdr1v3_pr0v1d3nc3_m4st3r}`
              },
              'blogs': {
                type: 'dir',
                perms: 'drwxr-xr-x',
                owner: 'AkilesTheDark',
                group: 'AkilesTheDark',
                size: '4096',
                date: 'Sep 20 18:30',
                entries: {
                  'active_directory_kerberoasting.md': {
                    type: 'file',
                    perms: '-rw-r--r--',
                    owner: 'AkilesTheDark',
                    group: 'AkilesTheDark',
                    size: '4.8K',
                    date: 'Sep 20 18:30',
                    content: `# Extracting and Cracking Service Account Hashes (Kerberoasting)
An offensive guide on querying SPNs in Windows Active Directory environments,
requesting TGS tickets, and extracting RC4/AES hashes for offline hashcat cracking.
Tags: Active Directory, Red Team, Kerberos`
                  },
                  'hackthebox_hospital_writeup.md': {
                    type: 'file',
                    perms: '-rw-r--r--',
                    owner: 'AkilesTheDark',
                    group: 'AkilesTheDark',
                    size: '3.9K',
                    date: 'Sep 18 12:00',
                    content: `# Hack The Box: Hospital Machine Walkthrough
Detailed exploitation walkthrough covering webmail vulnerability exploitation,
bypassing Windows Defender with obfuscated PowerShell loaders, and privilege escalation.
Tags: HackTheBox, Windows, PrivEsc`
                  },
                  'memory_corruption_basics.md': {
                    type: 'file',
                    perms: '-rw-r--r--',
                    owner: 'AkilesTheDark',
                    group: 'AkilesTheDark',
                    size: '5.2K',
                    date: 'Sep 12 11:15',
                    content: `# Deep-Dive: Memory Corruption & Stack Buffer Overflows
Dissecting stack layout, instruction pointers (EIP/RIP), shellcode crafting,
NOP sleds, and bypassing basic security mitigations in x86 binaries.
Tags: Binary Exploitation, Reverse Engineering, C`
                  },
                  'cloud_iam_pentest.md': {
                    type: 'file',
                    perms: '-rw-r--r--',
                    owner: 'AkilesTheDark',
                    group: 'AkilesTheDark',
                    size: '3.4K',
                    date: 'Aug 29 17:40',
                    content: `# Cloud Penetration Testing: Exploiting Misconfigured AWS IAM Policies
Privilege escalation pathways in AWS environments using CreateAccessKey,
AttachUserPolicy, and Lambda execution role assumptions.
Tags: AWS, Cloud Security, IAM`
                  }
                }
              },
              'projects': {
                type: 'dir',
                perms: 'drwxr-xr-x',
                owner: 'AkilesTheDark',
                group: 'AkilesTheDark',
                size: '4096',
                date: 'Sep 26 21:05',
                entries: {
                  'ares-c2.py': {
                    type: 'file',
                    perms: '-rwxr-xr-x',
                    owner: 'AkilesTheDark',
                    group: 'AkilesTheDark',
                    size: '12.4K',
                    date: 'Sep 26 21:05',
                    content: `#!/usr/bin/env python3\n# Ares C2 - Asynchronous Red Team Post-Exploitation Framework\n# Encrypted beaconing over HTTPS with dynamic jitter\nimport sys, os, time\nprint("[+] Ares C2 listener initialized on port 8443 (TLS v1.3)...")\n`
                  },
                  'cloud-recon-toolkit.sh': {
                    type: 'file',
                    perms: '-rwxr-xr-x',
                    owner: 'AkilesTheDark',
                    group: 'AkilesTheDark',
                    size: '6.1K',
                    date: 'Sep 14 08:30',
                    content: `#!/usr/bin/env bash\n# Cloud Recon Toolkit - Automated multi-cloud asset enumeration\necho "[*] Enumerating S3 buckets, IAM roles, and publicly exposed Azure blobs..."\n`
                  },
                  'rev-kernel-hook.c': {
                    type: 'file',
                    perms: '-rw-r--r--',
                    owner: 'AkilesTheDark',
                    group: 'AkilesTheDark',
                    size: '8.7K',
                    date: 'Aug 19 19:10',
                    content: `/* rev-kernel-hook.c - Linux LKM Syscall Interception Rootkit Research */\n#include <linux/module.h>\n#include <linux/kernel.h>\nMODULE_LICENSE("GPL");\nint init_module(void) { printk(KERN_INFO "Nanite kernel hook registered\\n"); return 0; }\n`
                  }
                }
              },
              'certs': {
                type: 'dir',
                perms: 'drwxr-xr-x',
                owner: 'AkilesTheDark',
                group: 'AkilesTheDark',
                size: '4096',
                date: 'Sep 01 09:30',
                entries: {
                  'comptia_secplus.txt': {
                    type: 'file',
                    perms: '-rw-r--r--',
                    owner: 'AkilesTheDark',
                    group: 'AkilesTheDark',
                    size: '320B',
                    date: 'Jul 10 14:00',
                    content: `Credential: CompTIA Security+ (SY0-701)\nIssuer:     CompTIA\nStatus:     Earned & Verified\nFocus:      Network defense, incident response, vulnerability management.`
                  },
                  'crto.txt': {
                    type: 'file',
                    perms: '-rw-r--r--',
                    owner: 'AkilesTheDark',
                    group: 'AkilesTheDark',
                    size: '410B',
                    date: 'Sep 01 09:30',
                    content: `Credential: Certified Red Team Operator (CRTO)\nIssuer:     Zero-Point Security\nStatus:     Actively In-Progress\nFocus:      Cobalt Strike, AD attacks, host evasion, C2 redirection.`
                  },
                  'pnpt.txt': {
                    type: 'file',
                    perms: '-rw-r--r--',
                    owner: 'AkilesTheDark',
                    group: 'AkilesTheDark',
                    size: '380B',
                    date: 'Aug 15 16:45',
                    content: `Credential: Practical Network Penetration Tester (PNPT)\nIssuer:     TCM Security\nStatus:     Actively In-Progress\nFocus:      OSINT, external pentesting, internal AD, report writing.`
                  }
                }
              },
              '.nanite': {
                type: 'dir',
                perms: 'drwx------',
                owner: 'AkilesTheDark',
                group: 'nanite-core',
                size: '4096',
                date: 'Oct 01 12:00',
                entries: {
                  'core_telemetry.log': {
                    type: 'file',
                    perms: '-rw-------',
                    owner: 'AkilesTheDark',
                    group: 'nanite-core',
                    size: '1.8K',
                    date: 'Oct 01 12:00',
                    content: `[NANITE_LOG] Swarm density: 100% nominal\n[NANITE_LOG] Core frequency: 432 THz\n[NANITE_LOG] Body: glass-encased gold orb / six variable rods\n[NANITE_LOG] Electrical instability: red-gold arcs\n[NANITE_LOG] Motion: accelerated vertical descent / gold trails\n[NANITE_LOG] Overdrive readiness: 100%\n`
                  },
                  'constructs.cfg': {
                    type: 'file',
                    perms: '-rw-------',
                    owner: 'AkilesTheDark',
                    group: 'nanite-core',
                    size: '512B',
                    date: 'Oct 01 11:30',
                    content: `[CONSTRUCTS]\nsmackhands=1450000;torque=12500;psi=4800\nslamcannon=1820000;rpm=3200;vel=mach2.4\nboogiepack=1150000;rpm=18000;vector=true\nbfs=1380000;hz=85000;harmonic=active\npunkbusters=1620000;psi=6400;stroke=64mm\n`
                  }
                }
              }
            }
          }
        }
      },
      'etc': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        size: '4096',
        date: 'Sep 01 00:00',
        entries: {
          'os-release': {
            type: 'file',
            perms: '-rw-r--r--',
            owner: 'root',
            group: 'root',
            size: '210B',
            date: 'Sep 01 00:00',
            content: `NAME="Nanite OS"\nVERSION="3.2.0-STABLE (Rex-Providence)"\nID=nanite-os\nID_LIKE="debian ubuntu"\nPRETTY_NAME="Providence Nanite OS v3.2.0 (Rex Construct Edition)"\nHOME_URL="https://github.com/wajdi-cpu"\n`
          },
          'hostname': {
            type: 'file',
            perms: '-rw-r--r--',
            owner: 'root',
            group: 'root',
            size: '10B',
            date: 'Sep 01 00:00',
            content: `nanite-os\n`
          },
          'resolv.conf': {
            type: 'file',
            perms: '-rw-r--r--',
            owner: 'root',
            group: 'root',
            size: '72B',
            date: 'Sep 01 00:00',
            content: `nameserver 1.1.1.1\nnameserver 8.8.8.8\nsearch providence.internal\n`
          }
        }
      },
      'var': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        size: '4096',
        date: 'Sep 01 00:00',
        entries: {
          'log': {
            type: 'dir',
            perms: 'drwxr-xr-x',
            owner: 'root',
            group: 'root',
            size: '4096',
            date: 'Sep 01 00:00',
            entries: {
              'providence.log': {
                type: 'file',
                perms: '-rw-r-----',
                owner: 'root',
                group: 'adm',
                size: '4.2K',
                date: 'Oct 01 11:58',
                content: `[SYSTEM_BOOT] BIOS check complete\n[KERNEL] Nanite driver v6.8.0-rex initialized\n[SEC_AUDIT] Operator @wajdi-cpu logged in\n[SECURITY] Zero unauthorized foreign EVO mutagens detected\n`
              }
            }
          }
        }
      },
      'bin': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        size: '4096',
        date: 'Sep 01 00:00',
        entries: {
          'bash': { type: 'file', perms: '-rwxr-xr-x', owner: 'root', group: 'root', size: '1.2M', date: 'Sep 01 00:00', content: 'ELF 64-bit LSB executable' },
          'ls': { type: 'file', perms: '-rwxr-xr-x', owner: 'root', group: 'root', size: '142K', date: 'Sep 01 00:00', content: 'ELF 64-bit LSB executable' },
          'cat': { type: 'file', perms: '-rwxr-xr-x', owner: 'root', group: 'root', size: '43K', date: 'Sep 01 00:00', content: 'ELF 64-bit LSB executable' },
          'grep': { type: 'file', perms: '-rwxr-xr-x', owner: 'root', group: 'root', size: '215K', date: 'Sep 01 00:00', content: 'ELF 64-bit LSB executable' },
          'tree': { type: 'file', perms: '-rwxr-xr-x', owner: 'root', group: 'root', size: '82K', date: 'Sep 01 00:00', content: 'ELF 64-bit LSB executable' }
        }
      },
      'tmp': {
        type: 'dir', perms: 'drwxrwxrwt', owner: 'root', group: 'root', size: '4096', date: 'Sep 01 00:00', entries: {}
      },
      'opt': {
        type: 'dir', perms: 'drwxr-xr-x', owner: 'root', group: 'root', size: '4096', date: 'Sep 01 00:00', entries: {}
      }
    }
  };

  // Keep user-created virtual paths from colliding with JavaScript object properties.
  const normalizeVfsEntries = (node) => {
    if (node.type !== 'dir') return;
    node.entries = Object.assign(Object.create(null), node.entries);
    Object.values(node.entries).forEach(normalizeVfsEntries);
  };
  normalizeVfsEntries(vfs);

  // State: Default Working Directory starts at /home/AkilesTheDark (~)
  let cwd = ['home', 'AkilesTheDark'];
  let previousCwd = [...cwd];
  const commandHistory = [];
  let historyIndex = -1;
  const shellVariables = Object.assign(Object.create(null), {
    HOME: '/home/AkilesTheDark', USER: 'AkilesTheDark', PWD: '/home/AkilesTheDark',
    SHELL: '/bin/bash', TERM: 'xterm-256color',
    PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
  });

  // Helpers: Path resolution
  function getPromptStr() {
    if (cwd.length === 2 && cwd[0] === 'home' && cwd[1] === 'AkilesTheDark') {
      return '~';
    }
    if (cwd.length > 2 && cwd[0] === 'home' && cwd[1] === 'AkilesTheDark') {
      return '~/' + cwd.slice(2).join('/');
    }
    return '/' + cwd.join('/');
  }

  function updatePromptDisplay() {
    const pStr = getPromptStr();
    shellVariables.PWD = '/' + cwd.join('/');
    if (promptContext) {
      promptContext.innerHTML = `<span class="terminal-prompt-edge">┌──(</span><span class="terminal-user-name">AkilesTheDark</span><span class="terminal-host-name">㉿nanite-os</span><span class="terminal-prompt-edge">)-[</span><span class="terminal-prompt-path">${escapeHtml(pStr)}</span><span class="terminal-prompt-edge">]</span>`;
    }
    if (promptLabel) {
      promptLabel.textContent = '└─$';
    }
  }

  function resolvePathSegments(pathStr) {
    if (!pathStr || pathStr.trim() === '') return [...cwd];

    let clean = pathStr.trim();
    let parts;

    if (clean === '~' || clean.startsWith('~/')) {
      clean = clean.replace(/^~/, '/home/AkilesTheDark');
    }

    if (clean.startsWith('/')) {
      parts = clean.split('/').filter(Boolean);
    } else {
      parts = [...cwd, ...clean.split('/').filter(Boolean)];
    }

    const resolved = [];
    for (let seg of parts) {
      if (seg === '.') continue;
      if (seg === '..') {
        if (resolved.length > 0) resolved.pop();
      } else {
        resolved.push(seg);
      }
    }
    return resolved;
  }

  function getNode(segments) {
    let curr = vfs;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (!curr.entries || !Object.prototype.hasOwnProperty.call(curr.entries, seg)) {
        return null;
      }
      curr = curr.entries[seg];
    }
    return curr;
  }

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const makeDirectory = (owner = 'AkilesTheDark') => ({
    type: 'dir', perms: 'drwxr-xr-x', owner, group: owner, size: '4096',
    date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }),
    entries: Object.create(null)
  });

  const makeFile = (content = '', owner = 'AkilesTheDark') => ({
    type: 'file', perms: '-rw-r--r--', owner, group: owner,
    size: `${new Blob([content]).size}B`, date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }), content
  });

  function writeVirtualFile(pathStr, content, append = false) {
    const { parent, name } = getParentNode(pathStr);
    if (!name || !parent || parent.type !== 'dir') return `cannot create '${pathStr}': parent directory does not exist`;
    const existing = parent.entries[name];
    if (existing && existing.type !== 'file') return `cannot overwrite directory '${pathStr}'`;
    if (existing) {
      existing.content = (append ? (existing.content || '') : '') + content;
      existing.size = `${new Blob([existing.content]).size}B`;
      existing.date = new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      parent.entries[name] = makeFile(content);
    }
    return '';
  }

  function readVirtualFile(pathStr) {
    const node = getNode(resolvePathSegments(pathStr));
    return node && node.type === 'file' ? node.content || '' : null;
  }

  function collectTextInput(args, stdin = '') {
    if (stdin !== '') return { text: stdin };
    const files = args.filter(arg => !arg.startsWith('-'));
    if (!files.length) return { text: null };
    const contents = [];
    for (const file of files) {
      const content = readVirtualFile(file);
      if (content === null) return { error: `No such file: ${file}` };
      contents.push(content);
    }
    return { text: contents.join('\n') };
  }

  const outputBlock = (value) => `<pre class="terminal-result">${escapeHtml(value)}</pre>`;

  const htmlToText = (html) => {
    if (!html) return '';
    const parser = document.createElement('div');
    parser.innerHTML = html;
    return parser.innerText || parser.textContent || '';
  };

  function getParentNode(pathStr) {
    const segments = resolvePathSegments(pathStr);
    const name = segments.pop();
    return { parent: getNode(segments), name, segments };
  }

  function listFiles(startSegments, visit, prefix = '') {
    const node = getNode(startSegments);
    if (!node || node.type !== 'dir') return;
    for (const [name, child] of Object.entries(node.entries)) {
      const childSegments = [...startSegments, name];
      const childPath = `${prefix}/${name}`;
      visit(child, childPath, childSegments);
      if (child.type === 'dir') listFiles(childSegments, visit, childPath);
    }
  }

  function tokenizeShell(source) {
    const tokens = [];
    let value = '';
    let quote = null;
    let escaped = false;
    let started = false;
    const operators = ['&&', '||', '>>', '2>', '|', ';', '>', '<'];

    const flush = () => {
      if (started) tokens.push({ type: 'word', value });
      value = '';
      started = false;
    };

    for (let i = 0; i < source.length; i++) {
      const char = source[i];
      if (escaped) { value += char; escaped = false; started = true; continue; }
      if (char === '\\' && quote !== "'") { escaped = true; started = true; continue; }
      if (quote) {
        if (char === quote) quote = null;
        else value += char;
        started = true;
        continue;
      }
      if (char === '"' || char === "'") { quote = char; started = true; continue; }
      if (char === '#' && !started) break;
      if (/\s/.test(char)) { flush(); continue; }

      const operator = operators.find((candidate) => source.startsWith(candidate, i));
      if (operator) {
        flush();
        tokens.push({ type: 'operator', value: operator });
        i += operator.length - 1;
        continue;
      }
      value += char;
      started = true;
    }
    if (escaped) value += '\\';
    flush();
    return tokens;
  }

  function parseShellLine(source) {
    const tokens = tokenizeShell(source);
    const groups = [];
    let segments = [];
    let current = [];
    let redirect = null;
    let connector = null;

    const finishSegment = () => {
      if (current.length) segments.push(current);
      current = [];
    };
    const finishGroup = () => {
      finishSegment();
      if (segments.length) groups.push({ segments, redirect, connector });
      segments = [];
      redirect = null;
    };

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === 'operator' && token.value === '|') {
        finishSegment();
        continue;
      }
      if (token.type === 'operator' && ['>', '>>', '2>'].includes(token.value)) {
        const target = tokens[i + 1];
        if (!target || target.type !== 'word') return { error: `syntax error near unexpected token '${token.value}'` };
        redirect = { mode: token.value, path: target.value };
        i++;
        continue;
      }
      if (token.type === 'operator' && token.value === '<') {
        const target = tokens[i + 1];
        if (!target || target.type !== 'word') return { error: "syntax error near unexpected token '<'" };
        redirect = { mode: '<', path: target.value };
        i++;
        continue;
      }
      if (token.type === 'operator' && [';', '&&', '||'].includes(token.value)) {
        finishGroup();
        connector = token.value;
        continue;
      }
      current.push(token.value);
    }
    finishGroup();

    if (segments.length || current.length) return { error: 'syntax error: incomplete command' };
    if (groups.length) groups[0].connector = null;
    return { groups };
  }

  function expandShellArgument(value) {
    return value.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)|\$\?/g, (match, braced, plain) => {
      if (match === '$?') return String(lastExitStatus);
      return shellVariables[braced || plain] ?? '';
    });
  }

  const openTerminal = () => {
    modal.classList.add('open');
    document.body.classList.add('terminal-open');
    updateTerminalClock();
    updatePromptDisplay();
    updateSystemMetrics();
    setTimeout(() => terminalInput.focus(), 150);
  };

  const closeTerminal = () => {
    modal.classList.remove('open');
    document.body.classList.remove('terminal-open');
    if (systemMetricsInterval) {
      window.clearInterval(systemMetricsInterval);
      systemMetricsInterval = null;
    }
  };

  openBtns.forEach(btn => btn.addEventListener('click', openTerminal));
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeTerminal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeTerminal();
  });

  // Shell Command Handlers
  const shellCommands = {
    // 1. ls [flags] [path]
    ls: (args) => {
      let showAll = false;
      let longFormat = false;
      let directoriesOnly = false;
      let recursive = false;
      const paths = [];

      for (let arg of args) {
        if (arg === '--help') return '<span>Usage: ls [-lahR] [PATH...]</span>';
        if (arg.startsWith('-') && arg.length > 1) {
          if (arg.includes('a')) showAll = true;
          if (arg.includes('l')) longFormat = true;
          if (arg.includes('d')) directoriesOnly = true;
          if (arg.includes('R')) recursive = true;
        } else {
          paths.push(arg);
        }
      }

      const targetPath = paths.length > 0 ? paths[0] : '';
      const targetSegs = resolvePathSegments(targetPath);
      const node = getNode(targetSegs);

      if (!node) {
        return `<span style="color:#f2d58c;">ls: cannot access '${escapeHtml(targetPath)}': No such file or directory</span>`;
      }

      if (node.type === 'file') {
        return longFormat
          ? `<div style="font-family:var(--font-mono); font-size:0.8rem;">${node.perms} 1 ${escapeHtml(node.owner)} ${escapeHtml(node.group)} ${escapeHtml(node.size.padStart(6, ' '))} ${escapeHtml(node.date)} <span style="color:#c6c8df;">${escapeHtml(targetSegs[targetSegs.length - 1])}</span></div>`
          : `<span style="color:#c6c8df;">${escapeHtml(targetSegs[targetSegs.length - 1])}</span>`;
      }

      if (directoriesOnly) return `<span style="color:#e6bd68; font-weight:bold;">${escapeHtml(targetPath || '.')}</span>`;
      if (recursive) return shellCommands.tree([targetPath]);

      const entries = Object.keys(node.entries).sort();
      const visible = showAll ? entries : entries.filter(e => !e.startsWith('.'));

      if (visible.length === 0) return '';

      if (longFormat) {
        let lines = [`<div style="color:#9293b2; font-size:0.75rem; margin-bottom:2px;">total ${visible.length * 4}</div>`];
        for (let name of visible) {
          const item = node.entries[name];
          const isDir = item.type === 'dir';
          const isExec = item.perms && item.perms.includes('x') && !isDir;
          const color = isDir ? '#e6bd68' : (isExec ? '#91b6ee' : (name.startsWith('.') ? '#aa8234' : '#c6c8df'));
          const suffix = isDir ? '/' : (isExec ? '*' : '');
          const sizeStr = (item.size || '4096').padStart(6, ' ');

          lines.push(`
            <div style="font-family:var(--font-mono); font-size:0.8rem; line-height:1.45;">
              <span style="color:#9293b2;">${escapeHtml(item.perms)}</span>
              <span style="color:#f2d58c;"> 1 ${escapeHtml(item.owner)} ${escapeHtml(item.group)}</span>
              <span style="color:#91b6ee;">${escapeHtml(sizeStr)}</span>
              <span style="color:#9293b2;"> ${escapeHtml(item.date)} </span>
              <span style="color:${color}; font-weight:${isDir ? 'bold' : 'normal'};">${escapeHtml(name)}${suffix}</span>
            </div>
          `);
        }
        return lines.join('');
      } else {
        const rendered = visible.map(name => {
          const item = node.entries[name];
          const isDir = item.type === 'dir';
          const isExec = item.perms && item.perms.includes('x') && !isDir;
          const color = isDir ? '#e6bd68' : (isExec ? '#91b6ee' : (name.startsWith('.') ? '#aa8234' : '#c6c8df'));
          const suffix = isDir ? '/' : (isExec ? '*' : '');
          return `<span style="color:${color}; font-weight:${isDir ? 'bold' : 'normal'}; margin-right:1.4rem; display:inline-block;">${escapeHtml(name)}${suffix}</span>`;
        });
        return `<div style="font-family:var(--font-mono); line-height:1.5;">${rendered.join('')}</div>`;
      }
    },

    ll: (args) => shellCommands.ls(['-lh', ...args]),
    la: (args) => shellCommands.ls(['-la', ...args]),

    // 2. cd [path]
    cd: (args) => {
      const target = args[0] || '~';
      const targetSegs = target === '-' ? [...previousCwd] : resolvePathSegments(target);
      const node = getNode(targetSegs);

      if (!node) {
        return `<span style="color:#f2d58c;">cd: no such file or directory: ${escapeHtml(target)}</span>`;
      }
      if (node.type !== 'dir') {
        return `<span style="color:#f2d58c;">cd: not a directory: ${escapeHtml(target)}</span>`;
      }

      previousCwd = [...cwd];
      cwd = targetSegs;
      updatePromptDisplay();
      return target === '-' ? shellCommands.pwd() : '';
    },

    // 3. cat <file...>
    cat: (args, stdin = '') => {
      if (args.length === 0) {
        return stdin ? outputBlock(stdin) : `<span style="color:#f2d58c;">cat: missing operand</span>`;
      }

      const outputs = [];
      for (let fileArg of args) {
        const targetSegs = resolvePathSegments(fileArg);
        const node = getNode(targetSegs);

        if (!node) {
          outputs.push(`<span style="color:#f2d58c;">cat: ${escapeHtml(fileArg)}: No such file or directory</span>`);
          continue;
        }
        if (node.type === 'dir') {
          outputs.push(`<span style="color:#f2d58c;">cat: ${escapeHtml(fileArg)}: Is a directory</span>`);
          continue;
        }

        const escaped = (node.content || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        outputs.push(`<pre style="font-family:var(--font-mono); font-size:0.82rem; color:#c6c8df; margin:0.3rem 0; white-space:pre-wrap; line-height:1.45;">${escaped}</pre>`);
      }
      return outputs.join('');
    },

    // 4. pwd
    pwd: () => {
      return `<div style="color:#e6bd68; font-family:var(--font-mono); font-size:0.83rem;">/${escapeHtml(cwd.join('/'))}</div>`;
    },

    // 5. tree [path]
    tree: (args) => {
      const targetPath = args[0] || '';
      const targetSegs = resolvePathSegments(targetPath);
      const node = getNode(targetSegs);

      if (!node || node.type !== 'dir') {
        return `<span style="color:#f2d58c;">tree: '${escapeHtml(targetPath)}': No such directory</span>`;
      }

      let countDirs = 0;
      let countFiles = 0;

      function renderTree(dirNode, prefix = '') {
        let lines = [];
        const keys = Object.keys(dirNode.entries).filter(k => !k.startsWith('.')).sort();

        for (let i = 0; i < keys.length; i++) {
          const name = keys[i];
          const item = dirNode.entries[name];
          const isLast = i === keys.length - 1;
          const branch = isLast ? '└── ' : '├── ';
          const nextPrefix = prefix + (isLast ? '    ' : '│   ');

          if (item.type === 'dir') {
            countDirs++;
            lines.push(`<div style="font-family:var(--font-mono); font-size:0.8rem;"><span style="color:#9293b2;">${prefix}${branch}</span><span style="color:#e6bd68; font-weight:bold;">${escapeHtml(name)}/</span></div>`);
            lines.push(...renderTree(item, nextPrefix));
          } else {
            countFiles++;
            const isExec = item.perms && item.perms.includes('x');
            const color = isExec ? '#91b6ee' : '#c6c8df';
            lines.push(`<div style="font-family:var(--font-mono); font-size:0.8rem;"><span style="color:#9293b2;">${prefix}${branch}</span><span style="color:${color};">${escapeHtml(name)}</span></div>`);
          }
        }
        return lines;
      }

      const rootLabel = targetSegs.length === 0 ? '/' : targetSegs[targetSegs.length - 1];
      const treeLines = [
        `<div style="color:#e6bd68; font-weight:bold; font-family:var(--font-mono);">${escapeHtml(rootLabel)}</div>`,
        ...renderTree(node),
        `<div style="color:#9293b2; font-size:0.75rem; margin-top:4px;">${countDirs} directories, ${countFiles} files</div>`
      ];

      return treeLines.join('');
    },

    // 6. whoami
    whoami: () => `
<div style="color:#91b6ee; font-weight:700;">AkilesTheDark</div>
`,

    // 7. id
    id: () => `
<div style="color:#e6bd68; font-family:var(--font-mono); font-size:0.82rem;">uid=1000(AkilesTheDark) gid=1000(AkilesTheDark) groups=1000(AkilesTheDark),4(adm),24(cdrom),27(sudo),100(redteam),1337(nanite-core)</div>
`,

    // 8. uname [-a]
    uname: (args) => {
      if (args.includes('-a')) {
        return `<div style="color:#e6bd68; font-family:var(--font-mono); font-size:0.82rem;">Linux nanite-os 6.8.0-rex #1 SMP PREEMPT Providence x86_64 GNU/Linux</div>`;
      }
      return `<div style="color:#e6bd68; font-family:var(--font-mono); font-size:0.82rem;">Linux</div>`;
    },

    // 9. echo [text]
    echo: (args) => {
      const noNewline = args[0] === '-n';
      const words = noNewline ? args.slice(1) : args;
      const text = words.join(' ').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      return outputBlock(noNewline ? text : `${text}\n`);
    },

    // 10. head / tail
    head: (args, stdin = '') => {
      let count = 10;
      let file = '';
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' && args[i + 1]) count = Math.max(0, Number(args[++i]) || 10);
        else if (args[i].startsWith('-') && /^-\d+$/.test(args[i])) count = Number(args[i].slice(1));
        else file = args[i];
      }
      const content = stdin || (file ? readVirtualFile(file) : null);
      if (content === null) return `<span style="color:#f2d58c;">head: missing file operand</span>`;
      return outputBlock(content.split('\n').slice(0, count).join('\n'));
    },

    tail: (args, stdin = '') => {
      let count = 10;
      let file = '';
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' && args[i + 1]) count = Math.max(0, Number(args[++i]) || 10);
        else if (args[i].startsWith('-') && /^-\d+$/.test(args[i])) count = Number(args[i].slice(1));
        else file = args[i];
      }
      const content = stdin || (file ? readVirtualFile(file) : null);
      if (content === null) return `<span style="color:#f2d58c;">tail: missing file operand</span>`;
      const lines = content.split('\n');
      return outputBlock(lines.slice(count === 0 ? lines.length : -count).join('\n'));
    },

    // 11. grep <pattern> <file>
    grep: (args, stdin = '') => {
      const ignoreCase = args.includes('-i');
      const showLineNumber = args.includes('-n');
      const invert = args.includes('-v');
      const cleanArgs = args.filter(arg => !['-i', '-n', '-v'].includes(arg));
      const term = cleanArgs[0];
      if (!term) return `<span style="color:#f2d58c;">Usage: grep [-invr] PATTERN [FILE...]</span>`;
      const files = cleanArgs.slice(1);
      let sources = stdin ? [{ name: '', text: stdin }] : files.map(file => ({ name: file, text: readVirtualFile(file) }));
      if (!sources.length) return `<span style="color:#f2d58c;">grep: provide a file or pipe input</span>`;
      if (sources.some(source => source.text === null)) {
        const missing = sources.find(source => source.text === null).name;
        return `<span style="color:#f2d58c;">grep: ${escapeHtml(missing)}: No such file</span>`;
      }
      const needle = ignoreCase ? term.toLowerCase() : term;
      const matches = [];
      for (const source of sources) {
        source.text.split('\n').forEach((line, index) => {
          const haystack = ignoreCase ? line.toLowerCase() : line;
          if (invert ? !haystack.includes(needle) : haystack.includes(needle)) {
            const label = sources.length > 1 ? `${source.name}:` : '';
            matches.push(`${label}${showLineNumber ? `${index + 1}:` : ''}${line}`);
          }
        });
      }
      return outputBlock(matches.join('\n'));
    },

    // 12. date
    date: () => {
      return `<div style="color:#e6bd68; font-family:var(--font-mono); font-size:0.82rem;">${new Date().toUTCString()}</div>`;
    },

    // 13. history
    history: (args) => {
      if (args.includes('-c')) { commandHistory.length = 0; historyIndex = 0; return ''; }
      return outputBlock(commandHistory.map((cmd, i) => `${String(i + 1).padStart(4)}  ${cmd}`).join('\n'));
    },

    // 14. clear
    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    },

    // 15. exit / quit
    exit: () => {
      closeTerminal();
      return '<span style="color:#9293b2;">Session disengaged.</span>';
    },

    quit: () => {
      closeTerminal();
      return '<span style="color:#9293b2;">Session disengaged.</span>';
    },

    // File creation, movement and permissions operate only inside the virtual filesystem.
    mkdir: (args) => {
      const parents = args.includes('-p');
      const paths = args.filter(arg => arg !== '-p');
      if (!paths.length) return '<span style="color:#f2d58c;">mkdir: missing operand</span>';
      const errors = [];
      for (const path of paths) {
        const segments = resolvePathSegments(path);
        if (!segments.length) { errors.push(`mkdir: cannot create root directory`); continue; }
        if (parents) {
          let node = vfs;
          for (const segment of segments) {
            if (!node.entries[segment]) node.entries[segment] = makeDirectory();
            if (node.entries[segment].type !== 'dir') { errors.push(`mkdir: '${path}': Not a directory`); break; }
            node = node.entries[segment];
          }
        } else {
          const { parent, name } = getParentNode(path);
          if (!parent || parent.type !== 'dir') errors.push(`mkdir: '${path}': parent directory not found`);
          else if (parent.entries[name]) errors.push(`mkdir: cannot create directory '${path}': File exists`);
          else parent.entries[name] = makeDirectory();
        }
      }
      return errors.length ? outputBlock(errors.join('\n')) : '';
    },

    touch: (args) => {
      const paths = args.filter(arg => !arg.startsWith('-'));
      if (!paths.length) return '<span style="color:#f2d58c;">touch: missing file operand</span>';
      const errors = [];
      for (const path of paths) {
        const { parent, name } = getParentNode(path);
        if (!name || !parent || parent.type !== 'dir') errors.push(`touch: cannot touch '${path}': No such directory`);
        else if (parent.entries[name]?.type === 'dir') errors.push(`touch: '${path}' is a directory`);
        else if (parent.entries[name]) parent.entries[name].date = new Date().toLocaleString();
        else parent.entries[name] = makeFile('');
      }
      return errors.length ? outputBlock(errors.join('\n')) : '';
    },

    rm: (args) => {
      const flags = args.filter(arg => arg.startsWith('-')).join('');
      const recursive = /r/i.test(flags);
      const force = flags.includes('f');
      const paths = args.filter(arg => !arg.startsWith('-'));
      if (!paths.length) return '<span style="color:#f2d58c;">rm: missing operand</span>';
      const errors = [];
      for (const path of paths) {
        const segments = resolvePathSegments(path);
        if (!segments.length) { errors.push("rm: refusing to remove '/'"); continue; }
        if (cwd.length >= segments.length && segments.every((part, index) => cwd[index] === part)) {
          errors.push(`rm: cannot remove '${path}': directory is the current working directory`);
          continue;
        }
        const { parent, name } = getParentNode(path);
        const node = parent?.entries?.[name];
        if (!node) { if (!force) errors.push(`rm: cannot remove '${path}': No such file or directory`); continue; }
        if (node.type === 'dir' && !recursive) { errors.push(`rm: cannot remove '${path}': Is a directory (use -r)`); continue; }
        delete parent.entries[name];
      }
      return errors.length ? outputBlock(errors.join('\n')) : '';
    },

    cp: (args) => {
      const recursive = args.some(arg => arg === '-r' || arg === '-R');
      const paths = args.filter(arg => !arg.startsWith('-'));
      if (paths.length < 2) return '<span style="color:#f2d58c;">cp: usage: cp [-r] SOURCE DEST</span>';
      const source = getNode(resolvePathSegments(paths[0]));
      if (!source) return `<span style="color:#f2d58c;">cp: '${escapeHtml(paths[0])}': No such file or directory</span>`;
      if (source.type === 'dir' && !recursive) return '<span style="color:#f2d58c;">cp: omitting directory (use -r)</span>';
      let destination = resolvePathSegments(paths[1]);
      const destNode = getNode(destination);
      if (destNode?.type === 'dir') destination = [...destination, paths[0].split('/').filter(Boolean).pop()];
      const sourceSegments = resolvePathSegments(paths[0]);
      if (source.type === 'dir' && destination.length > sourceSegments.length && sourceSegments.every((part, index) => destination[index] === part)) return '<span style="color:#f2d58c;">cp: cannot copy a directory into itself</span>';
      const name = destination.pop();
      const parent = getNode(destination);
      if (!parent || parent.type !== 'dir') return `<span style="color:#f2d58c;">cp: cannot create '${escapeHtml(paths[1])}': No such directory</span>`;
      parent.entries[name] = JSON.parse(JSON.stringify(source));
      return '';
    },

    mv: (args) => {
      const paths = args.filter(arg => !arg.startsWith('-'));
      if (paths.length < 2) return '<span style="color:#f2d58c;">mv: usage: mv SOURCE DEST</span>';
      const sourceSegments = resolvePathSegments(paths[0]);
      if (!sourceSegments.length) return '<span style="color:#f2d58c;">mv: refusing to move root</span>';
      const sourceInfo = getParentNode(paths[0]);
      const source = sourceInfo.parent?.entries?.[sourceInfo.name];
      if (!source) return `<span style="color:#f2d58c;">mv: cannot stat '${escapeHtml(paths[0])}': No such file</span>`;
      let destination = resolvePathSegments(paths[1]);
      if (getNode(destination)?.type === 'dir') destination.push(sourceInfo.name);
      if (sourceSegments.join('/') === destination.join('/')) return '';
      if (source.type === 'dir' && destination.length > sourceSegments.length && sourceSegments.every((part, index) => destination[index] === part)) return '<span style="color:#f2d58c;">mv: cannot move a directory into itself</span>';
      const name = destination.pop();
      const parent = getNode(destination);
      if (!parent || parent.type !== 'dir') return `<span style="color:#f2d58c;">mv: cannot move to '${escapeHtml(paths[1])}': No such directory</span>`;
      if (source.type === 'dir' && cwd.length >= sourceSegments.length && sourceSegments.every((part, index) => cwd[index] === part)) return '<span style="color:#f2d58c;">mv: cannot move the current working directory</span>';
      parent.entries[name] = source;
      delete sourceInfo.parent.entries[sourceInfo.name];
      return '';
    },

    chmod: (args) => {
      const paths = [...args];
      if (paths.length < 2) return '<span style="color:#f2d58c;">chmod: usage: chmod MODE FILE</span>';
      const mode = paths.shift();
      const errors = [];
      for (const path of paths) {
        const node = getNode(resolvePathSegments(path));
        if (!node || node.type !== 'file') { errors.push(`chmod: cannot access '${path}'`); continue; }
        if (/^[0-7]{3,4}$/.test(mode)) {
          const digits = mode.slice(-3).split('').map(Number);
          const bits = ['r', 'w', 'x'];
          node.perms = '-' + digits.map(digit => bits.map((bit, index) => digit & (4 >> index) ? bit : '-').join('')).join('');
        } else if (/^[ugoa]*[+-][rwx]+$/.test(mode)) {
          const [, scope = '', sign, permissions] = mode.match(/^([ugoa]*)([+-])([rwx]+)$/);
          const groups = { u: 0, g: 1, o: 2 };
          const classes = scope.includes('a') || !scope ? [0, 1, 2] : [...new Set([...scope].map(letter => groups[letter]).filter(index => index !== undefined))];
          const chars = ['r', 'w', 'x'];
          for (const classIndex of classes) {
            for (const permission of permissions) {
              const position = 1 + classIndex * 3 + chars.indexOf(permission);
              node.perms = node.perms.slice(0, position) + (sign === '+' ? permission : '-') + node.perms.slice(position + 1);
            }
          }
        } else { errors.push(`chmod: invalid mode '${mode}'`); }
      }
      return errors.length ? outputBlock(errors.join('\n')) : '';
    },

    find: (args) => {
      let start = '.';
      let namePattern = '*';
      let typeFilter = '';
      const positional = [];
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-name' && args[i + 1]) namePattern = args[++i];
        else if (args[i] === '-type' && args[i + 1]) typeFilter = args[++i];
        else if (!args[i].startsWith('-')) positional.push(args[i]);
      }
      if (positional.length) start = positional[0];
      const startSegments = resolvePathSegments(start);
      const startNode = getNode(startSegments);
      if (!startNode) return `<span style="color:#f2d58c;">find: '${escapeHtml(start)}': No such file or directory</span>`;
      const matcher = new RegExp('^' + namePattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
      const results = [];
      if (matcher.test(startSegments.at(-1) || '/')) results.push('/' + startSegments.join('/'));
      if (startNode.type === 'dir') listFiles(startSegments, (node, path, segments) => {
        if (matcher.test(segments[segments.length - 1]) && (!typeFilter || (typeFilter === 'd' ? node.type === 'dir' : node.type === 'file'))) results.push(start === '.' ? '.' + path : '/' + segments.join('/'));
      });
      return outputBlock(results.join('\n'));
    },

    stat: (args) => {
      const path = args[0];
      if (!path) return '<span style="color:#f2d58c;">stat: missing operand</span>';
      const segments = resolvePathSegments(path);
      const node = getNode(segments);
      if (!node) return `<span style="color:#f2d58c;">stat: cannot stat '${escapeHtml(path)}'</span>`;
      return outputBlock(`  File: ${path}\n  Type: ${node.type}\n  Size: ${node.size}\nAccess: (${node.perms})  Uid: (${node.owner})  Gid: (${node.group})\nModify: ${node.date}`);
    },

    file: (args) => {
      const path = args[0];
      if (!path) return '<span style="color:#f2d58c;">file: missing operand</span>';
      const node = getNode(resolvePathSegments(path));
      if (!node) return `<span style="color:#f2d58c;">${escapeHtml(path)}: cannot open</span>`;
      return outputBlock(`${path}: ${node.type === 'dir' ? 'directory' : /\.\w+$/.test(path) ? path.split('.').pop().toUpperCase() + ' text' : 'regular text file'}`);
    },


    wc: (args, stdin = '') => {
      const flags = args.filter(arg => arg.startsWith('-')).join('');
      const input = collectTextInput(args, stdin);
      if (input.error) return `<span style="color:#f2d58c;">wc: ${escapeHtml(input.error)}</span>`;
      if (input.text === null) return '<span style="color:#f2d58c;">wc: missing operand</span>';
      const lines = input.text ? input.text.split('\n').length : 0;
      const words = input.text.trim() ? input.text.trim().split(/\s+/).length : 0;
      const bytes = new Blob([input.text]).size;
      const values = [];
      if (!flags || flags.includes('l')) values.push(lines);
      if (!flags || flags.includes('w')) values.push(words);
      if (!flags || flags.includes('c')) values.push(bytes);
      return outputBlock(values.map(value => String(value).padStart(8)).join(' ') + (stdin ? '' : `  ${args.filter(arg => !arg.startsWith('-')).join(' ')}`));
    },

    sort: (args, stdin = '') => {
      const input = collectTextInput(args, stdin);
      if (input.error) return `<span style="color:#f2d58c;">sort: ${escapeHtml(input.error)}</span>`;
      if (input.text === null) return '<span style="color:#f2d58c;">sort: provide a file or pipe input</span>';
      const reverse = args.includes('-r');
      const numeric = args.includes('-n');
      const lines = input.text.split('\n').sort(numeric ? (a, b) => Number(a) - Number(b) : undefined);
      if (reverse) lines.reverse();
      return outputBlock(lines.join('\n'));
    },

    uniq: (args, stdin = '') => {
      const input = collectTextInput(args, stdin);
      if (input.error) return `<span style="color:#f2d58c;">uniq: ${escapeHtml(input.error)}</span>`;
      if (input.text === null) return '<span style="color:#f2d58c;">uniq: provide a file or pipe input</span>';
      const count = args.includes('-c');
      const output = [];
      for (const line of input.text.split('\n')) {
        if (output.length && output[output.length - 1].line === line) output[output.length - 1].count++;
        else output.push({ line, count: 1 });
      }
      return outputBlock(output.map(item => count ? `${String(item.count).padStart(4)} ${item.line}` : item.line).join('\n'));
    },

    cut: (args, stdin = '') => {
      let delimiter = '\t';
      let fieldSpec = '';
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-d' && args[i + 1]) delimiter = args[++i];
        else if (args[i] === '-f' && args[i + 1]) fieldSpec = args[++i];
      }
      if (!fieldSpec) return '<span style="color:#f2d58c;">cut: usage: cut -d DELIMITER -f FIELDS [FILE]</span>';
      const input = collectTextInput(stdin ? [] : args.slice(-1), stdin);
      if (input.error) return `<span style="color:#f2d58c;">cut: ${escapeHtml(input.error)}</span>`;
      if (input.text === null) return '<span style="color:#f2d58c;">cut: provide a file or pipe input</span>';
      const indexes = fieldSpec.split(',').map(field => Number(field) - 1).filter(index => index >= 0);
      return outputBlock(input.text.split('\n').map(line => line.split(delimiter).filter((_, index) => indexes.includes(index)).join(delimiter)).join('\n'));
    },

    tr: (args, stdin = '') => {
      const deleteMode = args[0] === '-d';
      const sets = deleteMode ? args.slice(1, 2) : args.slice(0, 2);
      let input = stdin;
      if (!input && args.length > (deleteMode ? 2 : 2)) input = readVirtualFile(args.at(-1));
      if (input === null) return '<span style="color:#f2d58c;">tr: cannot read input file</span>';
      if (sets.length < 1 || (!deleteMode && sets.length < 2)) return '<span style="color:#f2d58c;">tr: usage: tr [-d] SET1 [SET2]</span>';
      const from = [...sets[0]];
      if (deleteMode) return outputBlock([...input].filter(char => !from.includes(char)).join(''));
      const to = [...sets[1]];
      return outputBlock([...input].map(char => {
        const index = from.indexOf(char);
        return index < 0 ? char : (to[index] ?? to.at(-1) ?? '');
      }).join(''));
    },

    rev: (args, stdin = '') => {
      const input = collectTextInput(args, stdin);
      if (input.error) return `<span style="color:#f2d58c;">rev: ${escapeHtml(input.error)}</span>`;
      if (input.text === null) return '<span style="color:#f2d58c;">rev: provide a file or pipe input</span>';
      return outputBlock(input.text.split('\n').map(line => [...line].reverse().join('')).join('\n'));
    },

    sed: (args, stdin = '') => {
      const expression = args.find(arg => /^s\/.*\/.*\/[gim]*$/.test(arg));
      if (!expression) return '<span style="color:#f2d58c;">sed: supported form: sed s/old/new/g FILE</span>';
      const match = expression.match(/^s\/(.*)\/(.*)\/([gim]*)$/);
      const [, search, replacement, flags = ''] = match;
      const input = collectTextInput(args.filter(arg => arg !== expression), stdin);
      if (input.error) return `<span style="color:#f2d58c;">sed: ${escapeHtml(input.error)}</span>`;
      if (input.text === null) return '<span style="color:#f2d58c;">sed: provide a file or pipe input</span>';
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return outputBlock(input.text.replace(new RegExp(escapedSearch, flags), replacement));
    },

    printf: (args) => {
      if (!args.length) return '';
      const format = args[0].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      let valueIndex = 1;
      return outputBlock(format.replace(/%([sdif%])/g, (_, code) => {
        if (code === '%') return '%';
        const value = args[valueIndex++] ?? '';
        return code === 'd' || code === 'i' ? String(parseInt(value, 10) || 0) : value;
      }));
    },

    seq: (args) => {
      const nums = args.map(Number);
      if (!nums.length || nums.some(value => !Number.isFinite(value))) return '<span style="color:#f2d58c;">seq: usage: seq [FIRST [INCREMENT]] LAST</span>';
      const first = nums.length === 1 ? 1 : nums[0];
      const increment = nums.length === 3 ? nums[1] : 1;
      const last = nums.length === 1 ? nums[0] : nums.at(-1);
      if (!increment || Math.abs((last - first) / increment) > 1000) return '<span style="color:#f2d58c;">seq: invalid or excessive range</span>';
      const output = [];
      for (let value = first; increment > 0 ? value <= last : value >= last; value += increment) output.push(value);
      return outputBlock(output.join('\n'));
    },

    basename: (args) => outputBlock(args[0] ? args[0].replace(/\/$/, '').split('/').pop() : 'basename: missing operand'),
    dirname: (args) => {
      if (!args[0]) return outputBlock('dirname: missing operand');
      const parts = args[0].replace(/\/$/, '').split('/');
      return outputBlock(parts.length > 1 ? (parts.slice(0, -1).join('/') || '/') : '.');
    },
    realpath: (args) => {
      if (!args[0]) return outputBlock(`/${cwd.join('/')}`);
      const path = resolvePathSegments(args[0]);
      return getNode(path) ? outputBlock('/' + path.join('/')) : `<span style="color:#f2d58c;">realpath: '${escapeHtml(args[0])}': No such file</span>`;
    },
    hostname: () => outputBlock('nanite-os'),
    uptime: () => outputBlock(` ${Math.floor(performance.now() / 1000)}s  up 1 user,  load average: 0.08, 0.12, 0.09`),
    env: () => outputBlock(Object.entries(shellVariables).map(([name, value]) => `${name}=${value}`).join('\n')),
    printenv: (args) => args[0] ? outputBlock(shellVariables[args[0]] ?? '') : shellCommands.env(),
    export: (args) => {
      const errors = [];
      for (const assignment of args) {
        const match = assignment.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
        if (!match) errors.push(`export: '${assignment}': expected NAME=value`);
        else shellVariables[match[1]] = match[2];
      }
      return errors.length ? outputBlock(errors.join('\n')) : '';
    },
    unset: (args) => {
      for (const name of args) if (!['HOME', 'USER', 'PWD', 'SHELL', 'PATH'].includes(name)) delete shellVariables[name];
      return '';
    },
    which: (args) => {
      if (!args.length) return '<span style="color:#f2d58c;">which: missing command name</span>';
      const missing = args.filter(name => !Object.prototype.hasOwnProperty.call(shellCommands, name) && !vfs.entries.bin.entries[name]);
      return outputBlock(args.filter(name => !missing.includes(name)).map(name => vfs.entries.bin.entries[name] ? `/bin/${name}` : `/usr/bin/${name}`).concat(missing.map(name => `${name} not found`)).join('\n'));
    },
    df: () => outputBlock('Filesystem        Size  Used Avail Use% Mounted on\n/dev/nanite-root    24G  8.2G   15G  36% /\nnanite-vfs         128M   12M  116M  10% /home/AkilesTheDark'),
    free: () => outputBlock('              total        used        free      shared  buff/cache   available\nMem:           7.7Gi       2.1Gi       3.8Gi       128Mi       1.8Gi       5.2Gi\nSwap:          2.0Gi          0B       2.0Gi'),
    ps: () => outputBlock('  PID TTY          TIME CMD\n    1 ?        00:00:02 systemd\n  412 pts/0    00:00:00 bash\n  581 pts/0    00:00:00 nanite-monitor\n  620 pts/0    00:00:00 ps'),
    top: () => outputBlock('Nanite OS process monitor (snapshot)\nTasks: 42 total, 1 running, 41 sleeping\n%Cpu(s):  2.4 us,  1.1 sy, 96.5 id\nMiB Mem:  7892.0 total, 2134.0 used, 3750.0 free\n\n  PID USER      %CPU %MEM COMMAND\n  581 AkilesTheDark    1.2  0.8 nanite-monitor\n  412 AkilesTheDark    0.3  0.1 bash'),
    ping: (args) => args.length ? outputBlock(`PING ${args.at(-1)} (simulation)\nNetwork access is disabled in this browser terminal.\n\n--- ${args.at(-1)} ping statistics ---\n4 packets transmitted, 0 received, 100% packet loss`) : '<span style="color:#f2d58c;">ping: missing host operand</span>',
    curl: (args) => args.length ? outputBlock('Network requests are disabled in this browser terminal. Use the virtual filesystem to inspect local profile data.') : '<span style="color:#f2d58c;">curl: try curl URL</span>',
    man: () => shellCommands.help(),
    reset: () => { terminalOutput.innerHTML = ''; return ''; },

    // 16. Generator Rex Diagnostics
    overdrive: () => {
      const newState = window.GeneratorRexEngine.toggleOverdrive();
      return `
<div style="color:#91b6ee; font-weight:700;">// NANITE OVERDRIVE MODE: ${newState ? 'ENGAGED [MAX SURGE]' : 'DISENGAGED [STANDARD]'}</div>
<div>Nanite cores shifted to ${newState ? '#91b6ee (Blazing Amber)' : '#e6bd68 (Signal Red)'}.</div>
<div>Gear rotation velocity ${newState ? 'accelerated to 2.4x with increased mesh spark rate' : 'normalized to nominal baseline'}.</div>
`;
    },

    nanites: () => {
      const isOD = window.GeneratorRexEngine.isOverdrive;
      return `
<div style="color:#e6bd68; font-weight:700;">// NANITE SWARM TELEMETRY &mdash; PROVIDENCE SUITE</div>
<div>* Swarm Density:      100% [Nominal Swarm Active]</div>
<div>* Mode:               <span style="color:${isOD ? '#91b6ee' : '#e6bd68'}; font-weight:bold;">${isOD ? 'REX OVERDRIVE [100% SURGE]' : 'PROVIDENCE [STANDARD TECH]'}</span></div>
<div>* Body:               Glass-encased golden orb</div>
<div>* Rods:               6 dark spikes with varied lengths</div>
<div>* Electrical State:   Intermittent red-gold crackle</div>
<div>* Descent:            ${isOD ? 'accelerated' : 'steady'} vertical drift with gold trails</div>
<div>* Directive:           Autonomous Vulnerability Enumeration &amp; Exploitation</div>
`;
    },

    gears: () => `
<div style="color:#e6bd68; font-weight:700;">// MECHANICAL GEAR &amp; PISTON TELEMETRY</div>
<div>* Cluster A (Slam Cannon):  24T / 14T / 8T Involute Spur Train [Ratio 1:3.0]</div>
<div>* Cluster B (Punk Busters): 20T / 12T Heavy Crank Gear + Live Reciprocating Piston</div>
<div>* Piston Stroke:            64mm displacement @ 4,800 PSI hydraulic rating</div>
<div>* Profile Standard:         Full-depth involute teeth with lightening spoke windows</div>
<div>* Mesh Physics:             Kinematic tooth velocity matching + pitch contact sparks</div>
`,

    scan: () => `
<div style="color:#e6bd68; font-weight:700;">// PROVIDENCE MOLECULAR SCANNING SEQUENCE</div>
<div>[========================================] 100% SCAN COMPLETE</div>
<div>* Foreign EVO Mutagens:   <span style="color:#91b6ee;">NONE DETECTED (0.00%)</span></div>
<div>* Nanite Cohesion:         <span style="color:#91b6ee;">99.8% STABLE</span></div>
<div>* Omega-1 Nanite Presence: <span style="color:#91b6ee;">ACTIVE // DORMANT RECEPTORS READY</span></div>
<div>* Threat Classification:   SECURE // OPERATOR AkilesTheDark AUTHORIZED</div>
`,

    // 17. Help Manual
    help: () => outputBlock(`FILES & NAVIGATION
  ls -lah [path]       list files, including hidden files and details
  ll, la               common listing shortcuts
  cd [path]            change directory; supports ~, .., and cd -
  pwd                  print the current directory
  tree [path]          show a directory tree
  mkdir -p PATH        create directories
  touch FILE           create a file
  cp -r SRC DEST       copy files or directories
  mv SRC DEST          move or rename a file
  rm -r PATH           remove a file or directory in this virtual system
  chmod MODE FILE      change simulated permissions
  find PATH -name GLOB search the virtual filesystem

READING & TEXT TOOLS
  cat FILE             print a file (cat also accepts piped input)
  head/tail -n N FILE  print the first or last N lines
  grep -in PAT FILE    search file contents
  wc [-lwc] FILE       count lines, words, and bytes
  sort [-rn] FILE      sort lines
  uniq [-c] FILE       remove adjacent duplicate lines
  cut -d , -f 1 FILE   select delimited fields
  sed 's/old/new/g' F  replace literal text
  tr SET1 SET2         translate characters from piped input
  rev, printf, seq     reverse, format, or generate text

SYSTEM & SESSION
  whoami, id, uname    operator and system information
  date, uptime         clock and session uptime
  env, export, unset   inspect or change shell variables; printenv reads one variable
  which, history       command paths, command history (!N and !! recall commands)
  ps, top, free, df    simulated process and resource reports
  ping HOST, curl URL  offline network simulations (no requests are sent)
  clear, reset, exit   clear screen, reset, or close the terminal

REX DIAGNOSTICS
  overdrive, nanites, gears, scan

SHELL FEATURES
  Quotes: echo "hello world"    Variables: $HOME $USER $PWD
  Pipes:  cat file | grep Rex    Redirect: echo text > note.txt
  Chain:  mkdir notes && cd notes; pwd
  Keys:   ↑/↓ history, Tab completion, Ctrl+L clear, Ctrl+C cancel`),
  };

  // Command Execution Dispatcher
  let lastExitStatus = 0;
  const executeCommand = (rawCmd) => {
    let trimmed = rawCmd.trim();
    if (!trimmed) return;

    if (trimmed === '!!' && commandHistory.length) trimmed = commandHistory[commandHistory.length - 1];
    const historyRecall = trimmed.match(/^!(\d+)$/);
    if (historyRecall) trimmed = commandHistory[Number(historyRecall[1]) - 1] || trimmed;

    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    const pStr = getPromptStr();
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<div class="terminal-prompt-context"><span class="terminal-prompt-edge">┌──(</span><span class="terminal-user-name">AkilesTheDark</span><span class="terminal-host-name">㉿nanite-os</span><span class="terminal-prompt-edge">)-[</span><span class="terminal-prompt-path">${escapeHtml(pStr)}</span><span class="terminal-prompt-edge">]</span></div><div class="terminal-prompt-row"><span class="terminal-prompt-user">└─$</span> <span class="terminal-command-text">${escapeHtml(trimmed)}</span></div>`;
    terminalOutput.appendChild(cmdLine);

    const parsed = parseShellLine(trimmed);
    if (parsed.error) {
      const errorLine = document.createElement('div');
      errorLine.className = 'terminal-line';
      errorLine.innerHTML = `<span style="color:#f2d58c;">${escapeHtml(parsed.error)}</span>`;
      terminalOutput.appendChild(errorLine);
      lastExitStatus = 2;
    } else {
      for (const group of parsed.groups) {
        if (group.connector === '&&' && lastExitStatus !== 0) continue;
        if (group.connector === '||' && lastExitStatus === 0) continue;

        let stdin = '';
        let finalOutput = '';
        let status = 0;
        if (group.redirect?.mode === '<') {
          const redirectedInput = readVirtualFile(group.redirect.path);
          if (redirectedInput === null) {
            finalOutput = `<span style="color:#f2d58c;">${escapeHtml(group.redirect.path)}: No such file</span>`;
            status = 1;
          } else stdin = redirectedInput;
        }

        if (!status) {
          for (const words of group.segments) {
            if (!words.length) continue;
            const expanded = words.map(expandShellArgument);
            const cmd = expanded[0].toLowerCase();
            const args = expanded.slice(1);
            if (!Object.prototype.hasOwnProperty.call(shellCommands, cmd)) {
              finalOutput = `<span style="color:#f2d58c;">bash: ${escapeHtml(cmd)}: command not found. Type <span style="color:#e6bd68;">help</span> for available commands.</span>`;
              stdin = htmlToText(finalOutput);
              status = 127;
              continue;
            }

            finalOutput = shellCommands[cmd](args, stdin);
            stdin = htmlToText(finalOutput);
            if (/^(bash:|.*: (?:No such file|missing operand|cannot |invalid mode|usage:))/i.test(stdin.trim())) status = 1;
            else status = 0;
          }
        }

        if (group.redirect && group.redirect.mode !== '<') {
          if (group.redirect.mode === '2>' && status === 0) {
            if (finalOutput) {
              const resultLine = document.createElement('div');
              resultLine.className = 'terminal-line';
              resultLine.innerHTML = finalOutput;
              terminalOutput.appendChild(resultLine);
            }
          } else {
            const redirectError = writeVirtualFile(group.redirect.path, htmlToText(finalOutput), group.redirect.mode === '>>');
            if (redirectError) {
              const errorLine = document.createElement('div');
              errorLine.className = 'terminal-line';
              errorLine.innerHTML = `<span style="color:#f2d58c;">${escapeHtml(redirectError)}</span>`;
              terminalOutput.appendChild(errorLine);
              status = 1;
            }
          }
        } else if (finalOutput) {
          const resultLine = document.createElement('div');
          resultLine.className = 'terminal-line';
          resultLine.innerHTML = finalOutput;
          terminalOutput.appendChild(resultLine);
        }

        lastExitStatus = status;
      }
    }

    while (terminalOutput.children.length > 240) terminalOutput.removeChild(terminalOutput.firstElementChild);

    const body = modal.querySelector('.terminal-body');
    if (body) body.scrollTop = body.scrollHeight;
  };

  // Keyboard navigation & Tab auto-completion
  terminalInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      terminalOutput.innerHTML = '';
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      const interrupted = terminalInput.value;
      terminalInput.value = '';
      const cancelLine = document.createElement('div');
      cancelLine.className = 'terminal-line';
      cancelLine.innerHTML = `<span style="color:#91b6ee;">${escapeHtml(promptLabel?.textContent || 'AkilesTheDark@nanite-os:~$')}</span> ${escapeHtml(interrupted)} <span style="color:#f2d58c;">^C</span>`;
      terminalOutput.appendChild(cancelLine);
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'd' && !terminalInput.value) {
      e.preventDefault();
      closeTerminal();
      return;
    }

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
    } else if (e.key === 'Tab') {
      // Tab Auto-Completion
      e.preventDefault();
      const val = terminalInput.value;
      const tokens = val.split(' ');
      const lastToken = tokens[tokens.length - 1];

      if (tokens.length === 1) {
        // Complete command name
        const candidates = Object.keys(shellCommands).filter(c => c.startsWith(lastToken.toLowerCase()));
        if (candidates.length === 1) {
          terminalInput.value = candidates[0] + ' ';
        } else if (candidates.length > 1) {
          const listLine = document.createElement('div');
          listLine.className = 'terminal-line';
          listLine.textContent = candidates.join('  ');
          terminalOutput.appendChild(listLine);
        }
      } else {
        // Complete file or directory path in cwd
        const targetSegs = resolvePathSegments(lastToken.includes('/') ? lastToken.substring(0, lastToken.lastIndexOf('/')) : '');
        const searchPrefix = lastToken.includes('/') ? lastToken.substring(lastToken.lastIndexOf('/') + 1) : lastToken;
        const node = getNode(targetSegs);

        if (node && node.type === 'dir') {
          const entries = Object.keys(node.entries).filter(k => k.startsWith(searchPrefix));
          if (entries.length === 1) {
            const match = entries[0];
            const isDir = node.entries[match].type === 'dir';
            const pathPrefix = lastToken.includes('/') ? lastToken.substring(0, lastToken.lastIndexOf('/') + 1) : '';
            tokens[tokens.length - 1] = pathPrefix + match + (isDir ? '/' : ' ');
            terminalInput.value = tokens.join(' ');
          } else if (entries.length > 1) {
            const listLine = document.createElement('div');
            listLine.className = 'terminal-line';
            listLine.textContent = entries.join('  ');
            terminalOutput.appendChild(listLine);
          }
        }
      }
    }
  });
}

// Global Image Fallback Handler
window.handleImageError = function(img) {
  if (img.dataset.hasFailed) return;
  img.dataset.hasFailed = 'true';
  img.src = './assets/placeholder.png';
};
