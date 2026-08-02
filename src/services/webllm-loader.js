import * as webllm from '@mlc-ai/web-llm';

const MODEL_ID = 'gemma-2-2b-it-q4f16_1-MLC';
let engineCache = null;
let isDownloading = false;

export function isWebGPUSupported() {
  return navigator.gpu !== undefined;
}

export async function downloadModel(onProgress) {
  if (isDownloading) return;
  if (engineCache) return;

  isDownloading = true;
  try {
    const initProgressCallback = (progress) => {
      if (onProgress) {
        onProgress({
          progress: Math.round(progress.progress * 100),
          status: progress.text
        });
      }
    };

    engineCache = await webllm.CreateMLCEngine(
      MODEL_ID,
      { initProgressCallback }
    );
  } catch (error) {
    console.error("WebLLM Download Error:", error);
    engineCache = null;
    throw error;
  } finally {
    isDownloading = false;
  }
}

export function getEngine() {
  return engineCache;
}

export async function generate(messages, options = {}) {
  const engine = getEngine();
  if (!engine) {
    throw new Error("WebLLM engine is not loaded yet.");
  }

  const { max_tokens = 500, temperature = 0.7 } = options;
  
  const systemPrompt = "You are FinTrack Pro, an AI financial assistant running locally on the user's device. You help categorize transactions, provide insights, and answer questions about their finances based on the context provided.";
  
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  const reply = await engine.chat.completions.create({
    messages: fullMessages,
    max_tokens,
    temperature,
  });

  return reply.choices[0].message.content;
}

export function showDownloadPrompt() {
  console.log("Show model download prompt");
}
