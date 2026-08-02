import { store } from '../../store.js';
import { openModal } from '../transactions/index.js';
import { CATEGORY_MAP } from '../transactions/categories.js';

let unsubscribe = null;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

function calculateKPIs(transactions, accounts) {
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  
  const now = new Date();
  const currentMonthStr = now.toISOString().slice(0, 7); // YYYY-MM
  
  let incomeThisMonth = 0;
  let expensesThisMonth = 0;
  
  for (const tx of transactions) {
    if (tx.date.startsWith(currentMonthStr)) {
      if (tx.type === 'income') incomeThisMonth += tx.amount;
      if (tx.type === 'expense') expensesThisMonth += tx.amount;
    }
  }
  
  let savingsRate = 0;
  if (incomeThisMonth > 0) {
    savingsRate = ((incomeThisMonth - expensesThisMonth) / incomeThisMonth) * 100;
  }
  
  return {
    totalBalance,
    incomeThisMonth,
    expensesThisMonth,
    savingsRate: savingsRate.toFixed(1),
  };
}

function renderRecentTransactions(transactions, accounts) {
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  
  if (recent.length === 0) {
    return `<div style="text-align:center;color:var(--text-secondary);padding:var(--space-4);">No recent transactions</div>`;
  }
  
  return recent.map(tx => {
    const isExpense = tx.type === 'expense';
    const isIncome = tx.type === 'income';
    const amountColor = isIncome ? 'var(--accent-success)' : isExpense ? 'var(--accent-danger)' : 'var(--accent-tertiary)';
    const prefix = isIncome ? '+' : isExpense ? '−' : '⇄';
    const cat = CATEGORY_MAP[tx.category];
    const catName = cat?.label || tx.category || 'Other';
    const catIcon = cat?.icon || '💰';
    const catColor = cat?.colorHex || 'rgba(148,163,184,0.15)';
    
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle);">
        <div style="display:flex;align-items:center;gap:var(--space-3);">
          <div style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${catColor};font-size:1.2rem;">
            ${catIcon}
          </div>
          <div>
            <div style="font-weight:500;color:var(--text-primary);">${tx.description || tx.merchant || 'Transaction'}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary);">${catName} • ${new Date(tx.date).toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</div>
          </div>
        </div>
        <div style="font-weight:600;color:${amountColor};">
          ${prefix}${formatCurrency(tx.amount)}
        </div>
      </div>
    `;
  }).join('');
}

function renderBudgetOverview(transactions, budgets) {
  const now = new Date();
  const currentMonthStr = now.toISOString().slice(0, 7);
  
  // Calculate expenses per category this month
  const categoryExpenses = {};
  for (const tx of transactions) {
    if (tx.type === 'expense' && tx.date.startsWith(currentMonthStr)) {
      categoryExpenses[tx.category] = (categoryExpenses[tx.category] || 0) + tx.amount;
    }
  }
  
  // Prepare data for top 3 categories by expense or budget
  let topItems = [];
  
  if (budgets && budgets.length > 0) {
    topItems = budgets.map(b => {
      const spent = categoryExpenses[b.categoryId] || 0;
      return {
        id: b.categoryId,
        spent,
        limit: b.amount,
        percentage: Math.min(100, (spent / b.amount) * 100)
      };
    }).sort((a, b) => b.spent - a.spent).slice(0, 3);
  } else {
    topItems = Object.entries(categoryExpenses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, spent]) => {
        // Mock a limit for display if no budget exists
        const limit = spent > 0 ? spent * 1.5 : 100;
        return {
          id,
          spent,
          limit,
          percentage: (spent / limit) * 100
        };
      });
  }
  
  if (topItems.length === 0) {
    return `<div style="text-align:center;color:var(--text-secondary);padding:var(--space-4);">No data for this month</div>`;
  }
  
  return `<div style="display:flex;justify-content:space-around;flex-wrap:wrap;gap:var(--space-4);padding:var(--space-4) 0;">
    ${topItems.map(item => {
      const cat = CATEGORY_MAP[item.id];
      const catName = cat?.label || item.id;
      const radius = 36;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (item.percentage / 100) * circumference;
      const color = item.percentage > 90 ? 'var(--accent-danger)' : item.percentage > 75 ? 'var(--accent-warning)' : 'var(--accent-primary)';
      
      return `
        <div style="display:flex;flex-direction:column;align-items:center;gap:var(--space-2);">
          <div style="position:relative;width:80px;height:80px;">
            <svg class="progress-ring" width="80" height="80" style="transform:rotate(-90deg);">
              <circle cx="40" cy="40" r="${radius}" fill="transparent" stroke="var(--border-subtle)" stroke-width="6"/>
              <circle cx="40" cy="40" r="${radius}" fill="transparent" stroke="${color}" stroke-width="6" 
                stroke-dasharray="${circumference} ${circumference}" 
                stroke-dashoffset="${offset}" 
                stroke-linecap="round" 
                style="transition: stroke-dashoffset 0.5s ease-in-out;"/>
            </svg>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">
              ${cat?.icon || '💰'}
            </div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:0.85rem;font-weight:600;color:var(--text-primary);">${catName}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary);">${Math.round(item.percentage)}% used</div>
          </div>
        </div>
      `;
    }).join('')}
  </div>`;
}

export function renderDashboard(container) {
  const { transactions, accounts, budgets } = store.state;
  const kpis = calculateKPIs(transactions, accounts);
  
  container.innerHTML = `
    <div class="dashboard-layout" style="position:relative;min-height:100%;">
      <!-- Top Row: KPIs -->
      <div class="kpi-row">
        <div class="glass-card stat-card">
          <span class="stat-label">Total Balance</span>
          <span class="stat-value" style="color: ${kpis.totalBalance >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'};">
            ${formatCurrency(kpis.totalBalance)}
          </span>
        </div>
        <div class="glass-card stat-card">
          <span class="stat-label">Income this Month</span>
          <span class="stat-value" style="color: var(--accent-success);">
            ${formatCurrency(kpis.incomeThisMonth)}
          </span>
        </div>
        <div class="glass-card stat-card">
          <span class="stat-label">Expenses this Month</span>
          <span class="stat-value" style="color: var(--accent-danger);">
            ${formatCurrency(kpis.expensesThisMonth)}
          </span>
        </div>
        <div class="glass-card stat-card">
          <span class="stat-label">Savings Rate</span>
          <span class="stat-value" style="color: ${kpis.savingsRate > 20 ? 'var(--accent-success)' : 'var(--accent-warning)'};">
            ${kpis.savingsRate}%
          </span>
        </div>
      </div>
      
      <!-- Middle Row -->
      <div class="charts-grid">
        <div class="glass-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);">
            <h3 style="font-size:1.125rem;font-weight:600;">Recent Transactions</h3>
            <a href="#/transactions" style="color:var(--accent-primary);text-decoration:none;font-size:0.875rem;">View All</a>
          </div>
          <div class="recent-transactions">
            ${renderRecentTransactions(transactions, accounts)}
          </div>
        </div>
        
        <div class="glass-card">
          <h3 style="font-size:1.125rem;font-weight:600;margin-bottom:var(--space-4);">Budget Overview</h3>
          ${renderBudgetOverview(transactions, budgets)}
        </div>
      </div>
      
      <!-- Floating Quick Add -->
      <button id="quick-add-btn" style="position:fixed;bottom:var(--space-6);right:var(--space-6);width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));color:#fff;border:none;box-shadow:0 4px 20px rgba(99,102,241,0.5);display:flex;align-items:center;justify-content:center;font-size:1.5rem;cursor:pointer;z-index:90;transition:transform 0.2s;">
        +
      </button>
    </div>
  `;
  
  const quickAddBtn = container.querySelector('#quick-add-btn');
  if (quickAddBtn) {
    quickAddBtn.addEventListener('click', () => {
      openModal();
    });
    quickAddBtn.addEventListener('mouseover', () => quickAddBtn.style.transform = 'scale(1.1)');
    quickAddBtn.addEventListener('mouseout', () => quickAddBtn.style.transform = 'scale(1)');
  }
}

export default {
  render(container) {
    renderDashboard(container);
    
    // Subscribe to changes in accounts, transactions, or budgets
    unsubscribe = store.subscribeAll((key) => {
      if (['transactions', 'accounts', 'budgets'].includes(key)) {
        renderDashboard(container);
      }
    });
  },
  destroy() {
    if (unsubscribe) unsubscribe();
  }
};
