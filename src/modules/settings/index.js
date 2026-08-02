import { store } from '../../store.js';
import { update, clear } from '../../db.js';

export async function render(container) {
  const profile = store.getState('profile') || {};
  
  container.innerHTML = `
    <div class="settings-container" style="max-width: 800px; margin: 0 auto; padding-bottom: var(--space-8);">
      <h2 style="margin-bottom: var(--space-6); font-size: 1.5rem; font-weight: 600;">Settings</h2>
      
      <div class="tabs" style="display: flex; gap: var(--space-4); margin-bottom: var(--space-6); border-bottom: 1px solid var(--border-subtle);">
        <button class="tab-btn active" data-target="tab-profile" style="background: none; border: none; color: var(--text-primary); padding: var(--space-2) 0; cursor: pointer; border-bottom: 2px solid var(--accent-primary); font-weight: 500;">Profile</button>
        <button class="tab-btn" data-target="tab-prefs" style="background: none; border: none; color: var(--text-secondary); padding: var(--space-2) 0; cursor: pointer; font-weight: 500;">Preferences</button>
        <button class="tab-btn" data-target="tab-ai" style="background: none; border: none; color: var(--text-secondary); padding: var(--space-2) 0; cursor: pointer; font-weight: 500;">AI Config</button>
        <button class="tab-btn" data-target="tab-data" style="background: none; border: none; color: var(--text-secondary); padding: var(--space-2) 0; cursor: pointer; font-weight: 500;">Data Management</button>
      </div>

      <div class="tab-content">
        <!-- Profile Tab -->
        <div id="tab-profile" class="tab-pane glass-card" style="display: block;">
          <h3 style="margin-bottom: var(--space-4);">Profile Information</h3>
          <form id="profile-form" style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div>
              <label style="display: block; margin-bottom: var(--space-2); color: var(--text-secondary); font-size: 0.875rem;">Name</label>
              <input type="text" id="prof-name" class="input-field" value="${profile.name || ''}" required>
            </div>
            <div>
              <label style="display: block; margin-bottom: var(--space-2); color: var(--text-secondary); font-size: 0.875rem;">Base Currency</label>
              <select id="prof-currency" class="select-field">
                <option value="USD" ${profile.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                <option value="EUR" ${profile.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                <option value="GBP" ${profile.currency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                <option value="INR" ${profile.currency === 'INR' ? 'selected' : ''}>INR (₹)</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: var(--space-2); color: var(--text-secondary); font-size: 0.875rem;">Monthly Income</label>
              <input type="number" id="prof-income" class="input-field" value="${profile.monthlyIncome || ''}">
            </div>
            <div>
              <label style="display: block; margin-bottom: var(--space-2); color: var(--text-secondary); font-size: 0.875rem;">Financial Goals</label>
              <textarea id="prof-goals" class="input-field" style="resize: vertical; min-height: 80px;" placeholder="E.g., Save $5000 for a car...">${profile.goals || ''}</textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="align-self: flex-start; margin-top: var(--space-2);">Save Profile</button>
          </form>
        </div>

        <!-- Preferences Tab -->
        <div id="tab-prefs" class="tab-pane glass-card" style="display: none;">
          <h3 style="margin-bottom: var(--space-4);">App Preferences</h3>
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div>
              <label style="display: block; margin-bottom: var(--space-2); color: var(--text-secondary); font-size: 0.875rem;">Theme</label>
              <select id="pref-theme" class="select-field">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="oled">OLED (True Black)</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: var(--space-2); color: var(--text-secondary); font-size: 0.875rem;">Language</label>
              <select id="pref-lang" class="select-field">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>

        <!-- AI Config Tab -->
        <div id="tab-ai" class="tab-pane glass-card" style="display: none;">
          <h3 style="margin-bottom: var(--space-4);">AI Assistant Configuration</h3>
          <div style="display: flex; flex-direction: column; gap: var(--space-6);">
            
            <label style="display: flex; align-items: center; gap: var(--space-3); cursor: pointer;">
              <input type="checkbox" id="ai-local-toggle" style="width: 1.25rem; height: 1.25rem; accent-color: var(--accent-primary);">
              <span>Use built-in Gemma 2B (Runs locally)</span>
            </label>

            <div style="border-top: 1px solid var(--border-subtle); padding-top: var(--space-4);">
              <h4 style="margin-bottom: var(--space-3); font-size: 0.875rem; color: var(--text-secondary);">Optional: Use Custom API Key</h4>
              
              <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                <div>
                  <label style="display: block; margin-bottom: var(--space-2); font-size: 0.875rem; color: var(--text-secondary);">Provider</label>
                  <select id="ai-provider" class="select-field">
                    <option value="gemini">Google Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="groq">Groq</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; margin-bottom: var(--space-2); font-size: 0.875rem; color: var(--text-secondary);">API Key</label>
                  <input type="password" id="ai-api-key" class="input-field" placeholder="Enter API Key">
                </div>
                <button id="save-ai-btn" class="btn btn-primary" style="align-self: flex-start;">Save AI Settings</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Management Tab -->
        <div id="tab-data" class="tab-pane glass-card" style="display: none;">
          <h3 style="margin-bottom: var(--space-4);">Data Management</h3>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-6); font-size: 0.875rem;">Export your data for backup or permanently delete everything from your device.</p>
          
          <div style="display: flex; gap: var(--space-4);">
            <button id="btn-export-data" class="btn btn-secondary">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Export All Data (JSON)
            </button>
            <button id="btn-wipe-data" class="btn btn-danger">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Wipe All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  attachEventListeners();
}

function attachEventListeners() {
  // Tab Switching logic
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.style.borderBottom = 'none';
        b.style.color = 'var(--text-secondary)';
      });
      tabPanes.forEach(p => p.style.display = 'none');
      
      // Activate clicked
      btn.classList.add('active');
      btn.style.borderBottom = '2px solid var(--accent-primary)';
      btn.style.color = 'var(--text-primary)';
      const target = btn.getAttribute('data-target');
      document.getElementById(target).style.display = 'block';
    });
  });

  // Load current theme
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.getElementById('pref-theme').value = currentTheme;
  
  document.getElementById('pref-theme').addEventListener('change', (e) => {
    const val = e.target.value;
    document.documentElement.setAttribute('data-theme', val);
    localStorage.setItem('theme', val);
  });

  // Profile Form
  document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const profile = store.getState('profile') || {};
    profile.name = document.getElementById('prof-name').value;
    profile.currency = document.getElementById('prof-currency').value;
    profile.monthlyIncome = parseFloat(document.getElementById('prof-income').value) || 0;
    profile.goals = document.getElementById('prof-goals').value;
    
    await update('profiles', profile);
    store.setState('profile', profile);
    alert('Profile saved successfully!');
  });

  // AI Settings
  const localToggle = document.getElementById('ai-local-toggle');
  localToggle.checked = localStorage.getItem('ai_use_local') === 'true';

  document.getElementById('save-ai-btn').addEventListener('click', () => {
    localStorage.setItem('ai_use_local', localToggle.checked);
    localStorage.setItem('ai_provider', document.getElementById('ai-provider').value);
    
    const key = document.getElementById('ai-api-key').value;
    if (key) {
      localStorage.setItem('ai_api_key', key);
      document.getElementById('ai-api-key').value = ''; // clear visually after save
    }
    
    alert('AI settings saved!');
  });

  // Export Data
  document.getElementById('btn-export-data').addEventListener('click', () => {
    const data = {
      profile: store.getState('profile'),
      accounts: store.getState('accounts'),
      transactions: store.getState('transactions'),
      categories: store.getState('categories'),
      budgets: store.getState('budgets')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintrack-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Wipe Data
  document.getElementById('btn-wipe-data').addEventListener('click', async () => {
    if (confirm('Are you absolutely sure you want to wipe ALL data? This action cannot be undone.')) {
      if (confirm('Final warning: All accounts, transactions, and settings will be deleted.')) {
        await clear('profiles');
        await clear('accounts');
        await clear('transactions');
        await clear('categories');
        await clear('budgets');
        localStorage.clear();
        
        window.location.hash = '#/onboarding';
        window.location.reload();
      }
    }
  });
}
