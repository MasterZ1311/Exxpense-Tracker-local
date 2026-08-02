const API_CONFIG_KEY = 'fintrack_api_config';

export function saveApiConfig(provider, apiKey, model) {
  // In production, encrypt this!
  const config = { provider, apiKey, model };
  localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
}

export function getApiConfig() {
  const data = localStorage.getItem(API_CONFIG_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export async function testApiConnection() {
  const config = getApiConfig();
  if (!config) return false;
  
  try {
    await callUserApi([{role: 'user', content: 'Ping'}]);
    return true;
  } catch(e) {
    console.error("API Connection Test Failed:", e);
    return false;
  }
}

export async function callUserApi(messages) {
  const config = getApiConfig();
  if (!config) {
    throw new Error("No API config found");
  }

  const { provider, apiKey, model } = config;

  if (provider === 'gemini') {
    return callGemini(apiKey, model, messages);
  } else if (provider === 'openai') {
    return callOpenAI(apiKey, model, messages);
  } else if (provider === 'groq') {
    return callGroq(apiKey, model, messages);
  } else if (provider === 'anthropic') {
    return callAnthropic(apiKey, model, messages);
  } else if (provider === 'ollama') {
    return callOllama(model, messages);
  }

  throw new Error("Unsupported provider");
}

async function callGemini(apiKey, model = "gemini-1.5-flash", messages) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const geminiMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : m.role,
    parts: [{ text: m.content }]
  }));
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: geminiMessages })
  });
  
  if (!response.ok) throw new Error("Gemini API Error");
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function callOpenAI(apiKey, model = "gpt-3.5-turbo", messages) {
  const url = `https://api.openai.com/v1/chat/completions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model, messages })
  });
  if (!response.ok) throw new Error("OpenAI API Error");
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGroq(apiKey, model = "llama3-8b-8192", messages) {
  const url = `https://api.groq.com/openai/v1/chat/completions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model, messages })
  });
  if (!response.ok) throw new Error("Groq API Error");
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(apiKey, model = "claude-3-haiku-20240307", messages) {
  const url = `https://api.anthropic.com/v1/messages`;
  const systemMsg = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({ 
      model, 
      system: systemMsg ? systemMsg.content : "",
      messages: userMessages,
      max_tokens: 1024
    })
  });
  if (!response.ok) throw new Error("Anthropic API Error");
  const data = await response.json();
  return data.content[0].text;
}

async function callOllama(model = "llama3", messages) {
  const url = `http://localhost:11434/api/chat`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false })
  });
  if (!response.ok) throw new Error("Ollama API Error");
  const data = await response.json();
  return data.message.content;
}
