export function calculateFinancialHealth(transactions) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const periodStart = `${y}-${String(m + 1).padStart(2, '0')}-01`;
  
  let income = 0;
  let expense = 0;

  for (const tx of transactions) {
    if (tx.date >= periodStart) {
      const amount = tx.convertedAmount ?? tx.amount;
      if (tx.type === 'income') income += amount;
      else if (tx.type === 'expense') expense += amount;
    }
  }

  if (income === 0) {
    return { score: 30, savingsRate: 0, income: 0, expense };
  }

  const savingsRate = ((income - expense) / income) * 100;
  let score = 50; // default medium

  if (savingsRate > 20) {
    score = 100;
  } else if (savingsRate >= 10) {
    score = 70;
  } else if (savingsRate >= 0) {
    score = 50;
  } else {
    score = 30;
  }

  return { score, savingsRate, income, expense };
}

export function renderHealthScoreSVG(score) {
  let color = '#ef4444';
  if (score >= 70) color = '#22c55e';
  else if (score >= 50) color = '#eab308';

  const strokeDasharray = `${(score / 100) * 283} 283`;

  return `
    <div style="display:flex; align-items:center; gap: 16px;">
      <svg viewBox="0 0 100 100" class="health-score-svg" style="width: 80px; height: 80px;">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="${color}" stroke-width="8" 
                stroke-dasharray="${strokeDasharray}" stroke-dashoffset="0" 
                transform="rotate(-90 50 50)" stroke-linecap="round" style="transition: stroke-dasharray 1s ease-out" />
        <text x="50" y="58" font-size="24" text-anchor="middle" font-weight="bold" fill="${color}">${score}</text>
      </svg>
      <div>
        <h3 style="margin:0; font-size:1.1rem; color: var(--text-primary);">Financial Health Score</h3>
        <p style="margin:4px 0 0; font-size:0.85rem; color: var(--text-secondary);">Based on current month's savings rate.</p>
      </div>
    </div>
  `;
}
