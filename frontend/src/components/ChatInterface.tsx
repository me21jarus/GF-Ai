import React, { useState, useEffect, useRef } from 'react';
import { getHistory, sendMessage, clearHistory } from '../services/api';
import type { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Trash2, Phone, Video, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadHistory = async () => {
        try {
            const data = await getHistory();
            setMessages(data.history || []);
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    };

    const handleSendMessage = async (text: string) => {
        // Optimistic update
        const userMsg: ChatMessage = { role: 'user', parts: [{ text }] };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const response = await sendMessage(text);
            if (response.reply) {
                const modelMsg: ChatMessage = { role: 'model', parts: [{ text: response.reply }] };
                setMessages((prev) => [...prev, modelMsg]);
            } else {
                // Fallback if API doesn't return reply directy but returns full history
                loadHistory();
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            // Ideally remove optimistic message or show error
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (confirm('Are you sure you want to clear our chat history? 😢')) {
            try {
                await clearHistory();
                setMessages([]);
            } catch (error) {
                console.error('Failed to clear history:', error);
            }
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden md:rounded-3xl border-x md:border border-gray-200">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between shadow-sm z-10 border-b border-pink-100">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                            A
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-800 text-lg leading-tight">Anjali ❤️</h1>
                        <p className="text-xs text-green-500 font-medium">Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-pink-500">
                    <Phone size={22} className="cursor-pointer hover:text-pink-600 transition-colors" />
                    <Video size={24} className="cursor-pointer hover:text-pink-600 transition-colors" />
                    <Trash2 size={20} onClick={handleClearHistory} className="cursor-pointer hover:text-red-500 transition-colors text-gray-400" />
                </div>
            </header>

            {/* Messages */}
            <div
                className="flex-1 overflow-y-auto p-4 bg-cover bg-center"
                style={{
                    backgroundColor: '#fdf2f8',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbcfe8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` // Subtle pattern
                }}
            >
                <div className="space-y-4 pb-2">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 mt-10 text-sm">
                            <p>Say hello to Anjali! 👋</p>
                            <p className="text-xs mt-1">She's waiting for your message...</p>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} message={msg} />
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start items-center gap-2 mb-4 ml-2"
                        >
                            <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-500">
                                <Heart size={16} fill="currentColor" />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow border border-pink-100 flex gap-1">
                                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white/80 backdrop-blur-md border-t border-pink-100">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
};
