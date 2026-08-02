import { add } from '../../db.js';

export async function createDefaultAccounts(profile) {
  if (!profile) return;
  
  const baseCurrency = profile.baseCurrency || 'USD';
  const now = Date.now();
  const accountsToCreate = [];
  
  if (profile.type === 'corporate') {
    accountsToCreate.push(
      { name: 'Business Account', type: 'business', icon: '🏢', color: '#007bff' },
      { name: 'Cash', type: 'cash', icon: '💵', color: '#28a745' },
      { name: 'Petty Cash', type: 'pettycash', icon: '💰', color: '#ffc107' }
    );
  } else {
    // Individual
    if (profile.country === 'India' || baseCurrency === 'INR') {
      accountsToCreate.push(
        { name: 'Cash', type: 'cash', icon: '💵', color: '#28a745' },
        { name: 'Bank Account', type: 'savings', icon: '🏦', color: '#007bff' }
      );
    } else {
      accountsToCreate.push(
        { name: 'Checking Account', type: 'checking', icon: '🏧', color: '#007bff' },
        { name: 'Cash', type: 'cash', icon: '💵', color: '#28a745' }
      );
    }
  }

  for (let i = 0; i < accountsToCreate.length; i++) {
    const acc = accountsToCreate[i];
    await add('accounts', {
      id: crypto.randomUUID(),
      profileId: profile.id,
      name: acc.name,
      type: acc.type,
      institution: '',
      currency: baseCurrency,
      initialBalance: 0,
      currentBalance: 0,
      color: acc.color,
      icon: acc.icon,
      isDefault: i === 0,
      isActive: true,
      createdAt: now,
      updatedAt: now
    });
  }
}
