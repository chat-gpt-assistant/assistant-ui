export interface User {
  id: string;
  email: string;
  name: string;
  pictureUrl?: string;
}

export interface Chat {
  id: string;
  title: string;
  createTime: Date;
}

export interface Conversation {
  id: string;
  title: string;
  createTime: Date;
  currentNode: string;
  mapping: { [messageId: string]: ChatNode };
}

export interface ChatNode {
  id: string;
  parent: string | null;
  children: string[];
  message: Message;
}

export interface Message {
  id: string;
  author: Author;
  createTime: Date;
  content: Content;
}

export type Author = "ASSISTANT" | "USER";

export interface Content {
  type: string;
  parts: string[];
  final: boolean;
}

export interface AudioTranscription {
  text: string,
  language?: string,
  duration?: number,
}
