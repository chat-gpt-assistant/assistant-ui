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
  currentNode: string;
  mapping: { [key: string]: ChatNode };
}

export interface ChatNode {
  id: string;
  parent: string | null;
  children: string[];
  message: Message;
}

export interface Message {
  id: string;
  author: "assistant" | "user";
  createTime: Date;
  content: Content;
}

export interface Content {
  type: string;
  parts: string[];
}
