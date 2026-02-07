import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
            setShowEmojiPicker(false);
        }
    };

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setInput((prev) => prev + emojiData.emoji);
    };

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
            <AnimatePresence>
                {showEmojiPicker && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-16 left-0 z-10 shadow-2xl rounded-2xl overflow-hidden"
                        ref={pickerRef}
                    >
                        <EmojiPicker
                            onEmojiClick={onEmojiClick}
                            theme={Theme.LIGHT}
                            searchDisabled
                            skinTonesDisabled
                            width={350}
                            height={400}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-pink-100"
            >
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-500 hover:text-pink-500 transition-colors rounded-full hover:bg-pink-50"
                >
                    <Smile size={24} />
                </button>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message Anjali..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 text-base"
                />

                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`p-3 rounded-full text-white shadow-md transition-all duration-300 flex items-center justify-center ${input.trim() && !isLoading
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-pink-200 hover:scale-105'
                        : 'bg-gray-300 cursor-not-allowed'
                        }`}
                >
                    <Send size={20} className={isLoading ? 'animate-pulse' : ''} />
                </button>
            </form>
        </div>
    );
};
