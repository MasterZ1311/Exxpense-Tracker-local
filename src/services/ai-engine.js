import { getEngine, generate, isWebGPUSupported } from './webllm-loader.js';
import { getApiConfig, callUserApi } from './user-api.js';
import { categorize } from './categorizer.js';

export function isAvailable() {
  if (getApiConfig()) return 'api';
  if (getEngine()) return 'webllm';
  return 'rules'; // Always available
}

export function getCapabilities() {
  const tier = isAvailable();
  if (tier === 'api' || tier === 'webllm') {
    return {
      chat: true,
      smartCategorization: true,
      insights: true,
      tier
    };
  }
  return {
    chat: false,
    smartCategorization: false,
    insights: false,
    tier: 'rules'
  };
}

export async function complete(prompt, context = '') {
  const tier = isAvailable();
  const messages = [];
  
  if (context) {
    messages.push({ role: 'system', content: context });
  }
  messages.push({ role: 'user', content: prompt });

  if (tier === 'api') {
    return await callUserApi(messages);
  } else if (tier === 'webllm') {
    return await generate(messages);
  } else {
    throw new Error("AI Chat is not available. Please enable WebLLM or provide an API key.");
  }
}

export { categorize };

export async function analyze(question, financialData) {
  const context = `Context: ${JSON.stringify(financialData)}`;
  return await complete(question, context);
}
