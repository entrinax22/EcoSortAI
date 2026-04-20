import { apiFetch } from "./api";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ChatUser = {
  id: number;
  name: string;
  email: string;
};

export type ChatMessage = {
  id: number;
  thread_id: number;
  sender: ChatUser;
  content: string;
  created_at: string;
};

export type ChatThread = {
  id: number;
  participants: ChatUser[];
  last_message: ChatMessage | null;
  unread_count: number;
  updated_at: string;
};

export type SendMessagePayload =
  | { thread_id: number; content: string }
  | { target_user_id: number; content: string };

// ── API calls ─────────────────────────────────────────────────────────────────

export const getThreads = () =>
  apiFetch<ChatThread[]>("/chatbox/api/threads/");

export const getMessages = (threadId: number) =>
  apiFetch<ChatMessage[]>(`/chatbox/api/threads/${threadId}/messages/`);

export const sendMessage = (payload: SendMessagePayload) =>
  apiFetch<ChatMessage>("/chatbox/api/send/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const pingPresence = () =>
  apiFetch<void>("/chatbox/api/presence/ping/", { method: "POST" });

export const deleteThread = (threadId: number) =>
  apiFetch<void>(`/chatbox/api/threads/${threadId}/delete/`, { method: "POST" });

export const deleteMessage = (messageId: number) =>
  apiFetch<void>(`/chatbox/api/messages/${messageId}/delete/`, { method: "POST" });
