export function render(container) {
  container.innerHTML = `
    <div class="debt-module" style="padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-8);">
      
      <!-- Active Loans Section -->
      <div>
        <h1 style="color: var(--text-primary); font-size: 1.5rem; font-weight: 600; margin: 0; margin-bottom: var(--space-6);">Active Loans</h1>
        <div class="loans-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-6);">
          
          <div class="glass-card" style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h3 style="color: var(--text-primary); font-weight: 500; font-size: 1.125rem; margin: 0; margin-bottom: var(--space-1);">Car Loan</h3>
                <span class="badge badge-warning">Auto</span>
              </div>
              <div style="text-align: right;">
                <div style="color: var(--text-primary); font-size: 1.25rem; font-weight: 600;">$12,500</div>
                <div style="color: var(--text-secondary); font-size: 0.75rem;">Principal Remaining</div>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: var(--space-3); margin-top: var(--space-2);">
              <div class="stat-card">
                <span class="stat-label">Interest Rate</span>
                <span class="stat-value" style="font-size: 1rem;">4.5%</span>
              </div>
              <div class="stat-card" style="text-align: right;">
                <span class="stat-label">Monthly EMI</span>
                <span class="stat-value" style="font-size: 1rem;">$350</span>
              </div>
            </div>
          </div>

          <div class="glass-card" style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h3 style="color: var(--text-primary); font-weight: 500; font-size: 1.125rem; margin: 0; margin-bottom: var(--space-1);">Home Loan</h3>
                <span class="badge badge-info">Mortgage</span>
              </div>
              <div style="text-align: right;">
                <div style="color: var(--text-primary); font-size: 1.25rem; font-weight: 600;">$245,000</div>
                <div style="color: var(--text-secondary); font-size: 0.75rem;">Principal Remaining</div>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: var(--space-3); margin-top: var(--space-2);">
              <div class="stat-card">
                <span class="stat-label">Interest Rate</span>
                <span class="stat-value" style="font-size: 1rem;">3.2%</span>
              </div>
              <div class="stat-card" style="text-align: right;">
                <span class="stat-label">Monthly EMI</span>
                <span class="stat-value" style="font-size: 1rem;">$1,200</span>
              </div>
            </div>
          </div>

          <div class="glass-card" style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h3 style="color: var(--text-primary); font-weight: 500; font-size: 1.125rem; margin: 0; margin-bottom: var(--space-1);">Personal Loan</h3>
                <span class="badge badge-danger">Personal</span>
              </div>
              <div style="text-align: right;">
                <div style="color: var(--text-primary); font-size: 1.25rem; font-weight: 600;">$5,000</div>
                <div style="color: var(--text-secondary); font-size: 0.75rem;">Principal Remaining</div>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: var(--space-3); margin-top: var(--space-2);">
              <div class="stat-card">
                <span class="stat-label">Interest Rate</span>
                <span class="stat-value" style="font-size: 1rem;">9.5%</span>
              </div>
              <div class="stat-card" style="text-align: right;">
                <span class="stat-label">Monthly EMI</span>
                <span class="stat-value" style="font-size: 1rem;">$150</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Payoff Calculator Widget -->
      <div class="glass-card" style="max-width: 800px;">
        <h2 style="color: var(--text-primary); font-size: 1.25rem; margin: 0; margin-bottom: var(--space-4);">Payoff Calculator</h2>
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-6);">
          
          <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: var(--space-4);">
            <div>
              <label style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-2); display: block;">Loan Balance ($)</label>
              <input type="number" id="calc-balance" class="input-field" value="12500" min="0" step="100" />
            </div>
            <div>
              <label style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-2); display: block;">Interest Rate (%)</label>
              <input type="number" id="calc-rate" class="input-field" value="4.5" min="0" step="0.1" />
            </div>
            <div>
              <label style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-2); display: block;">Monthly Payment ($)</label>
              <input type="number" id="calc-payment" class="input-field" value="350" min="0" step="10" />
            </div>
          </div>

          <div style="flex: 1; min-width: 250px; background: rgba(0,0,0,0.2); border-radius: var(--radius-md); padding: var(--space-5); display: flex; flex-direction: column; justify-content: center; gap: var(--space-4);">
            <div id="calc-result" style="display: flex; flex-direction: column; gap: var(--space-4);">
              <!-- Results go here -->
            </div>
          </div>

        </div>
      </div>

    </div>
  `;

  const balanceInput = container.querySelector('#calc-balance');
  const rateInput = container.querySelector('#calc-rate');
  const paymentInput = container.querySelector('#calc-payment');
  const resultDiv = container.querySelector('#calc-result');

  const updateCalculator = () => {
    const balance = parseFloat(balanceInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const payment = parseFloat(paymentInput.value) || 0;

    if (balance <= 0 || payment <= 0) {
      resultDiv.innerHTML = '<div style="color: var(--text-secondary);">Enter valid loan details.</div>';
      return;
    }

    const r = (rate / 100) / 12;
    
    if (r > 0 && (balance * r) >= payment) {
      resultDiv.innerHTML = `
        <div style="color: var(--accent-danger); font-weight: 500;">
          Your monthly payment is too low to cover the interest. The loan will never be paid off!
        </div>
      `;
      return;
    }

    let months = 0;
    let totalInterest = 0;

    if (r === 0) {
      months = Math.ceil(balance / payment);
    } else {
      months = -Math.log(1 - (balance * r) / payment) / Math.log(1 + r);
      months = Math.ceil(months);
      totalInterest = (months * payment) - balance;
    }

    const years = Math.floor(months / 12);
    const extraMonths = months % 12;
    const timeString = years > 0 ? `${years} years and ${extraMonths} months` : `${months} months`;

    resultDiv.innerHTML = `
      <div>
        <div style="color: var(--text-secondary); font-size: 0.875rem;">Time to Payoff</div>
        <div style="color: var(--accent-success); font-size: 1.5rem; font-weight: 600;">${timeString}</div>
        <div style="color: var(--text-muted); font-size: 0.875rem; margin-top: var(--space-1);">(${months} total months)</div>
      </div>
      <div style="border-top: 1px solid var(--border-subtle); padding-top: var(--space-4);">
        <div style="color: var(--text-secondary); font-size: 0.875rem;">Total Interest Paid</div>
        <div style="color: var(--accent-danger); font-size: 1.25rem; font-weight: 600;">$${totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
      </div>
    `;
  };

  balanceInput.addEventListener('input', updateCalculator);
  rateInput.addEventListener('input', updateCalculator);
  paymentInput.addEventListener('input', updateCalculator);

  // Initial Calculation
  updateCalculator();
}
