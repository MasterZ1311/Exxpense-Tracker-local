export function initSidebar() {
  const sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;

  const navItems = [
    { icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>`, label: 'Dashboard', route: '/' },
    { icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`, label: 'Transactions', route: '/transactions' },
    { icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>`, label: 'Analytics', route: '/analytics' },
    { icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>`, label: 'Settings', route: '/settings' }
  ];

  const currentRoute = window.location.pathname;
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  
  // Dummy user for initial render
  const user = { initials: 'JD', name: 'John Doe' };

  sidebarEl.innerHTML = `
    <div class="sidebar-container ${isCollapsed ? 'collapsed' : ''}" id="sidebar-container">
      <div class="sidebar-logo">
        <svg class="nav-icon" fill="none" stroke="var(--accent-primary)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        <span>Expenso</span>
      </div>
      
      <div class="sidebar-nav">
        ${navItems.map(item => `
          <a href="${item.route}" class="nav-item ${currentRoute === item.route ? 'active' : ''}">
            <div class="nav-icon">${item.icon}</div>
            <span class="nav-label">${item.label}</span>
          </a>
        `).join('')}
      </div>
      
      <div class="sidebar-footer">
        <div class="nav-item">
          <div class="avatar">${user.initials}</div>
          <span class="nav-label">${user.name}</span>
        </div>
        <button class="sidebar-toggle" id="sidebar-toggle-btn" style="margin-top: 16px;">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
        </button>
      </div>
    </div>
  `;

  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const container = document.getElementById('sidebar-container');
  
  toggleBtn.addEventListener('click', () => {
    container.classList.toggle('collapsed');
    const collapsed = container.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', collapsed);
    toggleBtn.querySelector('svg').style.transform = collapsed ? 'rotate(180deg)' : 'rotate(0)';
  });

  if (isCollapsed) {
    toggleBtn.querySelector('svg').style.transform = 'rotate(180deg)';
  }

  window.addEventListener('toggle-mobile-sidebar', () => {
    container.classList.toggle('mobile-open');
  });
}
