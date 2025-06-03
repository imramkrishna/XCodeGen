import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Copy, CheckCheck, Loader2, ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMode() {
  const location = useLocation();
  const { inputValue } = location.state as { inputValue: string} || { inputValue: '' };
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialRequestSent = useRef(false);
  
  // Initialize chat with user's first message if it exists
  useEffect(() => {
    if (inputValue && inputValue.trim() !== '' && !initialRequestSent.current) {
      initialRequestSent.current = true;
      setMessages([{ role: 'user', content: inputValue }]);
      handleInitialMessage(inputValue);
    }
  }, [inputValue]);

  const handleInitialMessage = async (message: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/chatmode`, {
        messages: [{ role: 'user', content: message }]
      });
      
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.data.response }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await axios.post(`${BACKEND_URL}/chatmode`, {
        messages: [...messages, userMessage]
      });
      
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.data.response }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0f1117]">
      <Header />
      
      {/* Main content */}
      <div className="flex flex-col flex-grow w-full mt-16">
        {/* Welcome message if no messages yet */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-grow p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
              <Bot size={32} className="text-white" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white">How can I help you today?</h3>
            <p className="max-w-md text-gray-400">
              Ask me anything about code, websites, or any technical questions you might have.
            </p>
            <div className="grid max-w-3xl grid-cols-1 gap-3 mt-8 sm:grid-cols-2 md:grid-cols-3">
              {["Explain React hooks", "Write a function to reverse a string", "How to create a responsive navbar"].map((suggestion, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setInput(suggestion);
                    setTimeout(() => {
                      const userMessage = { role: 'user', content: suggestion } as Message;
                      setMessages([userMessage]);
                      handleInitialMessage(suggestion);
                    }, 100);
                  }}
                  className="p-4 text-sm text-left text-gray-300 transition-all border border-gray-800 rounded-xl hover:bg-gray-800/50 hover:border-gray-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <>
            {/* Messages container */}
            <div className="flex-grow overflow-y-auto">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`px-4 py-6 md:px-8 lg:px-16 ${
                    message.role === 'assistant' 
                      ? 'bg-[#141627]/70' 
                      : 'bg-[#0f1117]'
                  } border-b border-[#1e2235]`}
                >
                  <div className="flex items-start max-w-4xl gap-4 mx-auto">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                    }`}>
                      {message.role === 'user' 
                        ? <User size={16} className="text-white" /> 
                        : <Bot size={16} className="text-white" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 font-medium text-gray-300">
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </div>
                      <div className="text-gray-100 prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#1e2235] prose-pre:border prose-pre:border-[#2a2f45]">
                        {message.content}
                      </div>
                      
                      {/* Actions for assistant messages */}
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-4 text-gray-500">
                          <button 
                            onClick={() => copyToClipboard(message.content, index)}
                            className="flex items-center gap-1 px-2 py-1 text-xs transition-colors rounded hover:bg-gray-800 hover:text-gray-300"
                          >
                            {copiedIndex === index ? (
                              <>
                                <CheckCheck size={14} />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                Copy
                              </>
                            )}
                          </button>
                          <div className="flex items-center gap-1 ml-1">
                            <button className="p-1 rounded hover:bg-gray-800 hover:text-gray-300">
                              <ThumbsUp size={14} />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-800 hover:text-gray-300">
                              <ThumbsDown size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="px-4 py-6 md:px-8 lg:px-16 bg-[#141627]/70 border-b border-[#1e2235]">
                  <div className="flex items-start max-w-4xl gap-4 mx-auto">
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="mb-1 font-medium text-gray-300">
                        
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 delay-75 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 delay-150 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="ml-1 text-sm">Thinking</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="sticky bottom-0 p-4 bg-[#0f1117] border-t border-[#1e2235] md:p-6">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={sendMessage} className="relative">
                  <div className="overflow-hidden border rounded-xl bg-[#141627] border-[#2a2f45] focus-within:ring-2 focus-within:ring-blue-500/40">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Message AI Assistant..."
                      className="w-full px-4 py-3 text-base resize-none bg-transparent text-gray-100 placeholder:text-gray-500 focus:outline-none min-h-[60px] max-h-[200px]"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (input.trim()) sendMessage(e);
                        }
                      }}
                    />
                    <div className="flex items-center justify-between px-3 py-2 border-t border-[#2a2f45]">
                      <div className="text-xs text-gray-500">
                        Shift + Enter for new line
                      </div>
                      <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className={`px-4 py-1.5 flex items-center gap-1.5 rounded-lg ${
                          input.trim() && !loading
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-[#1e2235] text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {loading ? 'Sending' : 'Send'}
                        <Send size={16} className={loading ? 'animate-pulse' : ''} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatMode;