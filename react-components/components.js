/**
 * react-components/components.js
 * Lightweight, zero-build React 18 interactive components loaded via CDN.
 * Uses React.createElement to eliminate any Babel/Node build pipeline.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react', 'react-dom'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('react'), require('react-dom'));
  } else {
    root.AkilessReact = factory(root.React, root.ReactDOM);
  }
})(typeof self !== 'undefined' ? self : this, function (React, ReactDOM) {
  if (!React || !ReactDOM) {
    console.warn('React or ReactDOM not found on window. Falling back to vanilla rendering.');
    return null;
  }

  const e = React.createElement;
  const { useState, useEffect } = React;

  // Global helper for image error
  const onImgError = (evt) => {
    if (window.handleImageError) {
      window.handleImageError(evt.target);
    } else {
      evt.target.src = './assets/placeholder.png';
    }
  };

  // Helper for empty state
  function EmptyState({ title, description, icon = '📂' }) {
    return e('div', { className: 'empty-state' },
      e('div', { className: 'empty-state-icon' }, icon),
      e('h3', { className: 'empty-state-title' }, title),
      e('p', { className: 'empty-state-desc' }, description)
    );
  }

  // =========================================================================
  // 1. TIMELINE COMPONENT (index.html)
  // =========================================================================
  function TimelineApp({ items = [], blogsCount = 0, certsCount = 0, projectsCount = 0 }) {
    const [currentFilter, setFilter] = useState('all');

    if (!items || items.length === 0) {
      return e(EmptyState, {
        title: 'No Activity Yet',
        description: 'No blog posts, certifications, or projects have been added yet. Stay tuned for upcoming writeups and tool releases!',
        icon: '⚡'
      });
    }

    const filtered = currentFilter === 'all'
      ? items
      : items.filter(it => it.type === currentFilter);

    return e('div', null,
      // Filter bar
      e('div', { className: 'filter-bar' },
        e('button', {
          className: `filter-btn ${currentFilter === 'all' ? 'active' : ''}`,
          onClick: () => setFilter('all')
        }, `All (${items.length})`),
        e('button', {
          className: `filter-btn ${currentFilter === 'writeup' ? 'active' : ''}`,
          onClick: () => setFilter('writeup')
        }, `Writeups (${blogsCount})`),
        e('button', {
          className: `filter-btn ${currentFilter === 'cert' ? 'active' : ''}`,
          onClick: () => setFilter('cert')
        }, `Certifications (${certsCount})`),
        e('button', {
          className: `filter-btn ${currentFilter === 'project' ? 'active' : ''}`,
          onClick: () => setFilter('project')
        }, `Projects (${projectsCount})`)
      ),

      // Filtered content
      filtered.length === 0
        ? e(EmptyState, {
            title: `No ${currentFilter} entries found`,
            description: 'Try selecting another filter category.'
          })
        : e('div', { className: 'timeline-container' },
            filtered.map((item, idx) =>
              e('div', { key: idx, className: 'timeline-item' },
                e('div', { className: 'timeline-dot' }),
                e('div', { className: 'timeline-card' },
                  e('img', {
                    className: 'timeline-thumb',
                    src: item.image || './assets/placeholder.png',
                    alt: item.title,
                    loading: 'lazy',
                    onError: onImgError
                  }),
                  e('div', { className: 'timeline-content' },
                    e('div', { className: 'timeline-meta' },
                      e('span', { className: `timeline-badge ${item.badgeClass}` }, item.type.toUpperCase()),
                      item.date ? e('span', { className: 'timeline-date' }, item.date) : null
                    ),
                    e('h3', { className: 'timeline-title' },
                      e('a', {
                        href: item.url || '#',
                        target: (item.url && item.url.startsWith('http')) ? '_blank' : '_self',
                        rel: 'noopener noreferrer'
                      }, item.title)
                    ),
                    e('p', { className: 'timeline-desc' }, item.description)
                  )
                )
              )
            )
          )
    );
  }

  // =========================================================================
  // 2. PROJECTS GRID COMPONENT (projects.html)
  // =========================================================================
  function ProjectsGridApp({ projects = [] }) {
    const [activeTag, setActiveTag] = useState('all');

    if (!projects || projects.length === 0) {
      return e(EmptyState, {
        title: 'No Projects Yet',
        description: 'No repositories or projects listed yet. Check back soon for security tooling and research!',
        icon: '🛠️'
      });
    }

    // Dynamic unique tags
    const allTags = new Set();
    projects.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(t => allTags.add(t));
      }
    });

    const filtered = activeTag === 'all'
      ? projects
      : projects.filter(p => Array.isArray(p.tags) && p.tags.includes(activeTag));

    return e('div', null,
      // Filter bar
      e('div', { className: 'filter-bar' },
        e('button', {
          className: `filter-btn ${activeTag === 'all' ? 'active' : ''}`,
          onClick: () => setActiveTag('all')
        }, `All (${projects.length})`),
        Array.from(allTags).map(tag =>
          e('button', {
            key: tag,
            className: `filter-btn ${activeTag === tag ? 'active' : ''}`,
            onClick: () => setActiveTag(tag)
          }, tag)
        )
      ),

      // Grid
      filtered.length === 0
        ? e(EmptyState, {
            title: 'No matching projects',
            description: 'No projects found with the selected tag.'
          })
        : e('div', { className: 'projects-grid' },
            filtered.map((proj, idx) =>
              e('div', { key: idx, className: 'project-card' },
                e('img', {
                  className: 'project-cover',
                  src: proj.image || './assets/placeholder.png',
                  alt: proj.name,
                  loading: 'lazy',
                  onError: onImgError
                }),
                e('div', { className: 'project-body' },
                  e('h3', { className: 'project-name' }, proj.name),
                  e('p', { className: 'project-desc' }, proj.description || 'No description provided.'),
                  e('div', { className: 'project-tags' },
                    (proj.tags || []).map((t, tIdx) =>
                      e('span', { key: tIdx, className: 'project-tag' }, t)
                    )
                  ),
                  e('div', { className: 'project-footer' },
                    e('a', {
                      href: proj.url || '#',
                      target: '_blank',
                      rel: 'noopener noreferrer'
                    }, 'View on GitHub →')
                  )
                )
              )
            )
          )
    );
  }

  // =========================================================================
  // 3. CERTIFICATIONS COMPONENT (certifications.html)
  // =========================================================================
  function CertificationsApp({ certs = [] }) {
    const earned = certs.filter(c => c.status === 'earned');
    const inProgress = certs.filter(c => c.status === 'in-progress');

    return e('div', null,
      // Section 1: Earned
      e('div', { className: 'cert-section' },
        e('div', { className: 'cert-section-header' },
          e('h2', { className: 'cert-section-title' }, 'Earned Credentials'),
          e('span', { className: 'cert-count-pill pill-earned' }, earned.length)
        ),
        earned.length === 0
          ? e(EmptyState, {
              title: 'No Certifications Listed Yet',
              description: 'Completed certifications will appear here once verified.',
              icon: '🎓'
            })
          : e('div', { className: 'cert-grid' },
              earned.map((c, idx) =>
                e('div', { key: idx, className: 'cert-card' },
                  e('div', { className: 'cert-card-top' },
                    e('img', {
                      className: 'cert-badge-img',
                      src: c.image || './assets/placeholder.png',
                      alt: c.name,
                      loading: 'lazy',
                      onError: onImgError
                    }),
                    e('div', { className: 'cert-info' },
                      e('h3', { className: 'cert-name' }, c.name),
                      e('div', { className: 'cert-issuer' }, c.issuer || 'Issuing Body'),
                      c.dateEarned ? e('div', { className: 'cert-date' }, `✓ Earned: ${c.dateEarned}`) : null
                    )
                  )
                )
              )
            )
      ),

      // Section 2: In Progress
      e('div', { className: 'cert-section' },
        e('div', { className: 'cert-section-header' },
          e('h2', { className: 'cert-section-title' }, 'In Progress'),
          e('span', { className: 'cert-count-pill pill-progress' }, inProgress.length)
        ),
        inProgress.length === 0
          ? e(EmptyState, {
              title: 'No In-Progress Certifications',
              description: 'Currently not enrolled in any pending certification tracks.',
              icon: '⏳'
            })
          : e('div', { className: 'cert-grid' },
              inProgress.map((c, idx) => {
                const pct = Math.min(100, Math.max(0, Number(c.percent) || 0));
                return e('div', { key: idx, className: 'cert-card' },
                  e('div', { className: 'cert-card-top' },
                    e('img', {
                      className: 'cert-badge-img',
                      src: c.image || './assets/placeholder.png',
                      alt: c.name,
                      loading: 'lazy',
                      onError: onImgError
                    }),
                    e('div', { className: 'cert-info' },
                      e('h3', { className: 'cert-name' }, c.name),
                      e('div', { className: 'cert-issuer' }, c.issuer || 'Target Credential')
                    )
                  ),
                  e('div', { className: 'cert-progress-box' },
                    e('div', { className: 'progress-labels' },
                      e('span', { className: 'progress-label-text' }, 'Preparation Progress'),
                      e('span', { className: 'progress-label-percent' }, `${pct}%`)
                    ),
                    e('div', { className: 'progress-track' },
                      e('div', {
                        className: 'progress-bar-fill',
                        style: { width: `${pct}%` }
                      })
                    )
                  )
                );
              })
            )
      )
    );
  }

  // Expose mounting functions
  return {
    mountTimeline(containerId, data) {
      const container = document.getElementById(containerId);
      if (!container) return;
      if (ReactDOM.createRoot) {
        ReactDOM.createRoot(container).render(e(TimelineApp, data));
      } else {
        ReactDOM.render(e(TimelineApp, data), container);
      }
    },
    mountProjects(containerId, projects) {
      const container = document.getElementById(containerId);
      if (!container) return;
      if (ReactDOM.createRoot) {
        ReactDOM.createRoot(container).render(e(ProjectsGridApp, { projects }));
      } else {
        ReactDOM.render(e(ProjectsGridApp, { projects }), container);
      }
    },
    mountCertifications(containerId, certs) {
      const container = document.getElementById(containerId);
      if (!container) return;
      if (ReactDOM.createRoot) {
        ReactDOM.createRoot(container).render(e(CertificationsApp, { certs }));
      } else {
        ReactDOM.render(e(CertificationsApp, { certs }), container);
      }
    }
  };
});
