/**
 * FinTrack Pro — Profile Schema
 * Defines the shape of Individual and Corporate profiles saved to IndexedDB.
 */

/**
 * Create a new Individual profile object.
 * @param {Partial<IndividualProfile>} data
 * @returns {IndividualProfile}
 */
export function createIndividualProfile(data) {
  const now = new Date().toISOString();
  return {
    id: `profile_${Date.now()}`,
    type: 'individual',
    // Step 1
    name: data.name || '',
    dateOfBirth: data.dateOfBirth || null,
    country: data.country || 'IN',
    currency: data.currency || 'INR',
    currencySymbol: data.currencySymbol || '₹',
    locale: data.locale || 'en-IN',
    photoBase64: data.photoBase64 || null,
    // Step 2
    monthlyIncome: data.monthlyIncome || 0,
    occupation: data.occupation || 'salaried',
    goals: data.goals || [],
    riskAppetite: data.riskAppetite || 50, // 0=Conservative, 100=Aggressive
    // Step 3
    theme: data.theme || 'dark',
    language: data.language || 'en',
    aiEnabled: data.aiEnabled ?? false,
    notificationsEnabled: data.notificationsEnabled ?? true,
    defaultView: data.defaultView || 'dashboard',
    // Metadata
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create a new Corporate Individual profile object.
 * @param {Partial<CorporateProfile>} data
 * @returns {CorporateProfile}
 */
export function createCorporateProfile(data) {
  const now = new Date().toISOString();
  return {
    id: `profile_${Date.now()}`,
    type: 'corporate',
    // Step 1
    ownerName: data.ownerName || '',
    businessName: data.businessName || '',
    businessType: data.businessType || 'freelancer',
    country: data.country || 'IN',
    currency: data.currency || 'INR',
    currencySymbol: data.currencySymbol || '₹',
    locale: data.locale || 'en-IN',
    // Step 2
    gstin: data.gstin || '',
    industry: data.industry || 'tech',
    monthlyRevenue: data.monthlyRevenue || 0,
    fiscalYearStart: data.fiscalYearStart || 'April',
    clientCount: data.clientCount || '1-5',
    // Step 3
    enableGST: data.enableGST ?? true,
    enableInvoicing: data.enableInvoicing ?? true,
    categoryPreset: data.categoryPreset ?? true,
    theme: data.theme || 'dark',
    language: data.language || 'en',
    aiEnabled: data.aiEnabled ?? false,
    notificationsEnabled: data.notificationsEnabled ?? true,
    defaultView: data.defaultView || 'dashboard',
    // Metadata
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Smart defaults for "Skip for now" on Step 3.
 */
export const STEP3_DEFAULTS = {
  theme: 'dark',
  language: 'en',
  aiEnabled: false,
  notificationsEnabled: true,
  defaultView: 'dashboard',
};

export default { createIndividualProfile, createCorporateProfile, STEP3_DEFAULTS };
