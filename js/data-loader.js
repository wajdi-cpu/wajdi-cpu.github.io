/**
 * data-loader.js - Data fetching & rendering logic for Akiless Portfolio
 * Checks for React CDN components first; gracefully uses native renderer if React is absent.
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

  createEmptyState(title, description, icon = '📂') {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">${icon}</div>
        <h3 class="empty-state-title">${title}</h3>
        <p class="empty-state-desc">${description}</p>
      </div>
    `;
  },

  // ==========================================
  // PAGE 1: LATEST / INDEX TIMELINE
  // ==========================================
  async initTimeline(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div style="text-align:center; padding: 3rem; color: var(--text-muted); font-family: var(--font-mono);">[Loading timeline activity feed...]</div>`;

    const [blogs, certs, projects] = await Promise.all([
      this.fetchJSON('./data/blogs.json'),
      this.fetchJSON('./data/certs.json'),
      this.fetchJSON('./data/projects.json')
    ]);

    const items = [];

    blogs.forEach(b => {
      items.push({
        type: 'writeup',
        title: b.title,
        date: b.date || '',
        description: b.description || '',
        url: b.url || '#',
        image: b.image || '',
        meta: 'Medium Writeup',
        badgeClass: 'badge-blog'
      });
    });

    certs.forEach(c => {
      items.push({
        type: 'cert',
        title: `${c.name} (${c.issuer || 'Certification'})`,
        date: c.dateEarned || '',
        description: c.status === 'earned'
          ? `Successfully earned credential from ${c.issuer}.`
          : `Currently preparing for examination (${c.percent || 0}% completed).`,
        url: 'certifications.html',
        image: c.image || '',
        meta: c.status === 'earned' ? 'Credential Earned' : 'Certification In Progress',
        badgeClass: 'badge-cert'
      });
    });

    projects.forEach(p => {
      items.push({
        type: 'project',
        title: p.name,
        date: '',
        description: p.description || '',
        url: p.url || 'projects.html',
        image: p.image || '',
        meta: (p.tags && p.tags.length) ? p.tags.slice(0, 3).join(', ') : 'Project',
        badgeClass: 'badge-project'
      });
    });

    // Sort: newest date first
    items.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });

    // Check if React component is present
    if (window.AkilessReact && window.AkilessReact.mountTimeline) {
      window.AkilessReact.mountTimeline(containerId, {
        items,
        blogsCount: blogs.length,
        certsCount: certs.length,
        projectsCount: projects.length
      });
      return;
    }

    // Native Vanilla JS Renderer Fallback
    if (items.length === 0) {
      container.innerHTML = this.createEmptyState(
        'No Activity Yet',
        'No blog posts, certifications, or projects have been added yet. Stay tuned for upcoming writeups and tool releases!',
        '⚡'
      );
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
          `No ${currentFilter} entries found`,
          'Try selecting another filter category.'
        );
        attachFilterEvents();
        return;
      }

      const timelineItemsHtml = filtered.map(item => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-card">
            <img class="timeline-thumb" 
                 src="${this.resolvePath(item.image)}" 
                 alt="${item.title}" 
                 loading="lazy" 
                 onerror="window.handleImageError(this)">
            <div class="timeline-content">
              <div class="timeline-meta">
                <span class="timeline-badge ${item.badgeClass}">${item.type.toUpperCase()}</span>
                ${item.date ? `<span class="timeline-date">${item.date}</span>` : ''}
              </div>
              <h3 class="timeline-title">
                <a href="${item.url}" ${item.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                  ${item.title}
                </a>
              </h3>
              <p class="timeline-desc">${item.description}</p>
            </div>
          </div>
        </div>
      `).join('');

      container.innerHTML = filterHtml + `<div class="timeline-container">${timelineItemsHtml}</div>`;
      attachFilterEvents();
    };

    const attachFilterEvents = () => {
      container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          currentFilter = e.target.getAttribute('data-filter');
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

    // Check if React component is present
    if (window.AkilessReact && window.AkilessReact.mountProjects) {
      window.AkilessReact.mountProjects(containerId, projects);
      return;
    }

    if (!projects || projects.length === 0) {
      container.innerHTML = this.createEmptyState(
        'No Projects Yet',
        'No repositories or projects listed yet. Check back soon for security tooling and research!',
        '🛠️'
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
        container.innerHTML = tagsHtml + this.createEmptyState('No matching projects', 'No projects found with the selected tag.');
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
          activeTag = e.target.getAttribute('data-tag');
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

    // Check if React component is present
    if (window.AkilessReact && window.AkilessReact.mountCertifications) {
      window.AkilessReact.mountCertifications(containerId, certs);
      return;
    }

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
        'No Certifications Listed Yet',
        'Completed certifications will appear here once verified.',
        '🎓'
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
                  ${c.dateEarned ? `<div class="cert-date">✓ Earned: ${c.dateEarned}</div>` : ''}
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
        'No In-Progress Certifications',
        'Currently not enrolled in any pending certification tracks.',
        '⏳'
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
        'No Posts Yet — Check Back Soon',
        'Security writeups, CTF breakdowns, and research articles will be published here.',
        '📝'
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
