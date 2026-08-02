import { generate, getEngine } from './webllm-loader.js';
import { callUserApi, getApiConfig } from './user-api.js';

const MERCHANT_MAPPING = {
  // Food & Dining
  'swiggy': 'Food & Dining',
  'zomato': 'Food & Dining',
  'dominos': 'Food & Dining',
  'mcdonalds': 'Food & Dining',
  'starbucks': 'Food & Dining',
  // Transport
  'uber': 'Transport',
  'ola': 'Transport',
  'irctc': 'Travel',
  'indigo': 'Travel',
  'makemytrip': 'Travel',
  'make my trip': 'Travel',
  'cleartrip': 'Travel',
  // Shopping
  'amazon': 'Shopping',
  'flipkart': 'Shopping',
  'myntra': 'Shopping',
  'ajio': 'Shopping',
  // Bills
  'bsnl': 'Bills & Utilities',
  'airtel': 'Bills & Utilities',
  'jio': 'Bills & Utilities',
  'netflix': 'Entertainment',
  'spotify': 'Entertainment',
  'hotstar': 'Entertainment',
  'youtube premium': 'Entertainment',
  // Health
  'apollo': 'Health',
  'fortis': 'Health',
  'practo': 'Health',
  'medplus': 'Health',
  // Payments
  'paytm': null,
  'phonepe': null,
  // International
  'paypal': 'Shopping',
  'stripe': 'Business',
  'shopify': 'Business',
};

const aiCache = new Map();

function extractMerchantFromUPI(description) {
  const parts = description.split('/');
  if (parts.length > 3 && parts[0].toUpperCase() === 'UPI') {
    return parts[3];
  }
  if (description.startsWith('NEFT-') || description.startsWith('IMPS-')) {
    const p = description.split('-');
    if (p.length >= 3) return p.slice(2).join('-');
  }
  return null;
}

export function ruleBasedCategorize(description) {
  const lowerDesc = description.toLowerCase();
  
  for (const [merchant, category] of Object.entries(MERCHANT_MAPPING)) {
    if (lowerDesc.includes(merchant)) {
      if (category === null) return null; 
      return { category, confidence: 0.9, method: 'rules' };
    }
  }

  const extracted = extractMerchantFromUPI(description);
  if (extracted) {
    const lowerExtracted = extracted.toLowerCase();
    for (const [merchant, category] of Object.entries(MERCHANT_MAPPING)) {
      if (lowerExtracted.includes(merchant) && category) {
        return { category, confidence: 0.8, method: 'rules-upi' };
      }
    }
  }
  
  return null;
}

export async function categorizeWithAI(description, categories) {
  const prompt = `You are a financial categorizer. Given a bank transaction description, return the most appropriate category from the list provided.
List: ${categories.join(', ')}
Transaction: "${description}"
Respond with ONLY: {"category": "...", "confidence": 0.0-1.0}`;

  const messages = [{ role: 'user', content: prompt }];
  let responseText = '';

  try {
    if (getApiConfig()) {
      responseText = await callUserApi(messages);
    } else if (getEngine()) {
      responseText = await generate(messages, { max_tokens: 50, temperature: 0.3 });
    } else {
      return { category: 'Uncategorized', confidence: 0 };
    }

    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonStr);
    return { ...result, method: 'ai' };
  } catch (error) {
    console.error("AI Categorization failed:", error);
    return { category: 'Uncategorized', confidence: 0, method: 'error' };
  }
}

export function recordUserCorrection(description, correctedCategory) {
  aiCache.set(description.toLowerCase(), correctedCategory);
}

export function getLearnedPattern(description) {
  return aiCache.get(description.toLowerCase()) || null;
}

export async function categorize(description, categories = []) {
  const learned = getLearnedPattern(description);
  if (learned) {
    return { category: learned, confidence: 1.0, method: 'learned' };
  }

  const ruleResult = ruleBasedCategorize(description);
  if (ruleResult) return ruleResult;

  if (categories && categories.length > 0) {
    return await categorizeWithAI(description, categories);
  }

  return { category: 'Uncategorized', confidence: 0 };
}
