/**
 * FinTrack Pro — Individual Onboarding Form
 * 3-step form: Personal info → Financial profile → App preferences
 */

import { COUNTRIES, CURRENCIES } from './countries.js';
import { STEP3_DEFAULTS } from './profile-schema.js';

// ─── Shared helpers ────────────────────────────────────────────────────────────

/**
 * Build the searchable country dropdown HTML.
 * @param {string} selectedCode
 */
function buildCountryOptions(selectedCode = 'IN') {
  return COUNTRIES.map(
    (c) =>
      `<option value="${c.code}" ${c.code === selectedCode ? 'selected' : ''}>
        ${c.flag} ${c.name}
      </option>`
  ).join('');
}

/**
 * Build currency dropdown options.
 * @param {string} selectedCode
 */
function buildCurrencyOptions(selectedCode = 'INR') {
  return CURRENCIES.map(
    (c) =>
      `<option value="${c.code}" ${c.code === selectedCode ? 'selected' : ''}>
        ${c.symbol} ${c.code} — ${c.name}
      </option>`
  ).join('');
}

/**
 * Format a number as a readable income string (Indian lakh system or plain).
 */
function formatIncomeLabel(value) {
  if (value >= 500000) return '₹5L+';
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

// ─── Step renderers ────────────────────────────────────────────────────────────

function renderStep1(data) {
  const defaultCountry = COUNTRIES.find((c) => c.code === (data.country || 'IN'));
  return `
    <div class="ob-step-content ob-slide-in" id="ob-step-1">
      <div class="ob-step-header">
        <div class="ob-step-emoji">🙋</div>
        <h2 class="ob-step-title">Tell us about yourself</h2>
        <p class="ob-step-subtitle">This helps us personalize your experience</p>
      </div>

      <div class="ob-form-grid">
        <!-- Full Name -->
        <div class="ob-field ob-field-full">
          <label class="ob-label" for="ind-name">Full Name <span class="ob-required">*</span></label>
          <input
            class="ob-input"
            type="text"
            id="ind-name"
            name="name"
            placeholder="e.g. Arjun Sharma"
            value="${data.name || ''}"
            autocomplete="name"
            required
          />
        </div>

        <!-- Date of Birth -->
        <div class="ob-field">
          <label class="ob-label" for="ind-dob">Date of Birth <span class="ob-optional">(optional)</span></label>
          <input
            class="ob-input"
            type="date"
            id="ind-dob"
            name="dateOfBirth"
            value="${data.dateOfBirth || ''}"
            max="${new Date().toISOString().split('T')[0]}"
          />
        </div>

        <!-- Country -->
        <div class="ob-field">
          <label class="ob-label" for="ind-country">Country</label>
          <div class="ob-select-wrap">
            <select class="ob-select ob-select-searchable" id="ind-country" name="country">
              ${buildCountryOptions(data.country || 'IN')}
            </select>
          </div>
        </div>

        <!-- Primary Currency -->
        <div class="ob-field">
          <label class="ob-label" for="ind-currency">Primary Currency</label>
          <div class="ob-select-wrap">
            <select class="ob-select" id="ind-currency" name="currency">
              ${buildCurrencyOptions(data.currency || defaultCountry?.currency || 'INR')}
            </select>
          </div>
          <p class="ob-field-hint">Auto-filled from country · you can change this</p>
        </div>

        <!-- Profile Photo -->
        <div class="ob-field ob-field-full">
          <label class="ob-label">Profile Photo <span class="ob-optional">(optional)</span></label>
          <div class="ob-photo-upload" id="ob-photo-upload">
            <div class="ob-photo-preview" id="ob-photo-preview">
              ${data.photoBase64
                ? `<img src="${data.photoBase64}" alt="Profile" class="ob-photo-img" />`
                : `<div class="ob-photo-placeholder" id="ob-photo-initials">${(data.name || 'U').charAt(0).toUpperCase()}</div>`
              }
            </div>
            <div class="ob-photo-actions">
              <label class="ob-btn ob-btn-outline ob-btn-sm" for="ind-photo-file">
                📷 Choose Photo
                <input type="file" id="ind-photo-file" accept="image/*" style="display:none;" />
              </label>
              ${data.photoBase64 ? `<button type="button" class="ob-btn ob-btn-ghost ob-btn-sm" id="ob-photo-remove">Remove</button>` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStep2(data) {
  const occupations = [
    { id: 'salaried', icon: '💼', label: 'Salaried' },
    { id: 'self-employed', icon: '🏪', label: 'Self-employed' },
    { id: 'student', icon: '🎓', label: 'Student' },
    { id: 'freelancer', icon: '💻', label: 'Freelancer' },
    { id: 'homemaker', icon: '🏠', label: 'Homemaker' },
    { id: 'retired', icon: '🌅', label: 'Retired' },
  ];
  const goals = [
    { id: 'save-home', icon: '🏠', label: 'Save for Home' },
    { id: 'emergency-fund', icon: '🛡️', label: 'Emergency Fund' },
    { id: 'vacation', icon: '✈️', label: 'Vacation' },
    { id: 'retirement', icon: '🌱', label: 'Retirement' },
    { id: 'debt-free', icon: '💳', label: 'Become Debt-Free' },
    { id: 'investing', icon: '📈', label: 'Start Investing' },
  ];

  const incomeVal = data.monthlyIncome || 30000;
  const riskVal = data.riskAppetite ?? 50;

  return `
    <div class="ob-step-content ob-slide-in" id="ob-step-2">
      <div class="ob-step-header">
        <div class="ob-step-emoji">💰</div>
        <h2 class="ob-step-title">Your financial profile</h2>
        <p class="ob-step-subtitle">Helps us give smarter recommendations</p>
      </div>

      <div class="ob-form-grid">
        <!-- Monthly Income -->
        <div class="ob-field ob-field-full">
          <label class="ob-label" for="ind-income">
            Monthly Income <span class="ob-required">*</span>
            <span class="ob-income-display" id="ob-income-display">${formatIncomeLabel(incomeVal)}</span>
          </label>
          <input
            class="ob-range"
            type="range"
            id="ind-income"
            name="monthlyIncome"
            min="0"
            max="500000"
            step="5000"
            value="${incomeVal}"
          />
          <div class="ob-range-labels">
            <span>₹0</span>
            <span>₹1L</span>
            <span>₹2.5L</span>
            <span>₹5L+</span>
          </div>
          <input
            class="ob-input ob-income-input"
            type="number"
            id="ind-income-text"
            name="monthlyIncomeText"
            placeholder="Or enter exact amount"
            value="${incomeVal}"
            min="0"
          />
        </div>

        <!-- Occupation -->
        <div class="ob-field ob-field-full">
          <label class="ob-label">Occupation</label>
          <div class="ob-radio-cards" role="group" aria-label="Occupation">
            ${occupations
              .map(
                (o) => `
              <label class="ob-radio-card ${data.occupation === o.id ? 'ob-radio-card-selected' : ''}" for="ind-occ-${o.id}">
                <input type="radio" id="ind-occ-${o.id}" name="occupation" value="${o.id}" ${data.occupation === o.id ? 'checked' : ''} />
                <span class="ob-radio-icon">${o.icon}</span>
                <span class="ob-radio-label">${o.label}</span>
              </label>`
              )
              .join('')}
          </div>
        </div>

        <!-- Financial Goals -->
        <div class="ob-field ob-field-full">
          <label class="ob-label">Financial Goals <span class="ob-optional">(pick any)</span></label>
          <div class="ob-checkbox-cards" role="group" aria-label="Financial goals">
            ${goals
              .map(
                (g) => `
              <label class="ob-checkbox-card ${(data.goals || []).includes(g.id) ? 'ob-checkbox-card-selected' : ''}" for="ind-goal-${g.id}">
                <input type="checkbox" id="ind-goal-${g.id}" name="goals" value="${g.id}" ${(data.goals || []).includes(g.id) ? 'checked' : ''} />
                <span class="ob-checkbox-icon">${g.icon}</span>
                <span class="ob-checkbox-label">${g.label}</span>
              </label>`
              )
              .join('')}
          </div>
        </div>

        <!-- Risk Appetite -->
        <div class="ob-field ob-field-full">
          <label class="ob-label">
            Risk Appetite
            <span class="ob-risk-label" id="ob-risk-label">${getRiskLabel(riskVal)}</span>
          </label>
          <div class="ob-risk-wrap">
            <input
              class="ob-range ob-risk-range"
              type="range"
              id="ind-risk"
              name="riskAppetite"
              min="0"
              max="100"
              step="1"
              value="${riskVal}"
            />
            <div class="ob-risk-track" id="ob-risk-track" style="width: ${riskVal}%"></div>
          </div>
          <div class="ob-range-labels">
            <span>🔵 Conservative</span>
            <span>🟡 Moderate</span>
            <span>🟠 Aggressive</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStep3(data) {
  const themes = [
    { id: 'dark', icon: '🌙', label: 'Dark' },
    { id: 'light', icon: '☀️', label: 'Light' },
    { id: 'oled', icon: '⚫', label: 'OLED' },
  ];
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ar', name: 'Arabic' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
  ];

  const aiOn = data.aiEnabled ?? false;
  const notifOn = data.notificationsEnabled ?? true;

  return `
    <div class="ob-step-content ob-slide-in" id="ob-step-3">
      <div class="ob-step-header">
        <div class="ob-step-emoji">⚙️</div>
        <h2 class="ob-step-title">App preferences</h2>
        <p class="ob-step-subtitle">Customize your FinTrack experience</p>
      </div>

      <div class="ob-form-grid">
        <!-- Theme -->
        <div class="ob-field ob-field-full">
          <label class="ob-label">Theme</label>
          <div class="ob-theme-cards" role="group" aria-label="Theme selection">
            ${themes
              .map(
                (t) => `
              <label class="ob-theme-card ${(data.theme || 'dark') === t.id ? 'ob-theme-card-selected' : ''}" for="ind-theme-${t.id}">
                <input type="radio" id="ind-theme-${t.id}" name="theme" value="${t.id}" ${(data.theme || 'dark') === t.id ? 'checked' : ''} />
                <span class="ob-theme-icon">${t.icon}</span>
                <span class="ob-theme-label">${t.label}</span>
              </label>`
              )
              .join('')}
          </div>
        </div>

        <!-- Language -->
        <div class="ob-field">
          <label class="ob-label" for="ind-language">Language</label>
          <div class="ob-select-wrap">
            <select class="ob-select" id="ind-language" name="language">
              ${languages
                .map(
                  (l) =>
                    `<option value="${l.code}" ${(data.language || 'en') === l.code ? 'selected' : ''}>${l.name}</option>`
                )
                .join('')}
            </select>
          </div>
        </div>

        <!-- Default View -->
        <div class="ob-field">
          <label class="ob-label" for="ind-default-view">Default View</label>
          <div class="ob-select-wrap">
            <select class="ob-select" id="ind-default-view" name="defaultView">
              <option value="dashboard" ${(data.defaultView || 'dashboard') === 'dashboard' ? 'selected' : ''}>📊 Dashboard</option>
              <option value="transactions" ${data.defaultView === 'transactions' ? 'selected' : ''}>📋 Transactions</option>
            </select>
          </div>
        </div>

        <!-- AI Assistant -->
        <div class="ob-field ob-field-full">
          <div class="ob-toggle-row">
            <div class="ob-toggle-info">
              <span class="ob-toggle-label">🤖 Enable AI Assistant</span>
              <span class="ob-toggle-desc" id="ob-ai-desc">
                ${aiOn
                  ? 'Uses built-in Gemma AI model (~1.4 GB download on first use)'
                  : 'Smart categorization, insights & budget advice'}
              </span>
            </div>
            <label class="ob-toggle" for="ind-ai">
              <input type="checkbox" id="ind-ai" name="aiEnabled" ${aiOn ? 'checked' : ''} />
              <span class="ob-toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- Notifications -->
        <div class="ob-field ob-field-full">
          <div class="ob-toggle-row">
            <div class="ob-toggle-info">
              <span class="ob-toggle-label">🔔 Enable Notifications</span>
              <span class="ob-toggle-desc">Budget alerts, bill reminders & tips</span>
            </div>
            <label class="ob-toggle" for="ind-notifications">
              <input type="checkbox" id="ind-notifications" name="notificationsEnabled" ${notifOn ? 'checked' : ''} />
              <span class="ob-toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCreating() {
  return `
    <div class="ob-creating" id="ob-creating">
      <div class="ob-creating-animation">
        <div class="ob-creating-ring"></div>
        <div class="ob-creating-ring ob-ring-2"></div>
        <div class="ob-creating-icon">✨</div>
      </div>
      <h2 class="ob-creating-title">Creating your profile...</h2>
      <div class="ob-creating-steps">
        <div class="ob-creating-step" id="ob-cstep-1">
          <span class="ob-cstep-check">⏳</span>
          <span>Setting up your account</span>
        </div>
        <div class="ob-creating-step" id="ob-cstep-2">
          <span class="ob-cstep-check">⏳</span>
          <span>Personalizing your dashboard</span>
        </div>
        <div class="ob-creating-step" id="ob-cstep-3">
          <span class="ob-cstep-check">⏳</span>
          <span>Ready to go!</span>
        </div>
      </div>
    </div>
  `;
}

// ─── Helper ────────────────────────────────────────────────────────────────────

function getRiskLabel(val) {
  if (val <= 33) return '🔵 Conservative';
  if (val <= 66) return '🟡 Moderate';
  return '🟠 Aggressive';
}

// ─── Main render function ──────────────────────────────────────────────────────

/**
 * Render the Individual 3-step form.
 * @param {HTMLElement} container
 * @param {function(object): void} onComplete - called with complete profile data
 * @param {function(): void} onBack - called when user wants to go back to welcome
 */
export function renderIndividualForm(container, onComplete, onBack) {
  let currentStep = 1;
  const totalSteps = 3;

  // In-memory form state (preserved across Back navigation)
  const formData = {
    name: '',
    dateOfBirth: '',
    country: 'IN',
    currency: 'INR',
    currencySymbol: '₹',
    locale: 'en-IN',
    photoBase64: null,
    monthlyIncome: 30000,
    occupation: 'salaried',
    goals: [],
    riskAppetite: 50,
    theme: 'dark',
    language: 'en',
    aiEnabled: false,
    notificationsEnabled: true,
    defaultView: 'dashboard',
  };

  function getStepContent(step) {
    if (step === 1) return renderStep1(formData);
    if (step === 2) return renderStep2(formData);
    if (step === 3) return renderStep3(formData);
    return '';
  }

  function renderWrapper() {
    container.innerHTML = `
      <div class="ob-form-wrapper" id="ob-form-wrapper">
        <!-- Orbs -->
        <div class="ob-orb ob-orb-1"></div>
        <div class="ob-orb ob-orb-2"></div>

        <div class="ob-form-panel">
          <!-- Back to welcome -->
          <button class="ob-back-welcome" id="ob-back-welcome" aria-label="Back to profile selection">
            ← Change profile type
          </button>

          <!-- Progress Header -->
          <div class="ob-progress-header">
            <div class="ob-progress-meta">
              <span class="ob-profile-badge ob-badge-individual">👤 Individual</span>
              <span class="ob-step-counter" id="ob-step-counter">Step ${currentStep} of ${totalSteps}</span>
            </div>
            <div class="ob-progress-bar-track">
              <div class="ob-progress-bar-fill" id="ob-progress-fill" style="width: ${(currentStep / totalSteps) * 100}%"></div>
            </div>
            <div class="ob-progress-steps">
              ${['Personal', 'Finance', 'Preferences'].map(
                (label, i) => `
                <div class="ob-prog-step ${i + 1 < currentStep ? 'ob-prog-done' : ''} ${i + 1 === currentStep ? 'ob-prog-active' : ''}">
                  <div class="ob-prog-dot">
                    ${i + 1 < currentStep ? '✓' : i + 1}
                  </div>
                  <span class="ob-prog-label">${label}</span>
                </div>`
              ).join('')}
            </div>
          </div>

          <!-- Step Content -->
          <div class="ob-step-container" id="ob-step-container">
            ${getStepContent(currentStep)}
          </div>

          <!-- Navigation Buttons -->
          <div class="ob-form-nav">
            ${currentStep > 1
              ? `<button class="ob-btn ob-btn-outline" id="ob-btn-back" type="button">← Back</button>`
              : `<span></span>`
            }
            <div class="ob-nav-right">
              ${currentStep === 3
                ? `<button class="ob-btn ob-btn-ghost ob-btn-sm" id="ob-btn-skip" type="button">Skip for now</button>`
                : ''
              }
              <button class="ob-btn ob-btn-primary" id="ob-btn-next" type="button">
                ${currentStep === totalSteps ? '🚀 Create Profile' : 'Continue →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    attachListeners();
  }

  function attachListeners() {
    // Back to welcome
    const backWelcome = container.querySelector('#ob-back-welcome');
    if (backWelcome) backWelcome.addEventListener('click', onBack);

    // Step Back
    const backBtn = container.querySelector('#ob-btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        collectCurrentStep();
        goToStep(currentStep - 1, 'back');
      });
    }

    // Next / Submit
    const nextBtn = container.querySelector('#ob-btn-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!validateCurrentStep()) return;
        collectCurrentStep();
        if (currentStep < totalSteps) {
          goToStep(currentStep + 1, 'forward');
        } else {
          submitProfile();
        }
      });
    }

    // Skip for now (Step 3 only)
    const skipBtn = container.querySelector('#ob-btn-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        collectCurrentStep(); // Collect whatever was entered
        // Apply smart defaults for anything not set
        Object.assign(formData, STEP3_DEFAULTS);
        submitProfile();
      });
    }

    // Country → auto-fill currency
    const countrySelect = container.querySelector('#ind-country');
    if (countrySelect) {
      countrySelect.addEventListener('change', () => {
        const country = COUNTRIES.find((c) => c.code === countrySelect.value);
        if (country) {
          const currencySelect = container.querySelector('#ind-currency');
          if (currencySelect) currencySelect.value = country.currency;
        }
      });
    }

    // Income range ↔ text input sync
    const incomeRange = container.querySelector('#ind-income');
    const incomeText = container.querySelector('#ind-income-text');
    const incomeDisplay = container.querySelector('#ob-income-display');
    if (incomeRange && incomeText && incomeDisplay) {
      incomeRange.addEventListener('input', () => {
        incomeText.value = incomeRange.value;
        incomeDisplay.textContent = formatIncomeLabel(Number(incomeRange.value));
      });
      incomeText.addEventListener('input', () => {
        const val = Math.min(Number(incomeText.value), 500000);
        incomeRange.value = val;
        incomeDisplay.textContent = formatIncomeLabel(val);
      });
    }

    // Risk appetite slider
    const riskRange = container.querySelector('#ind-risk');
    const riskLabel = container.querySelector('#ob-risk-label');
    if (riskRange && riskLabel) {
      riskRange.addEventListener('input', () => {
        riskLabel.textContent = getRiskLabel(Number(riskRange.value));
        // Color the slider
        const pct = Number(riskRange.value);
        riskRange.style.setProperty('--pct', `${pct}%`);
      });
    }

    // AI toggle description update
    const aiToggle = container.querySelector('#ind-ai');
    const aiDesc = container.querySelector('#ob-ai-desc');
    if (aiToggle && aiDesc) {
      aiToggle.addEventListener('change', () => {
        aiDesc.textContent = aiToggle.checked
          ? 'Uses built-in Gemma AI model (~1.4 GB download on first use)'
          : 'Smart categorization, insights & budget advice';
      });
    }

    // Theme cards
    const themeCards = container.querySelectorAll('.ob-theme-card');
    themeCards.forEach((card) => {
      const radio = card.querySelector('input[type="radio"]');
      radio?.addEventListener('change', () => {
        themeCards.forEach((c) => c.classList.remove('ob-theme-card-selected'));
        if (radio.checked) card.classList.add('ob-theme-card-selected');
      });
    });

    // Radio occupation cards
    const radioCards = container.querySelectorAll('.ob-radio-card');
    radioCards.forEach((card) => {
      const radio = card.querySelector('input[type="radio"]');
      radio?.addEventListener('change', () => {
        radioCards.forEach((c) => c.classList.remove('ob-radio-card-selected'));
        if (radio.checked) card.classList.add('ob-radio-card-selected');
      });
    });

    // Checkbox goal cards
    const checkCards = container.querySelectorAll('.ob-checkbox-card');
    checkCards.forEach((card) => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      checkbox?.addEventListener('change', () => {
        card.classList.toggle('ob-checkbox-card-selected', checkbox.checked);
      });
    });

    // Photo upload
    const photoInput = container.querySelector('#ind-photo-file');
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          formData.photoBase64 = ev.target.result;
          const preview = container.querySelector('#ob-photo-preview');
          if (preview) {
            preview.innerHTML = `<img src="${ev.target.result}" alt="Profile" class="ob-photo-img" />`;
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Update name initials in photo preview
    const nameInput = container.querySelector('#ind-name');
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        const initials = container.querySelector('#ob-photo-initials');
        if (initials) initials.textContent = (nameInput.value || 'U').charAt(0).toUpperCase();
      });
    }
  }

  function collectCurrentStep() {
    if (currentStep === 1) {
      formData.name = container.querySelector('#ind-name')?.value?.trim() || '';
      formData.dateOfBirth = container.querySelector('#ind-dob')?.value || '';
      const countryCode = container.querySelector('#ind-country')?.value || 'IN';
      const country = COUNTRIES.find((c) => c.code === countryCode);
      formData.country = countryCode;
      formData.locale = country?.locale || 'en-IN';
      const currencyCode = container.querySelector('#ind-currency')?.value || 'INR';
      formData.currency = currencyCode;
      const CURRENCIES_MAP = Object.fromEntries(
        CURRENCIES.map((c) => [c.code, c.symbol])
      );
      formData.currencySymbol = CURRENCIES_MAP[currencyCode] || currencyCode;
    }

    if (currentStep === 2) {
      formData.monthlyIncome = Number(container.querySelector('#ind-income')?.value || 0);
      formData.occupation = container.querySelector('input[name="occupation"]:checked')?.value || 'salaried';
      formData.goals = Array.from(container.querySelectorAll('input[name="goals"]:checked')).map((el) => el.value);
      formData.riskAppetite = Number(container.querySelector('#ind-risk')?.value || 50);
    }

    if (currentStep === 3) {
      formData.theme = container.querySelector('input[name="theme"]:checked')?.value || 'dark';
      formData.language = container.querySelector('#ind-language')?.value || 'en';
      formData.aiEnabled = container.querySelector('#ind-ai')?.checked || false;
      formData.notificationsEnabled = container.querySelector('#ind-notifications')?.checked ?? true;
      formData.defaultView = container.querySelector('#ind-default-view')?.value || 'dashboard';
    }
  }

  function validateCurrentStep() {
    if (currentStep === 1) {
      const name = container.querySelector('#ind-name')?.value?.trim();
      if (!name) {
        showFieldError('#ind-name', 'Please enter your full name');
        return false;
      }
    }
    if (currentStep === 2) {
      const income = container.querySelector('#ind-income')?.value;
      if (!income && income !== '0') {
        showFieldError('#ind-income', 'Please set your monthly income');
        return false;
      }
    }
    return true;
  }

  function showFieldError(selector, msg) {
    const field = container.querySelector(selector);
    if (!field) return;
    field.classList.add('ob-input-error');
    const existing = field.parentElement.querySelector('.ob-error-msg');
    if (!existing) {
      const err = document.createElement('p');
      err.className = 'ob-error-msg';
      err.textContent = msg;
      field.parentElement.appendChild(err);
    }
    field.addEventListener('input', () => {
      field.classList.remove('ob-input-error');
      const errEl = field.parentElement.querySelector('.ob-error-msg');
      if (errEl) errEl.remove();
    }, { once: true });
  }

  function goToStep(step, direction) {
    const container2 = container.querySelector('#ob-step-container');
    if (!container2) return;

    // Animate out
    const current = container2.querySelector('.ob-step-content');
    if (current) {
      current.classList.add(direction === 'forward' ? 'ob-slide-out-left' : 'ob-slide-out-right');
    }

    setTimeout(() => {
      currentStep = step;
      container2.innerHTML = getStepContent(step);

      // Update progress
      const fill = container.querySelector('#ob-progress-fill');
      if (fill) fill.style.width = `${(step / totalSteps) * 100}%`;

      const counter = container.querySelector('#ob-step-counter');
      if (counter) counter.textContent = `Step ${step} of ${totalSteps}`;

      // Update progress dots
      const dots = container.querySelectorAll('.ob-prog-step');
      dots.forEach((dot, i) => {
        dot.classList.remove('ob-prog-done', 'ob-prog-active');
        if (i + 1 < step) dot.classList.add('ob-prog-done');
        if (i + 1 === step) dot.classList.add('ob-prog-active');
        const dotInner = dot.querySelector('.ob-prog-dot');
        if (dotInner) dotInner.textContent = i + 1 < step ? '✓' : String(i + 1);
      });

      // Update nav buttons
      const backBtn = container.querySelector('#ob-btn-back');
      const navLeft = container.querySelector('.ob-form-nav > :first-child');
      if (step > 1 && !backBtn) {
        // Replace the placeholder span
        if (navLeft && navLeft.tagName === 'SPAN') {
          navLeft.outerHTML = `<button class="ob-btn ob-btn-outline" id="ob-btn-back" type="button">← Back</button>`;
        }
      } else if (step === 1 && backBtn) {
        backBtn.outerHTML = '<span></span>';
      }

      const nextBtn = container.querySelector('#ob-btn-next');
      if (nextBtn) nextBtn.textContent = step === totalSteps ? '🚀 Create Profile' : 'Continue →';

      // Skip button
      const navRight = container.querySelector('.ob-nav-right');
      if (navRight) {
        const existingSkip = navRight.querySelector('#ob-btn-skip');
        if (step === 3 && !existingSkip) {
          const skip = document.createElement('button');
          skip.className = 'ob-btn ob-btn-ghost ob-btn-sm';
          skip.id = 'ob-btn-skip';
          skip.type = 'button';
          skip.textContent = 'Skip for now';
          navRight.insertBefore(skip, nextBtn);
        } else if (step !== 3 && existingSkip) {
          existingSkip.remove();
        }
      }

      attachListeners();
    }, 250);
  }

  async function submitProfile() {
    // Collect last step if not already done
    collectCurrentStep();

    // Show creating animation
    container.innerHTML = renderCreating();

    const steps = [
      container.querySelector('#ob-cstep-1'),
      container.querySelector('#ob-cstep-2'),
      container.querySelector('#ob-cstep-3'),
    ];

    // Animate each step check
    for (let i = 0; i < steps.length; i++) {
      await delay(600);
      if (steps[i]) {
        const icon = steps[i].querySelector('.ob-cstep-check');
        if (icon) icon.textContent = '✅';
        steps[i].classList.add('ob-cstep-done');
      }
    }

    await delay(400);
    onComplete(formData);
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Initial render
  renderWrapper();
}

export default { renderIndividualForm };
