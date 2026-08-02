/**
 * FinTrack Pro — Corporate Individual Onboarding Form
 * 3-step form: Business identity → Business details → Business preferences
 */

import { COUNTRIES, CURRENCIES } from './countries.js';
import { STEP3_DEFAULTS } from './profile-schema.js';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function buildCountryOptions(selectedCode = 'IN') {
  return COUNTRIES.map(
    (c) =>
      `<option value="${c.code}" ${c.code === selectedCode ? 'selected' : ''}>
        ${c.flag} ${c.name}
      </option>`
  ).join('');
}

function buildCurrencyOptions(selectedCode = 'INR') {
  return CURRENCIES.map(
    (c) =>
      `<option value="${c.code}" ${c.code === selectedCode ? 'selected' : ''}>
        ${c.symbol} ${c.code} — ${c.name}
      </option>`
  ).join('');
}

function getGSTINHint(countryCode) {
  const hints = {
    IN: 'GSTIN format: 22AAAAA0000A1Z5',
    US: 'EIN format: XX-XXXXXXX',
    GB: 'VAT Number format: GB 123 4567 89',
    DE: 'USt-IdNr format: DE123456789',
    AU: 'ABN format: XX XXX XXX XXX',
    SG: 'GST Reg No: M90000001A',
    AE: 'TRN format: 100123456700003',
    CA: 'GST/HST format: 12345 6789 RT0001',
    FR: 'No. TVA Intracommunautaire: FR12345678901',
    JP: 'Corporate Number: XXXXXXXXXXXX',
  };
  return hints[countryCode] || 'Enter your VAT / Tax registration number';
}

function getFiscalYearDefault(countryCode) {
  const aprilCountries = ['IN', 'GB', 'AU', 'NZ', 'PK', 'BD'];
  if (aprilCountries.includes(countryCode)) return 'April';
  const julyCountries = ['AU', 'ZA'];
  if (julyCountries.includes(countryCode)) return 'July';
  return 'January';
}

// ─── Step renderers ────────────────────────────────────────────────────────────

function renderStep1(data) {
  const businessTypes = [
    { id: 'freelancer', icon: '💻', label: 'Freelancer' },
    { id: 'sole-proprietor', icon: '👤', label: 'Sole Proprietor' },
    { id: 'startup', icon: '🚀', label: 'Startup' },
    { id: 'small-business', icon: '🏪', label: 'Small Business' },
    { id: 'consultant', icon: '🎯', label: 'Consultant' },
    { id: 'creative-agency', icon: '🎨', label: 'Creative Agency' },
  ];

  return `
    <div class="ob-step-content ob-slide-in" id="ob-step-1">
      <div class="ob-step-header">
        <div class="ob-step-emoji">🏢</div>
        <h2 class="ob-step-title">Your business identity</h2>
        <p class="ob-step-subtitle">Tell us about you and your business</p>
      </div>

      <div class="ob-form-grid">
        <!-- Owner Name -->
        <div class="ob-field">
          <label class="ob-label" for="corp-owner-name">Your Full Name <span class="ob-required">*</span></label>
          <input
            class="ob-input"
            type="text"
            id="corp-owner-name"
            name="ownerName"
            placeholder="e.g. Priya Mehta"
            value="${data.ownerName || ''}"
            autocomplete="name"
            required
          />
        </div>

        <!-- Business Name -->
        <div class="ob-field">
          <label class="ob-label" for="corp-biz-name">Business / Brand Name <span class="ob-required">*</span></label>
          <input
            class="ob-input"
            type="text"
            id="corp-biz-name"
            name="businessName"
            placeholder="e.g. Pixel Studio"
            value="${data.businessName || ''}"
            required
          />
        </div>

        <!-- Business Type -->
        <div class="ob-field ob-field-full">
          <label class="ob-label">Business Type <span class="ob-required">*</span></label>
          <div class="ob-radio-cards" role="group" aria-label="Business type">
            ${businessTypes
              .map(
                (bt) => `
              <label class="ob-radio-card ${data.businessType === bt.id ? 'ob-radio-card-selected' : ''}" for="corp-btype-${bt.id}">
                <input type="radio" id="corp-btype-${bt.id}" name="businessType" value="${bt.id}" ${data.businessType === bt.id ? 'checked' : ''} />
                <span class="ob-radio-icon">${bt.icon}</span>
                <span class="ob-radio-label">${bt.label}</span>
              </label>`
              )
              .join('')}
          </div>
        </div>

        <!-- Country -->
        <div class="ob-field">
          <label class="ob-label" for="corp-country">Country <span class="ob-required">*</span></label>
          <div class="ob-select-wrap">
            <select class="ob-select ob-select-searchable" id="corp-country" name="country">
              ${buildCountryOptions(data.country || 'IN')}
            </select>
          </div>
        </div>

        <!-- Currency -->
        <div class="ob-field">
          <label class="ob-label" for="corp-currency">Primary Currency</label>
          <div class="ob-select-wrap">
            <select class="ob-select" id="corp-currency" name="currency">
              ${buildCurrencyOptions(data.currency || 'INR')}
            </select>
          </div>
          <p class="ob-field-hint">Auto-filled from country · you can change this</p>
        </div>
      </div>
    </div>
  `;
}

function renderStep2(data) {
  const industries = [
    'Tech', 'Healthcare', 'Retail', 'Education', 'Consulting',
    'Creative / Media', 'Food & Beverage', 'Real Estate',
    'Finance', 'Manufacturing', 'Other',
  ];

  const fiscalMonths = ['January', 'April', 'July', 'October'];
  const clientCounts = [
    { id: '1-5', label: '1–5 clients' },
    { id: '6-20', label: '6–20 clients' },
    { id: '21-100', label: '21–100 clients' },
    { id: '100+', label: '100+ clients' },
  ];

  const defaultFiscal = data.fiscalYearStart || getFiscalYearDefault(data.country || 'IN');
  const currencySymbol = data.currencySymbol || '₹';

  return `
    <div class="ob-step-content ob-slide-in" id="ob-step-2">
      <div class="ob-step-header">
        <div class="ob-step-emoji">📋</div>
        <h2 class="ob-step-title">Business details</h2>
        <p class="ob-step-subtitle">Helps us tailor tax tracking and reporting</p>
      </div>

      <div class="ob-form-grid">
        <!-- GSTIN / VAT -->
        <div class="ob-field ob-field-full">
          <label class="ob-label" for="corp-gstin">
            GSTIN / VAT / Tax Number <span class="ob-optional">(optional)</span>
          </label>
          <input
            class="ob-input"
            type="text"
            id="corp-gstin"
            name="gstin"
            placeholder="${getGSTINHint(data.country || 'IN')}"
            value="${data.gstin || ''}"
            autocomplete="off"
          />
          <p class="ob-field-hint" id="ob-gstin-hint">${getGSTINHint(data.country || 'IN')}</p>
        </div>

        <!-- Industry -->
        <div class="ob-field">
          <label class="ob-label" for="corp-industry">Industry</label>
          <div class="ob-select-wrap">
            <select class="ob-select" id="corp-industry" name="industry">
              ${industries
                .map(
                  (ind) =>
                    `<option value="${ind.toLowerCase().replace(/[^a-z]/g, '-')}" ${
                      (data.industry || 'tech') === ind.toLowerCase().replace(/[^a-z]/g, '-') ? 'selected' : ''
                    }>${ind}</option>`
                )
                .join('')}
            </select>
          </div>
        </div>

        <!-- Monthly Revenue -->
        <div class="ob-field">
          <label class="ob-label" for="corp-revenue">
            Avg. Monthly Revenue
          </label>
          <div class="ob-input-prefix-wrap">
            <span class="ob-input-prefix" id="ob-corp-currency-prefix">${currencySymbol}</span>
            <input
              class="ob-input ob-input-with-prefix"
              type="number"
              id="corp-revenue"
              name="monthlyRevenue"
              placeholder="e.g. 150000"
              value="${data.monthlyRevenue || ''}"
              min="0"
            />
          </div>
        </div>

        <!-- Fiscal Year Start -->
        <div class="ob-field">
          <label class="ob-label" for="corp-fiscal">Fiscal Year Start</label>
          <div class="ob-select-wrap">
            <select class="ob-select" id="corp-fiscal" name="fiscalYearStart">
              ${fiscalMonths
                .map(
                  (m) =>
                    `<option value="${m}" ${defaultFiscal === m ? 'selected' : ''}>${m}</option>`
                )
                .join('')}
            </select>
          </div>
          <p class="ob-field-hint">April is standard for India; January for most others</p>
        </div>

        <!-- Number of Clients -->
        <div class="ob-field ob-field-full">
          <label class="ob-label">Number of Clients (approximate)</label>
          <div class="ob-radio-cards ob-radio-cards-sm" role="group" aria-label="Number of clients">
            ${clientCounts
              .map(
                (cc) => `
              <label class="ob-radio-card ${(data.clientCount || '1-5') === cc.id ? 'ob-radio-card-selected' : ''}" for="corp-clients-${cc.id}">
                <input type="radio" id="corp-clients-${cc.id}" name="clientCount" value="${cc.id}" ${(data.clientCount || '1-5') === cc.id ? 'checked' : ''} />
                <span class="ob-radio-label">${cc.label}</span>
              </label>`
              )
              .join('')}
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

  const categoryPreset = data.categoryPreset ?? true;
  const enableGST = data.enableGST ?? true;
  const enableInvoicing = data.enableInvoicing ?? true;
  const aiOn = data.aiEnabled ?? false;
  const notifOn = data.notificationsEnabled ?? true;

  return `
    <div class="ob-step-content ob-slide-in" id="ob-step-3">
      <div class="ob-step-header">
        <div class="ob-step-emoji">⚙️</div>
        <h2 class="ob-step-title">Business preferences</h2>
        <p class="ob-step-subtitle">Configure your business features</p>
      </div>

      <div class="ob-form-grid">
        <!-- Business Feature Toggles -->
        <div class="ob-field ob-field-full">
          <div class="ob-toggle-group">
            <div class="ob-toggle-row">
              <div class="ob-toggle-info">
                <span class="ob-toggle-label">🏷️ Industry-specific expense categories</span>
                <span class="ob-toggle-desc">Pre-load categories tailored to your industry</span>
              </div>
              <label class="ob-toggle" for="corp-categories">
                <input type="checkbox" id="corp-categories" name="categoryPreset" ${categoryPreset ? 'checked' : ''} />
                <span class="ob-toggle-slider"></span>
              </label>
            </div>

            <div class="ob-toggle-row">
              <div class="ob-toggle-info">
                <span class="ob-toggle-label">🧾 Enable GST / Tax Tracking</span>
                <span class="ob-toggle-desc">Track input & output tax, generate tax reports</span>
              </div>
              <label class="ob-toggle" for="corp-gst">
                <input type="checkbox" id="corp-gst" name="enableGST" ${enableGST ? 'checked' : ''} />
                <span class="ob-toggle-slider"></span>
              </label>
            </div>

            <div class="ob-toggle-row">
              <div class="ob-toggle-info">
                <span class="ob-toggle-label">📄 Enable Invoice / Project Tracking</span>
                <span class="ob-toggle-desc">Create invoices, track projects & client payments</span>
              </div>
              <label class="ob-toggle" for="corp-invoicing">
                <input type="checkbox" id="corp-invoicing" name="enableInvoicing" ${enableInvoicing ? 'checked' : ''} />
                <span class="ob-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Theme -->
        <div class="ob-field ob-field-full">
          <label class="ob-label">Theme</label>
          <div class="ob-theme-cards" role="group" aria-label="Theme selection">
            ${themes
              .map(
                (t) => `
              <label class="ob-theme-card ${(data.theme || 'dark') === t.id ? 'ob-theme-card-selected' : ''}" for="corp-theme-${t.id}">
                <input type="radio" id="corp-theme-${t.id}" name="theme" value="${t.id}" ${(data.theme || 'dark') === t.id ? 'checked' : ''} />
                <span class="ob-theme-icon">${t.icon}</span>
                <span class="ob-theme-label">${t.label}</span>
              </label>`
              )
              .join('')}
          </div>
        </div>

        <!-- Language -->
        <div class="ob-field">
          <label class="ob-label" for="corp-language">Language</label>
          <div class="ob-select-wrap">
            <select class="ob-select" id="corp-language" name="language">
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
          <label class="ob-label" for="corp-default-view">Default View</label>
          <div class="ob-select-wrap">
            <select class="ob-select" id="corp-default-view" name="defaultView">
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
              <span class="ob-toggle-desc" id="ob-corp-ai-desc">
                ${aiOn
                  ? 'Uses built-in Gemma AI model (~1.4 GB download on first use)'
                  : 'Smart categorization, invoice suggestions & business insights'}
              </span>
            </div>
            <label class="ob-toggle" for="corp-ai">
              <input type="checkbox" id="corp-ai" name="aiEnabled" ${aiOn ? 'checked' : ''} />
              <span class="ob-toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- Notifications -->
        <div class="ob-field ob-field-full">
          <div class="ob-toggle-row">
            <div class="ob-toggle-info">
              <span class="ob-toggle-label">🔔 Enable Notifications</span>
              <span class="ob-toggle-desc">Invoice due dates, tax deadlines & business alerts</span>
            </div>
            <label class="ob-toggle" for="corp-notifications">
              <input type="checkbox" id="corp-notifications" name="notificationsEnabled" ${notifOn ? 'checked' : ''} />
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
        <div class="ob-creating-icon">🏢</div>
      </div>
      <h2 class="ob-creating-title">Setting up your business profile...</h2>
      <div class="ob-creating-steps">
        <div class="ob-creating-step" id="ob-cstep-1">
          <span class="ob-cstep-check">⏳</span>
          <span>Setting up your account</span>
        </div>
        <div class="ob-creating-step" id="ob-cstep-2">
          <span class="ob-cstep-check">⏳</span>
          <span>Configuring business features</span>
        </div>
        <div class="ob-creating-step" id="ob-cstep-3">
          <span class="ob-cstep-check">⏳</span>
          <span>Ready to go!</span>
        </div>
      </div>
    </div>
  `;
}

// ─── Main render function ──────────────────────────────────────────────────────

/**
 * Render the Corporate Individual 3-step form.
 * @param {HTMLElement} container
 * @param {function(object): void} onComplete - called with complete profile data
 * @param {function(): void} onBack - called when user wants to go back to welcome
 */
export function renderCorporateForm(container, onComplete, onBack) {
  let currentStep = 1;
  const totalSteps = 3;

  const formData = {
    ownerName: '',
    businessName: '',
    businessType: 'freelancer',
    country: 'IN',
    currency: 'INR',
    currencySymbol: '₹',
    locale: 'en-IN',
    gstin: '',
    industry: 'tech',
    monthlyRevenue: 0,
    fiscalYearStart: 'April',
    clientCount: '1-5',
    categoryPreset: true,
    enableGST: true,
    enableInvoicing: true,
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
        <div class="ob-orb ob-orb-1"></div>
        <div class="ob-orb ob-orb-2"></div>

        <div class="ob-form-panel">
          <button class="ob-back-welcome" id="ob-back-welcome" aria-label="Back to profile selection">
            ← Change profile type
          </button>

          <!-- Progress Header -->
          <div class="ob-progress-header">
            <div class="ob-progress-meta">
              <span class="ob-profile-badge ob-badge-corporate">🏢 Business</span>
              <span class="ob-step-counter" id="ob-step-counter">Step ${currentStep} of ${totalSteps}</span>
            </div>
            <div class="ob-progress-bar-track">
              <div class="ob-progress-bar-fill ob-progress-fill-cyan" id="ob-progress-fill" style="width: ${(currentStep / totalSteps) * 100}%"></div>
            </div>
            <div class="ob-progress-steps">
              ${['Identity', 'Business', 'Preferences'].map(
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

          <!-- Navigation -->
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
              <button class="ob-btn ob-btn-primary ob-btn-cyan" id="ob-btn-next" type="button">
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
    const backWelcome = container.querySelector('#ob-back-welcome');
    if (backWelcome) backWelcome.addEventListener('click', onBack);

    const backBtn = container.querySelector('#ob-btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        collectCurrentStep();
        goToStep(currentStep - 1, 'back');
      });
    }

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

    const skipBtn = container.querySelector('#ob-btn-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        collectCurrentStep();
        Object.assign(formData, STEP3_DEFAULTS);
        submitProfile();
      });
    }

    // Country → auto-fill currency + fiscal year + GSTIN hint
    const countrySelect = container.querySelector('#corp-country');
    if (countrySelect) {
      countrySelect.addEventListener('change', () => {
        const country = COUNTRIES.find((c) => c.code === countrySelect.value);
        if (country) {
          const currencySelect = container.querySelector('#corp-currency');
          if (currencySelect) currencySelect.value = country.currency;
          const fiscalSelect = container.querySelector('#corp-fiscal');
          if (fiscalSelect) fiscalSelect.value = getFiscalYearDefault(countrySelect.value);
          const gstinHint = container.querySelector('#ob-gstin-hint');
          const gstinInput = container.querySelector('#corp-gstin');
          const hint = getGSTINHint(countrySelect.value);
          if (gstinHint) gstinHint.textContent = hint;
          if (gstinInput) gstinInput.placeholder = hint;
        }
      });
    }

    // Radio cards
    const radioCards = container.querySelectorAll('.ob-radio-card');
    radioCards.forEach((card) => {
      const radio = card.querySelector('input[type="radio"]');
      radio?.addEventListener('change', () => {
        // Only update siblings in same group
        const name = radio.name;
        container.querySelectorAll(`input[name="${name}"]`).forEach((r) => {
          r.closest('.ob-radio-card')?.classList.remove('ob-radio-card-selected');
        });
        if (radio.checked) card.classList.add('ob-radio-card-selected');
      });
    });

    // Theme cards
    const themeCards = container.querySelectorAll('.ob-theme-card');
    themeCards.forEach((card) => {
      const radio = card.querySelector('input[type="radio"]');
      radio?.addEventListener('change', () => {
        themeCards.forEach((c) => c.classList.remove('ob-theme-card-selected'));
        if (radio.checked) card.classList.add('ob-theme-card-selected');
      });
    });

    // AI toggle description
    const aiToggle = container.querySelector('#corp-ai');
    const aiDesc = container.querySelector('#ob-corp-ai-desc');
    if (aiToggle && aiDesc) {
      aiToggle.addEventListener('change', () => {
        aiDesc.textContent = aiToggle.checked
          ? 'Uses built-in Gemma AI model (~1.4 GB download on first use)'
          : 'Smart categorization, invoice suggestions & business insights';
      });
    }
  }

  function collectCurrentStep() {
    const CURRENCIES_MAP = Object.fromEntries(CURRENCIES.map((c) => [c.code, c.symbol]));

    if (currentStep === 1) {
      formData.ownerName = container.querySelector('#corp-owner-name')?.value?.trim() || '';
      formData.businessName = container.querySelector('#corp-biz-name')?.value?.trim() || '';
      formData.businessType = container.querySelector('input[name="businessType"]:checked')?.value || 'freelancer';
      const countryCode = container.querySelector('#corp-country')?.value || 'IN';
      const country = COUNTRIES.find((c) => c.code === countryCode);
      formData.country = countryCode;
      formData.locale = country?.locale || 'en-IN';
      const currencyCode = container.querySelector('#corp-currency')?.value || 'INR';
      formData.currency = currencyCode;
      formData.currencySymbol = CURRENCIES_MAP[currencyCode] || currencyCode;
    }

    if (currentStep === 2) {
      formData.gstin = container.querySelector('#corp-gstin')?.value?.trim() || '';
      formData.industry = container.querySelector('#corp-industry')?.value || 'tech';
      formData.monthlyRevenue = Number(container.querySelector('#corp-revenue')?.value || 0);
      formData.fiscalYearStart = container.querySelector('#corp-fiscal')?.value || 'April';
      formData.clientCount = container.querySelector('input[name="clientCount"]:checked')?.value || '1-5';
    }

    if (currentStep === 3) {
      formData.categoryPreset = container.querySelector('#corp-categories')?.checked ?? true;
      formData.enableGST = container.querySelector('#corp-gst')?.checked ?? true;
      formData.enableInvoicing = container.querySelector('#corp-invoicing')?.checked ?? true;
      formData.theme = container.querySelector('input[name="theme"]:checked')?.value || 'dark';
      formData.language = container.querySelector('#corp-language')?.value || 'en';
      formData.aiEnabled = container.querySelector('#corp-ai')?.checked || false;
      formData.notificationsEnabled = container.querySelector('#corp-notifications')?.checked ?? true;
      formData.defaultView = container.querySelector('#corp-default-view')?.value || 'dashboard';
    }
  }

  function validateCurrentStep() {
    if (currentStep === 1) {
      const ownerName = container.querySelector('#corp-owner-name')?.value?.trim();
      const bizName = container.querySelector('#corp-biz-name')?.value?.trim();
      if (!ownerName) {
        showFieldError('#corp-owner-name', 'Please enter your full name');
        return false;
      }
      if (!bizName) {
        showFieldError('#corp-biz-name', 'Please enter your business name');
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
      field.parentElement.querySelector('.ob-error-msg')?.remove();
    }, { once: true });
  }

  function goToStep(step, direction) {
    const stepContainer = container.querySelector('#ob-step-container');
    if (!stepContainer) return;

    const current = stepContainer.querySelector('.ob-step-content');
    if (current) {
      current.classList.add(direction === 'forward' ? 'ob-slide-out-left' : 'ob-slide-out-right');
    }

    setTimeout(() => {
      currentStep = step;
      stepContainer.innerHTML = getStepContent(step);

      const fill = container.querySelector('#ob-progress-fill');
      if (fill) fill.style.width = `${(step / totalSteps) * 100}%`;

      const counter = container.querySelector('#ob-step-counter');
      if (counter) counter.textContent = `Step ${step} of ${totalSteps}`;

      const dots = container.querySelectorAll('.ob-prog-step');
      dots.forEach((dot, i) => {
        dot.classList.remove('ob-prog-done', 'ob-prog-active');
        if (i + 1 < step) dot.classList.add('ob-prog-done');
        if (i + 1 === step) dot.classList.add('ob-prog-active');
        const dotInner = dot.querySelector('.ob-prog-dot');
        if (dotInner) dotInner.textContent = i + 1 < step ? '✓' : String(i + 1);
      });

      const nextBtn = container.querySelector('#ob-btn-next');
      if (nextBtn) nextBtn.textContent = step === totalSteps ? '🚀 Create Profile' : 'Continue →';

      const navRight = container.querySelector('.ob-nav-right');
      if (navRight && nextBtn) {
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
    collectCurrentStep();
    container.innerHTML = renderCreating();

    const steps = [
      container.querySelector('#ob-cstep-1'),
      container.querySelector('#ob-cstep-2'),
      container.querySelector('#ob-cstep-3'),
    ];

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

  renderWrapper();
}

export default { renderCorporateForm };
