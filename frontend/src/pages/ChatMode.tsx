import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, ThumbsUp, Code, MessageSquare, Info, List, Plus, Home, Search, Settings, User, Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import { parseChat, type ParsedChatResult, type CodeBlock, type Section, type ListItem } from '../chatParser';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  parsedContent?: ParsedChatResult;
}

export function ChatMode() {
  const location = useLocation();
  const { inputValue } = location.state as { inputValue: string } || { inputValue: '' };
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      
      const parsedContent = parseChat(response.data.response);
      console.log("Parsed content:", parsedContent);
      
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: response.data.response,
          parsedContent
        }
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
      
      const parsedContent = parseChat(response.data.response);
      
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: response.data.response,
          parsedContent
        }
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



  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Render a code block with syntax highlighting
  const renderCodeBlock = (block: CodeBlock) => (
    <div key={block.id} className="relative mt-4 mb-6 overflow-hidden border border-gray-700 rounded-lg">
      <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-300 bg-gray-800 sm:px-4">
        <div className="flex items-center">
          <Code size={12} className="mr-2 text-gray-400 sm:w-3.5 sm:h-3.5" />
          <span className="text-xs sm:text-sm">{block.language || 'code'}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={block.language || 'javascript'}
          style={nightOwl}
          customStyle={{
            margin: 0,
            padding: '0.75rem',
            borderRadius: 0,
            fontSize: '0.8rem',
            backgroundColor: '#1a1a1a',
          }}
          className="sm:text-sm"
        >
          {block.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );

  // Render list items with appropriate styling
  const renderListItems = (items: ListItem[]) => (
    <ul className="pl-4 mt-2 space-y-1 list-disc sm:pl-5 sm:mt-3 sm:space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-sm text-gray-200 sm:text-base">
          {item.type === 'titled' ? (
            <div>
              <span className="font-semibold text-teal-400">{item.title}</span>
              {item.description && (
                <span className="text-gray-300"> — {item.description}</span>
              )}
            </div>
          ) : (
            item.title
          )}
        </li>
      ))}
    </ul>
  );

  // Render a section with its title, content, list items and code blocks
  const renderSection = (section: Section, index: number) => (
    <div key={index} className="py-2 mt-2 mb-3 sm:py-3 sm:mb-4">
      {section.title && (
        <h3 className={`text-base sm:text-lg font-semibold mb-2 flex items-center ${
          section.type === 'features' ? 'text-teal-400' :
          section.type === 'code' ? 'text-green-400' :
          section.type === 'benefits' ? 'text-purple-400' :
          section.type === 'concepts' ? 'text-amber-400' :
          'text-gray-200'
        }`}>
          {section.type === 'features' && <List size={16} className="mr-2 sm:w-4 sm:h-4" />}
          {section.type === 'code' && <Code size={16} className="mr-2 sm:w-4 sm:h-4" />}
          {section.type === 'benefits' && <ThumbsUp size={16} className="mr-2 sm:w-4 sm:h-4" />}
          {section.type === 'concepts' && <Info size={16} className="mr-2 sm:w-4 sm:h-4" />}
          {section.title}
        </h3>
      )}
      
      {section.content && (
        <div className="text-sm text-gray-300 sm:text-base">
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p className="mb-2 leading-relaxed sm:mb-3" {...props} />,
              a: ({node, ...props}) => <a className="text-teal-400 underline hover:text-teal-300" target="_blank" rel="noopener noreferrer" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
              em: ({node, ...props}) => <em className="italic text-gray-200" {...props} />,
              code: ({node, ...props}) => {
                const { className } = props;
                const isInline = !className || !className.includes('language-');
                return isInline ? 
                  <code className="px-1 py-0.5 text-xs rounded bg-gray-800 text-pink-400 sm:text-sm" {...props} /> :
                  <code {...props} />
              }
            }}
          >
            {section.content}
          </ReactMarkdown>
        </div>
      )}
      
      {section.items.length > 0 && renderListItems(section.items)}
      {section.codeBlocks.map(renderCodeBlock)}
      
      {section.subsections.map((subsection, i) => (
        <div key={`subsection-${i}`} className="pl-3 mt-3 mb-2 border-l-2 border-gray-700 sm:pl-4 sm:mt-4">
          {renderSection(subsection, i)}
        </div>
      ))}
    </div>
  );

  // Render full structured content
  const renderStructuredContent = (parsedContent: ParsedChatResult) => (
    <div className="text-gray-100">
      {parsedContent.introduction && (
        <div className="mb-4 sm:mb-6">
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p className="mb-2 leading-relaxed sm:mb-3" {...props} />,
              a: ({node, ...props}) => <a className="text-teal-400 underline hover:text-teal-300" target="_blank" rel="noopener noreferrer" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
              code: ({node, ...props}) => {
                const { className } = props;
                const isInline = !className || !className.includes('language-');
                return isInline ? 
                  <code className="px-1 py-0.5 text-xs rounded bg-gray-800 text-pink-400 sm:text-sm" {...props} /> :
                  <code {...props} />
              }
            }}
          >
            {parsedContent.introduction}
          </ReactMarkdown>
        </div>
      )}
      
      {parsedContent.sections.map(renderSection)}
      
      {parsedContent.codeBlocks
        .filter(block => 
          !parsedContent.sections.some(section => 
            section.codeBlocks.some(sectionBlock => sectionBlock.id === block.id)
          )
        )
        .map(renderCodeBlock)
      }
      
      {parsedContent.conclusion && (
        <div className="pt-3 mt-4 border-t border-gray-800/60 sm:pt-4 sm:mt-6">
          <h4 className="flex items-center mb-2 text-base font-medium text-gray-200 sm:mb-3 sm:text-lg">
            <MessageSquare size={16} className="mr-2 text-teal-400 sm:w-4 sm:h-4" />
            Conclusion
          </h4>
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p className="text-sm leading-relaxed text-gray-300 sm:text-base" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />
            }}
          >
            {parsedContent.conclusion}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen text-white" style={{ backgroundColor: '#181a1b' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Hidden on mobile, slide-in when open */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 h-full 
        border-r border-gray-700 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 flex flex-col
        ${!sidebarOpen ? 'hidden md:flex' : 'flex'}
      `} style={{ backgroundColor: '#181a1b' }}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <img src="/hexadev.svg" alt="XCodeGen" className="w-8 h-8 rounded-full" />
            <span className="font-medium text-white">XCodeGen</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-gray-400 md:hidden hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button className="flex items-center w-full gap-3 px-4 py-2 text-left text-gray-300 transition-colors bg-gray-700 rounded-lg hover:bg-gray-600">
            <Plus size={16} />
            <span>New Thread</span>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 pb-4">
          <div className="space-y-1">
            <button className="flex items-center w-full gap-3 px-3 py-2 text-left text-gray-300 transition-colors rounded-lg hover:bg-gray-700">
              <Home size={16} />
              <span>Home</span>
            </button>
            <button className="flex items-center w-full gap-3 px-3 py-2 text-left text-gray-300 transition-colors rounded-lg hover:bg-gray-700">
              <Search size={16} />
              <span>Discover</span>
            </button>
            <button className="flex items-center w-full gap-3 px-3 py-2 text-left text-gray-300 transition-colors rounded-lg hover:bg-gray-700">
              <MessageSquare size={16} />
              <span>Spaces</span>
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center w-full gap-3 px-3 py-2 text-left text-gray-300 transition-colors rounded-lg hover:bg-gray-700">
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button className="flex items-center w-full gap-3 px-3 py-2 mt-1 text-left text-gray-300 transition-colors rounded-lg hover:bg-gray-700">
            <User size={16} />
            <span>Sign In</span>
          </button>
        </div>
      </div>
      
      {/* Main content - Full width on mobile */}
      <div className="flex flex-col flex-grow w-full h-full overflow-hidden md:w-auto">
        {/* Mobile Header - Always visible on mobile */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700 md:hidden" style={{ backgroundColor: '#181a1b' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 rounded-md hover:text-white hover:bg-gray-700"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <img src="/hexadev.svg" alt="XCodeGen" className="w-6 h-6 rounded-full" />
            <span className="font-medium text-white">XCodeGen</span>
          </div>
          <div className="w-10"></div> {/* Spacer for center alignment */}
        </div>
        {/* Welcome message if no messages yet */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-grow px-4 py-6 overflow-y-auto sm:px-6 lg:px-8">
            {/* Header section */}
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center w-8 h-8 mr-3 bg-gray-800 rounded-lg">
                <Bot size={20} className="text-gray-400" />
              </div>
              <h1 className="text-xl font-normal text-white sm:text-2xl">XCodeGen</h1>
            </div>
            
            {/* Initial greeting */}
            <div className="max-w-sm mb-6 text-center sm:max-w-md lg:max-w-2xl sm:mb-8">
              <p className="text-sm text-gray-300 sm:text-base lg:text-lg sm:mb-2">Hello! I'm XCodeGen, your AI coding assistant. How can I help you today?</p>
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
                  className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 lg:px-16"
                >
                  <div className="max-w-full mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
                    {message.role === 'user' ? (
                      // User message bubble (right side)
                      <div className="flex justify-end mb-3 sm:mb-4">
                        <div className="flex items-center max-w-[90%] sm:max-w-[80%] md:max-w-md lg:max-w-lg gap-2 sm:gap-3">
                          <div className="px-3 py-2 text-sm text-white break-words bg-gray-700 sm:px-4 sm:text-base rounded-2xl">
                            {message.content}
                          </div>
                          <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-white bg-gray-600 rounded-full sm:w-8 sm:h-8">
                            <User size={12} className="sm:w-4 sm:h-4" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Assistant message (left side)
                      <div className="flex items-start gap-2 mb-3 sm:gap-3 sm:mb-6">
                        <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-white rounded-full sm:w-8 sm:h-8">
                          <img src="/hexadev.svg" alt="XCodeGen" className="w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-1 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
                            XCodeGen
                          </div>
                      
                          <div className="text-sm text-gray-200 sm:text-base">
                            {message.parsedContent ? (
                              renderStructuredContent(message.parsedContent)
                            ) : (
                              <div className="prose-sm prose prose-invert sm:prose-base prose-p:leading-relaxed">
                                {message.content}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 lg:px-16">
                  <div className="max-w-full mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
                    <div className="flex items-start gap-2 mb-3 sm:gap-3 sm:mb-6">
                      <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-white rounded-full sm:w-8 sm:h-8">
                        <img src="/hexadev.svg" alt="XCodeGen" className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
                          XCodeGen
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 delay-150 bg-orange-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 delay-300 bg-orange-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="sticky bottom-0 p-3 sm:p-4 md:p-6" style={{ backgroundColor: '#181a1b' }}>
              <div className="max-w-full mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
                <form onSubmit={sendMessage} className="relative">
                  <div className="relative flex items-center transition-colors bg-gray-800 border border-gray-600 rounded-xl focus-within:border-gray-500">
                    <div className="items-center hidden gap-2 pl-3 sm:flex">
                      <button
                        type="button"
                        className="p-1.5 text-gray-400 transition-colors hover:text-gray-300"
                        aria-label="Attach file"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-4 sm:h-4">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                        </svg>
                      </button>
                    </div>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a follow-up..."
                      className="flex-1 px-3 py-2.5 sm:py-3 text-sm sm:text-base resize-none bg-transparent text-white placeholder:text-gray-400 focus:outline-none min-h-[40px] sm:min-h-[44px] max-h-[100px] sm:max-h-[120px]"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (input.trim()) sendMessage(e);
                        }
                      }}
                    />
                    <div className="flex items-center gap-1 pr-2 sm:gap-2">
                      <button
                        type="button"
                        className="hidden p-1.5 text-gray-400 transition-colors sm:block hover:text-gray-300"
                        aria-label="Attach file"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="hidden p-1.5 text-gray-400 transition-colors sm:block hover:text-gray-300"
                        aria-label="Voice input"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                          <line x1="12" y1="19" x2="12" y2="23"/>
                          <line x1="8" y1="23" x2="16" y2="23"/>
                        </svg>
                      </button>
                      <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className={`p-1.5 sm:p-2 rounded-md transition-all ${
                          input.trim() && !loading
                            ? 'bg-teal-600 hover:bg-teal-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Send size={14} className={`sm:w-4 sm:h-4 ${loading ? 'animate-pulse' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Bottom disclaimer */}
                  <div className="mt-2 text-xs text-center text-gray-500">
                    XCodeGen AI can make mistakes. Please double-check responses.
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