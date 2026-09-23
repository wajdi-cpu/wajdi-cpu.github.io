/**
 * data-loader.js - Data fetching & rendering logic for Akiless Portfolio
 * Tokyo Night Design System // Generator Rex Cyber Engine
 * Renders activity feeds, projects grid, certification tracks, and writeups.
 */

const DataLoader = {
  resolvePath(path) {
    if (!path) return './assets/placeholder.png';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('./')) return path;
    if (path.startsWith('/')) return '.' + path;
    return './' + path;
  },

  async fetchJSON(endpoint) {
    try {
      const response = await fetch(endpoint, { cache: 'no-cache' });
      if (!response.ok) {
        console.warn(`Could not load ${endpoint}, status: ${response.status}`);
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn(`Fetch error for ${endpoint}:`, err.message);
      return [];
    }
  },

  createEmptyState(title, description) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
          </svg>
        </div>
        <h3 class="empty-state-title">${title}</h3>
        <p class="empty-state-desc">${description}</p>
      </div>
    `;
  },

  // ==========================================
  // PAGE 1: LATEST / INDEX TIMELINE (Beylessen Style Stream)
  // ==========================================
  async initTimeline(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div style="text-align:center; padding: 3rem; color: var(--text-muted); font-family: var(--font-mono);">[Loading activity stream...]</div>`;

    const [blogs, certs, projects] = await Promise.all([
      this.fetchJSON('./data/blogs.json'),
      this.fetchJSON('./data/certs.json'),
      this.fetchJSON('./data/projects.json')
    ]);

    const items = [];

    blogs.forEach(b => {
      items.push({
        type: 'writeup',
        category: 'Writeup',
        title: b.title,
        date: b.date || '',
        description: b.description || '',
        url: b.url || 'blogs.html',
        image: b.image || '',
        tags: b.tags || ['Writeup', 'HackTheBox', 'Red-Team']
      });
    });

    certs.forEach(c => {
      items.push({
        type: 'cert',
        category: 'Certification',
        title: `${c.name} (${c.issuer || 'Verification'})`,
        date: c.dateEarned || '',
        description: c.status === 'earned'
          ? `Earned certification milestone verified by ${c.issuer}.`
          : `Actively pursuing target credential (${c.percent || 0}% syllabus completed).`,
        url: 'certifications.html',
        image: c.image || '',
        tags: ['Credential', c.issuer || 'OffSec', c.status === 'earned' ? 'Earned' : 'In-Progress']
      });
    });

    projects.forEach(p => {
      items.push({
        type: 'project',
        category: 'Project',
        title: p.name,
        date: '',
        description: p.description || '',
        url: p.url || 'projects.html',
        image: p.image || '',
        tags: (p.tags && p.tags.length) ? p.tags : ['Security Tooling', 'GitHub', 'Research']
      });
    });

    // Sort: newest date first
    items.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });

    // Check if empty
    if (items.length === 0) {
      container.innerHTML = `
        <div class="stream-empty">
          <div class="stream-empty-symbol">// NULL_STREAM_FEED</div>
          <h3 style="color:#fff; font-size:1.15rem; margin:0.8rem 0 0.4rem; font-weight:600;">No Recent Activity Recorded</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; max-width:480px; margin:0 auto; line-height:1.6;">
            No published writeups, certifications, or project repos found in telemetry database. New cybersecurity research and tool releases will automatically stream here.
          </p>
        </div>
      `;
      return;
    }

    let currentFilter = 'all';

    const render = () => {
      const filtered = currentFilter === 'all'
        ? items
        : items.filter(it => it.type === currentFilter);

      const filterHtml = `
        <div class="filter-bar">
          <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">All (${items.length})</button>
          <button class="filter-btn ${currentFilter === 'writeup' ? 'active' : ''}" data-filter="writeup">Writeups (${blogs.length})</button>
          <button class="filter-btn ${currentFilter === 'cert' ? 'active' : ''}" data-filter="cert">Certifications (${certs.length})</button>
          <button class="filter-btn ${currentFilter === 'project' ? 'active' : ''}" data-filter="project">Projects (${projects.length})</button>
        </div>
      `;

      if (filtered.length === 0) {
        container.innerHTML = filterHtml + this.createEmptyState(
          `No ${currentFilter} records`,
          'Try selecting another category filter above.'
        );
        attachFilterEvents();
        return;
      }

      // Beylessen-style list cards
      const postCardsHtml = filtered.map(item => `
        <article class="post-card">
          <div class="post-meta">
            <span class="post-category">${item.category}</span>
            ${item.date ? `<time class="post-date">${item.date}</time>` : ''}
          </div>
          <h3 class="post-title">
            <a href="${item.url}" ${item.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
              ${item.title}
            </a>
          </h3>
          <p class="post-excerpt">${item.description}</p>
          <div class="post-footer">
            <div class="post-tags">
              ${(item.tags || []).map(t => `<span class="post-tag">#${t}</span>`).join('')}
            </div>
            <a class="read-more" href="${item.url}" ${item.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
              Read More &rarr;
            </a>
          </div>
        </article>
      `).join('');

      container.innerHTML = filterHtml + `<div class="post-stream-list">${postCardsHtml}</div>`;
      attachFilterEvents();
    };

    const attachFilterEvents = () => {
      container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          currentFilter = e.currentTarget.getAttribute('data-filter');
          render();
        });
      });
    };

    render();
  },

  // ==========================================
  // PAGE 3: PROJECTS GRID
  // ==========================================
  async initProjects(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div style="text-align:center; padding: 3rem; color: var(--text-muted); font-family: var(--font-mono);">[Loading projects...]</div>`;

    const projects = await this.fetchJSON('./data/projects.json');

    if (!projects || projects.length === 0) {
      container.innerHTML = this.createEmptyState(
        'No Projects Recorded Yet',
        'Security tools, exploit scripts, and GitHub repositories will appear here once published.'
      );
      return;
    }

    const allTags = new Set();
    projects.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(t => allTags.add(t));
      }
    });

    let activeTag = 'all';

    const render = () => {
      const filtered = activeTag === 'all'
        ? projects
        : projects.filter(p => Array.isArray(p.tags) && p.tags.includes(activeTag));

      const tagsHtml = `
        <div class="filter-bar">
          <button class="filter-btn ${activeTag === 'all' ? 'active' : ''}" data-tag="all">All (${projects.length})</button>
          ${Array.from(allTags).map(tag => `
            <button class="filter-btn ${activeTag === tag ? 'active' : ''}" data-tag="${tag}">${tag}</button>
          `).join('')}
        </div>
      `;

      if (filtered.length === 0) {
        container.innerHTML = tagsHtml + this.createEmptyState('No matching projects', 'No repositories found with the selected tag filter.');
        attachTagEvents();
        return;
      }

      const gridHtml = `
        <div class="projects-grid">
          ${filtered.map(proj => `
            <div class="project-card">
              <img class="project-cover" 
                   src="${this.resolvePath(proj.image)}" 
                   alt="${proj.name}" 
                   loading="lazy" 
                   onerror="window.handleImageError(this)">
              <div class="project-body">
                <h3 class="project-name">
                  ${proj.name}
                </h3>
                <p class="project-desc">${proj.description || 'No description provided.'}</p>
                <div class="project-tags">
                  ${(proj.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('')}
                </div>
                <div class="project-footer">
                  <a href="${proj.url || '#'}" target="_blank" rel="noopener noreferrer">
                    View on GitHub &rarr;
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      container.innerHTML = tagsHtml + gridHtml;
      attachTagEvents();
    };

    const attachTagEvents = () => {
      container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          activeTag = e.currentTarget.getAttribute('data-tag');
          render();
        });
      });
    };

    render();
  },

  // ==========================================
  // PAGE 4: CERTIFICATIONS
  // ==========================================
  async initCertifications(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div style="text-align:center; padding: 3rem; color: var(--text-muted); font-family: var(--font-mono);">[Loading certifications...]</div>`;

    const certs = await this.fetchJSON('./data/certs.json');

    const earned = certs.filter(c => c.status === 'earned');
    const inProgress = certs.filter(c => c.status === 'in-progress');

    let html = '';

    // SECTION 1: EARNED CERTIFICATIONS
    html += `
      <div class="cert-section">
        <div class="cert-section-header">
          <h2 class="cert-section-title">Earned Credentials</h2>
          <span class="cert-count-pill pill-earned">${earned.length}</span>
        </div>
    `;

    if (earned.length === 0) {
      html += this.createEmptyState(
        'No Completed Credentials Yet',
        'Verified certifications and badges will appear here.'
      );
    } else {
      html += `
        <div class="cert-grid">
          ${earned.map(c => `
            <div class="cert-card">
              <div class="cert-card-top">
                <img class="cert-badge-img" 
                     src="${this.resolvePath(c.image)}" 
                     alt="${c.name}" 
                     loading="lazy" 
                     onerror="window.handleImageError(this)">
                <div class="cert-info">
                  <h3 class="cert-name">${c.name}</h3>
                  <div class="cert-issuer">${c.issuer || 'Issuing Body'}</div>
                  ${c.dateEarned ? `<div class="cert-date">Verified: ${c.dateEarned}</div>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    html += `</div>`;

    // SECTION 2: IN PROGRESS CERTIFICATIONS
    html += `
      <div class="cert-section">
        <div class="cert-section-header">
          <h2 class="cert-section-title">In Progress</h2>
          <span class="cert-count-pill pill-progress">${inProgress.length}</span>
        </div>
    `;

    if (inProgress.length === 0) {
      html += this.createEmptyState(
        'No Active Tracks Pending',
        'Currently not enrolled in any pending examination tracks.'
      );
    } else {
      html += `
        <div class="cert-grid">
          ${inProgress.map(c => {
            const pct = Math.min(100, Math.max(0, Number(c.percent) || 0));
            return `
              <div class="cert-card">
                <div class="cert-card-top">
                  <img class="cert-badge-img" 
                       src="${this.resolvePath(c.image)}" 
                       alt="${c.name}" 
                       loading="lazy" 
                       onerror="window.handleImageError(this)">
                  <div class="cert-info">
                    <h3 class="cert-name">${c.name}</h3>
                    <div class="cert-issuer">${c.issuer || 'Target Credential'}</div>
                  </div>
                </div>
                <div class="cert-progress-box">
                  <div class="progress-labels">
                    <span class="progress-label-text">Preparation Progress</span>
                    <span class="progress-label-percent">${pct}%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-bar-fill" style="width: ${pct}%"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
    html += `</div>`;

    container.innerHTML = html;
  },

  // ==========================================
  // PAGE 5: BLOGS LIST
  // ==========================================
  async initBlogs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div style="text-align:center; padding: 3rem; color: var(--text-muted); font-family: var(--font-mono);">[Loading blogs & writeups...]</div>`;

    const blogs = await this.fetchJSON('./data/blogs.json');

    if (!blogs || blogs.length === 0) {
      container.innerHTML = this.createEmptyState(
        'No Publications Recorded Yet',
        'Offensive security writeups, CTF solutions, and Medium publications will be listed here.'
      );
      return;
    }

    blogs.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    const listHtml = `
      <div class="blogs-list">
        ${blogs.map(post => `
          <article class="blog-card">
            <img class="blog-thumb" 
                 src="${this.resolvePath(post.image)}" 
                 alt="${post.title}" 
                 loading="lazy" 
                 onerror="window.handleImageError(this)">
            <div class="blog-content">
              ${post.date ? `<time class="blog-date">${post.date}</time>` : ''}
              <h3 class="blog-title">
                <a href="${post.url || '#'}" target="_blank" rel="noopener noreferrer">
                  ${post.title}
                </a>
              </h3>
              <p class="blog-desc">${post.description || ''}</p>
              <div>
                <a class="blog-link" href="${post.url || '#'}" target="_blank" rel="noopener noreferrer">
                  Read on Medium &rarr;
                </a>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `;

    container.innerHTML = listHtml;
  }
};
