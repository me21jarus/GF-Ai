export interface MessagePart {
    text: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: MessagePart[];
}

export interface ChatResponse {
    reply: string;
    history: ChatMessage[];
}
