import { BASE_URL } from '@/lib/utils';

export const createThread = async (
  assistantId: string,
  userEmail: string
): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/agent/create-thread`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ assistantId, userEmail })
    });

    if (!response.ok) {
      throw new Error(`Error al crear thread: ${response.statusText}`);
    }

    const data = await response.json();
    return data.threadId;
  } catch (error) {
    console.error('Error en createThread:', error);
    return null;
  }
};

export const getThreads = async (userEmail: string) => {
  try {
    const res = await fetch(`/api/threads?userEmail=${userEmail}`);
    const data = await res.json();
    const thread = data.threads?.[0];

    if (thread && Array.isArray(thread.messages)) {
      const formattedMessages = thread.messages.map((m: any) => ({
        role: m.role,
        content: m.content
      }));

      return {
        threadId: thread.threadId,
        messages: formattedMessages,
        assistantId: thread.assistantId,
        threads: data.threads
      };
    }
  } catch (error) {
    console.error('Error fetching thread:', error);
  }
};

export const getThreadById = async (threadId: string) => {
  try {
    const res = await fetch(`/api/threads/${threadId}`);
    const data = await res.json();
    const thread = data.thread;

    if (thread && Array.isArray(thread.messages)) {
      const formattedMessages = thread.messages.map((m: any) => ({
        role: m.role,
        content: m.content
      }));

      return {
        ...thread,
        messages: thread.messages.map((m: any) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp
        }))
      };
    }
  } catch (error) {
    console.error('Error fetching thread:', error);
  }
};

export const updateThread = async (
  threadId: string,
  updates: Partial<{ isPendingThread: boolean; name: string }>
) => {
  try {
    const res = await fetch(`${BASE_URL}/thread/${threadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!res.ok) {
      throw new Error(`Failed to update thread: ${res.status}`);
    }

    const data = await res.json();
    return data.thread;
  } catch (error) {
    console.error('Error updating thread:', error);
    throw error;
  }
};

export const deleteThread = async (threadId: string) => {
  const res = await fetch(`${BASE_URL}/thread/${threadId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete thread ${threadId}`);
  return await res.json();
};
