// src/lib/api.ts
import { BASE_URL } from '@/lib/utils';

/**
  GET
 */

export const getUser = async () => {
  try {
    const sessionRes = await fetch('/api/auth/me');
    const sessionData = await sessionRes.json();
    return sessionData;
  } catch (error) {}
};

export const getQuestions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/singular/questions`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  } catch (error) {
    console.error('getQuestions error:', error);
    throw error;
  }
};

export const getCardsDetails = async (userId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/singular/card-details/${userId}`,
      {
        method: 'GET',
        cache: 'no-store' // <- evita el cacheo en el Server Component
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch cards: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('getCardsDetails error:', error);
    throw error;
  }
};

export const fetchFormattedAnswers = async (userId: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/singular/formatted-answers-and-questions/${userId}`,
      {
        method: 'GET'
      }
    );

  if(!res.ok){
    throw new Error(`faile to fetch answers:${res.status}`)
  }

    return await res.json();
  } catch (error) {
    console.error('Error loading formatted answers:', error);
  }
};

/**
  POST
 */
export const sendMessage = async (
  userMessage: string,
  threadId: string | null,
  assistantId: string | null
) => {
  try {
    const response = await fetch(`${BASE_URL}/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistantId, threadId, userMessage })
    });

    if (!response.ok) throw new Error('Failed to send message');
    return await response.json();
  } catch (error) {
    console.error('sendMessage error:', error);
    return null;
  }
};

export const streamAssistantReply = async (
  payload: {
    assistantId: string | null;
    threadId: string | null;
    userMessage: string;
    instruction: string;
  },
  onData: (chunk: string) => void
) => {
  const res = await fetch(`${BASE_URL}/agent/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok || !res.body) {
    throw new Error('Stream failed to start');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');

  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;

    const chunk = decoder.decode(value, { stream: true });

    const matches = Array.from(chunk.matchAll(/^data: (.*)$/gm)); // Captura cada línea con "data: ...", multiline

    for (const match of matches) {
      const content = match[1];
      if (content !== '[DONE]') {
        try {
          // Usar JSON.parse para desescapar correctamente
          const unescapedContent = JSON.parse(content);
          onData(unescapedContent);
        } catch (e) {
          // Fallback si no es JSON válido
          onData(content);
        }
      }
    }
  }
};

export const sendAnswers = async (
  userId: string,
  answers: { questionId: string; response: string }[]
) => {
  const response = await fetch(
    `${BASE_URL}/singular/respond-questions/${userId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answers: answers })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Error al enviar respuestas:', error);
    return;
  }

  return await response.json();
};
