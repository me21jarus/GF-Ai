import React from 'react';
import { motion } from 'framer-motion';
import type { ChatMessage } from '../types';
import { User, Heart } from 'lucide-react';

interface MessageBubbleProps {
    message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const text = message.parts[0].text;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 items-end gap-2`}
        >
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-500 shadow-sm border border-pink-300">
                    <Heart size={16} fill="currentColor" />
                </div>
            )}

            <div
                className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-md text-sm md:text-base leading-relaxed relative ${isUser
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none border border-pink-100' // Pink border for Anjali
                    }`}
            >
                {text}
                <span className={`text-[10px] absolute bottom-1 ${isUser ? 'right-3 text-blue-100' : 'left-3 text-gray-400'}`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {isUser && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 shadow-sm">
                    <User size={18} />
                </div>
            )}
        </motion.div>
    );
};
