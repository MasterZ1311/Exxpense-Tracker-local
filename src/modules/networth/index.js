import { store } from '../../store.js';

let unsubscribe = null;
let chartInstance = null;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

function calculateNetWorth(accounts, investments) {
  let totalAssets = 0;
  let totalLiabilities = 0;

  const assetList = [];
  const liabilityList = [];

  // Categorize Accounts
  for (const acc of accounts) {
    if (['credit_card', 'loan'].includes(acc.type)) {
      const balance = Math.abs(acc.balance || 0);
      totalLiabilities += balance;
      liabilityList.push({ name: acc.name, balance, type: acc.type });
    } else {
      const balance = acc.balance || 0;
      totalAssets += balance;
      assetList.push({ name: acc.name, balance, type: acc.type });
    }
  }

  // Add Investments to Assets
  if (investments && investments.length > 0) {
    let investmentTotal = 0;
    for (const inv of investments) {
      const val = (inv.quantity || 0) * (inv.currentPrice || 0);
      investmentTotal += val;
    }
    totalAssets += investmentTotal;
    assetList.push({ name: 'Investment Portfolio', balance: investmentTotal, type: 'investment' });
  }

  return {
    netWorth: totalAssets - totalLiabilities,
    totalAssets,
    totalLiabilities,
    assetList,
    liabilityList
  };
}

function renderChart(container) {
  const canvas = container.querySelector('#networth-chart');
  if (!canvas) return;

  if (typeof window.Chart === 'undefined') {
    const ctx = canvas.getContext('2d');
    ctx.font = '14px Inter';
    ctx.fillStyle = 'var(--text-secondary)';
    ctx.fillText('Chart.js is not loaded', 50, 50);
    return;
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  // Mock historical data (last 12 months)
  const labels = [];
  const data = [];
  const now = new Date();
  
  // Starting with a base mock value, and add some random growth
  let baseValue = store.state.accounts.reduce((sum, a) => sum + (a.balance || 0), 0) * 0.5;
  if (baseValue <= 0) baseValue = 10000;

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }));
    
    // Add 1-5% random growth mock
    baseValue = baseValue * (1 + (Math.random() * 0.04 + 0.01)); 
    data.push(baseValue);
  }

  chartInstance = new window.Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Net Worth',
        data,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#6366f1'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { 
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      }
    }
  });
}

function renderNetWorth(container) {
  const { accounts, investments = [] } = store.state;
  const { netWorth, totalAssets, totalLiabilities, assetList, liabilityList } = calculateNetWorth(accounts, investments);

  container.innerHTML = `
    <div style="padding:var(--space-4); max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h2 style="font-size:1.5rem; font-weight:600; color:var(--text-primary);">Net Worth</h2>
      </div>

      <!-- Hero Section -->
      <div class="glass-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-8); text-align: center;">
        <div style="font-size: 1rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-2);">Current Net Worth</div>
        <div style="font-size: 3rem; font-weight: 700; color: ${netWorth >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'};">
          ${formatCurrency(netWorth)}
        </div>
      </div>

      <!-- Chart Section -->
      <div class="glass-card" style="height: 300px; padding: var(--space-4); position: relative;">
        <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-4); color: var(--text-primary);">Growth (Last 12 Months)</h3>
        <div style="position: relative; height: 230px; width: 100%;">
          <canvas id="networth-chart"></canvas>
        </div>
      </div>

      <!-- Breakdown Section -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-6);">
        
        <!-- Assets Column -->
        <div class="glass-card" style="display: flex; flex-direction: column; gap: var(--space-4);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: var(--space-3);">
            <h3 style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary);">Assets</h3>
            <span style="font-weight: 600; color: var(--accent-success);">${formatCurrency(totalAssets)}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${assetList.length === 0 ? '<div style="color:var(--text-secondary); font-size:0.875rem;">No assets found</div>' : ''}
            ${assetList.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 500; color: var(--text-primary);">${item.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: capitalize;">${item.type.replace('_', ' ')}</div>
                </div>
                <div style="font-weight: 500; color: var(--text-primary);">${formatCurrency(item.balance)}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Liabilities Column -->
        <div class="glass-card" style="display: flex; flex-direction: column; gap: var(--space-4);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: var(--space-3);">
            <h3 style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary);">Liabilities</h3>
            <span style="font-weight: 600; color: var(--accent-danger);">${formatCurrency(totalLiabilities)}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${liabilityList.length === 0 ? '<div style="color:var(--text-secondary); font-size:0.875rem;">No liabilities found</div>' : ''}
            ${liabilityList.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 500; color: var(--text-primary);">${item.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: capitalize;">${item.type.replace('_', ' ')}</div>
                </div>
                <div style="font-weight: 500; color: var(--text-primary);">${formatCurrency(item.balance)}</div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `;

  // Initialize chart after the DOM is updated
  setTimeout(() => renderChart(container), 0);
}

export default {
  render(container) {
    renderNetWorth(container);
    
    // Subscribe to changes
    unsubscribe = store.subscribeAll((key) => {
      if (['accounts', 'investments', 'transactions'].includes(key)) {
        renderNetWorth(container);
      }
    });
  },
  destroy() {
    if (unsubscribe) unsubscribe();
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }
};
