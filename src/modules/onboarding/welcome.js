/**
 * FinTrack Pro — Onboarding Welcome Screen
 * Two large choice cards for Individual vs Corporate profile types.
 */

/**
 * Render the welcome screen into the given container.
 * @param {HTMLElement} container
 * @param {function(string): void} onSelect - called with 'individual' or 'corporate'
 */
export function renderWelcome(container, onSelect) {
  container.innerHTML = `
    <div class="ob-welcome" id="ob-welcome">
      <!-- Animated background orbs -->
      <div class="ob-orb ob-orb-1"></div>
      <div class="ob-orb ob-orb-2"></div>
      <div class="ob-orb ob-orb-3"></div>

      <div class="ob-welcome-inner">
        <!-- Logo / Brand -->
        <div class="ob-brand">
          <div class="ob-logo">
            <span class="ob-logo-icon">💎</span>
          </div>
          <h1 class="ob-brand-name">FinTrack <span class="ob-brand-pro">Pro</span></h1>
        </div>

        <!-- Headline -->
        <div class="ob-headline">
          <h2 class="ob-title">Welcome aboard! 👋</h2>
          <p class="ob-subtitle">
            Let's personalize your experience. Tell us how you plan to use FinTrack Pro.
          </p>
        </div>

        <!-- Choice Cards -->
        <div class="ob-cards" role="group" aria-label="Select your profile type">
          <!-- Individual Card -->
          <button
            class="ob-card ob-card-individual"
            id="ob-card-individual"
            aria-label="I'm an Individual"
            data-type="individual"
          >
            <div class="ob-card-glow ob-card-glow-indigo"></div>
            <div class="ob-card-inner">
              <div class="ob-card-icon-wrap ob-card-icon-indigo">
                <span class="ob-card-icon">👤</span>
              </div>
              <div class="ob-card-content">
                <h3 class="ob-card-title">I'm an Individual</h3>
                <p class="ob-card-desc">Track personal finances, savings &amp; spending</p>
                <ul class="ob-card-features">
                  <li>📊 Personal budget tracking</li>
                  <li>🎯 Goal-based savings</li>
                  <li>📈 Spending analytics</li>
                </ul>
              </div>
              <div class="ob-card-arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="ob-card-border ob-card-border-indigo"></div>
          </button>

          <!-- Corporate Card -->
          <button
            class="ob-card ob-card-corporate"
            id="ob-card-corporate"
            aria-label="I'm a Business or Freelancer"
            data-type="corporate"
          >
            <div class="ob-card-glow ob-card-glow-cyan"></div>
            <div class="ob-card-inner">
              <div class="ob-card-icon-wrap ob-card-icon-cyan">
                <span class="ob-card-icon">🏢</span>
              </div>
              <div class="ob-card-content">
                <h3 class="ob-card-title">I'm a Business / Freelancer</h3>
                <p class="ob-card-desc">Manage business expenses, invoices &amp; tax</p>
                <ul class="ob-card-features">
                  <li>🧾 Invoice &amp; project tracking</li>
                  <li>💰 GST / VAT management</li>
                  <li>📋 Business analytics</li>
                </ul>
              </div>
              <div class="ob-card-arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="ob-card-border ob-card-border-cyan"></div>
          </button>
        </div>

        <!-- Trust indicators -->
        <div class="ob-trust">
          <span class="ob-trust-item">🔒 100% Private — data stays on your device</span>
          <span class="ob-trust-sep">·</span>
          <span class="ob-trust-item">✨ No account required</span>
          <span class="ob-trust-sep">·</span>
          <span class="ob-trust-item">⚡ Takes 2 minutes</span>
        </div>
      </div>
    </div>
  `;

  // Attach click handlers with animation
  const cards = container.querySelectorAll('.ob-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const type = card.dataset.type;

      // Ripple effect
      card.classList.add('ob-card-selected');

      // Fade out welcome, then call onSelect
      const welcome = container.querySelector('#ob-welcome');
      if (welcome) {
        welcome.classList.add('ob-fade-exit');
      }

      setTimeout(() => {
        onSelect(type);
      }, 380);
    });

    // Hover lift effect via JS for mobile compatibility
    card.addEventListener('mouseenter', () => card.classList.add('ob-card-hover'));
    card.addEventListener('mouseleave', () => card.classList.remove('ob-card-hover'));
  });

  // Animate in
  requestAnimationFrame(() => {
    const welcome = container.querySelector('#ob-welcome');
    if (welcome) welcome.classList.add('ob-fade-enter');
  });
}

export default { renderWelcome };
