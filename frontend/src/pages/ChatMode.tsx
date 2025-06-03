import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Copy, CheckCheck, ThumbsUp, ThumbsDown, Code, TerminalSquare, MessageSquare, Info, List } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/common/Header';
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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedCodeBlock, setCopiedCodeBlock] = useState<string | null>(null);
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

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  const copyCodeBlock = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeBlock(id);
    setTimeout(() => setCopiedCodeBlock(null), 2000);
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Render a code block with syntax highlighting
  const renderCodeBlock = (block: CodeBlock) => (
    <div key={block.id} className="relative mt-4 mb-6 overflow-hidden rounded-lg">
      <div className="flex items-center justify-between px-4 py-2 text-xs bg-[#112240] text-gray-300">
        <div className="flex items-center">
          <Code size={14} className="mr-2 text-blue-400" />
          <span>{block.language || 'code'}</span>
        </div>
        <button
          onClick={() => copyCodeBlock(block.code, block.id)}
          className="px-2 py-1 text-xs transition-colors rounded hover:bg-[#1e3a5f]"
        >
          {copiedCodeBlock === block.id ? (
            <span className="flex items-center gap-1">
              <CheckCheck size={14} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy size={14} />
              Copy
            </span>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={block.language || 'javascript'}
        style={nightOwl}
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: 0,
          fontSize: '0.9rem',
        }}
      >
        {block.code}
      </SyntaxHighlighter>
    </div>
  );

  // Render list items with appropriate styling
  const renderListItems = (items: ListItem[]) => (
    <ul className="pl-5 mt-3 space-y-2 list-disc">
      {items.map((item, index) => (
        <li key={index} className="text-gray-200">
          {item.type === 'titled' ? (
            <div>
              <span className="font-semibold text-blue-400">{item.title}</span>
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
    <div key={index} className="py-3 mt-2 mb-4">
      {section.title && (
        <h3 className={`text-lg font-semibold mb-2 flex items-center ${
          section.type === 'features' ? 'text-blue-400' :
          section.type === 'code' ? 'text-green-400' :
          section.type === 'benefits' ? 'text-purple-400' :
          section.type === 'concepts' ? 'text-amber-400' :
          'text-gray-200'
        }`}>
          {section.type === 'features' && <List size={18} className="mr-2" />}
          {section.type === 'code' && <Code size={18} className="mr-2" />}
          {section.type === 'benefits' && <ThumbsUp size={18} className="mr-2" />}
          {section.type === 'concepts' && <Info size={18} className="mr-2" />}
          {section.title}
        </h3>
      )}
      
      {section.content && (
        <div className="text-gray-300">
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-400 underline hover:text-blue-300" target="_blank" rel="noopener noreferrer" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
              em: ({node, ...props}) => <em className="italic text-gray-200" {...props} />,
              code: ({node, inline, ...props}) => 
                inline ? 
                <code className="px-1 py-0.5 rounded bg-[#1e2235] text-pink-400 text-sm" {...props} /> :
                <code {...props} />
            }}
          >
            {section.content}
          </ReactMarkdown>
        </div>
      )}
      
      {section.items.length > 0 && renderListItems(section.items)}
      {section.codeBlocks.map(renderCodeBlock)}
      
      {section.subsections.map((subsection, i) => (
        <div key={`subsection-${i}`} className="pl-4 mt-4 mb-2 border-l-2 border-gray-700">
          {renderSection(subsection, i)}
        </div>
      ))}
    </div>
  );

  // Render full structured content
  const renderStructuredContent = (parsedContent: ParsedChatResult) => (
    <div className="text-gray-100">
      {parsedContent.introduction && (
        <div className="mb-6">
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-400 underline hover:text-blue-300" target="_blank" rel="noopener noreferrer" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
              code: ({node, inline, ...props}) => 
                inline ? 
                <code className="px-1 py-0.5 rounded bg-[#1e2235] text-pink-400 text-sm" {...props} /> :
                <code {...props} />
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
        <div className="pt-4 mt-6 border-t border-gray-800/60">
          <h4 className="flex items-center mb-3 text-lg font-medium text-gray-200">
            <MessageSquare size={18} className="mr-2 text-blue-400" />
            Conclusion
          </h4>
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p className="leading-relaxed text-gray-300" {...props} />,
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0c1019] to-[#131b2e]">
      <Header />
      
      {/* Main content */}
      <div className="flex flex-col flex-grow w-full mt-16">
        {/* Welcome message if no messages yet */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-grow p-8 text-center">
            <div className="relative flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute w-20 h-20 rounded-full bg-blue-500/20 animate-ping"></div>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
                <Bot size={32} className="text-white" />
              </div>
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white">How can I help you today?</h3>
            <p className="max-w-md text-gray-400">
              Ask me anything about code, websites, or any technical questions you might have.
            </p>
            <div className="grid max-w-3xl grid-cols-1 gap-3 mt-8 sm:grid-cols-2 md:grid-cols-3">
              {["Generate a React component", "Write a SQL query for users", "Create a CSS grid layout"].map((suggestion, i) => (
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
                  className="p-4 text-sm text-left transition-all border rounded-xl bg-[#131b2c]/80 border-[#243049] text-gray-300 hover:bg-[#1d2943]/80 hover:border-[#344b70] hover:shadow-lg hover:shadow-blue-900/20"
                >
                  <div className="flex items-center mb-1.5">
                    <TerminalSquare size={14} className="mr-1.5 text-blue-400" />
                    <span className="font-medium text-blue-300">{suggestion.split(' ')[0]}</span>
                  </div>
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
                      ? 'bg-[#131b2c]/80 backdrop-blur-sm' 
                      : 'bg-[#0c1019]/90'
                  } border-b border-[#1e2f4a]`}
                >
                  <div className="flex items-start max-w-4xl gap-4 mx-auto">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                    } shadow-lg shadow-blue-900/20`}>
                      {message.role === 'user' 
                        ? <User size={18} className="text-white" /> 
                        : <Bot size={18} className="text-white" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 font-medium text-gray-300">
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </div>
                      
                      {message.role === 'user' ? (
                        <div className="text-gray-200">
                          {message.content}
                        </div>
                      ) : (
                        message.parsedContent ? (
                          renderStructuredContent(message.parsedContent)
                        ) : (
                          <div className="text-gray-200 prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#1e2235] prose-pre:border prose-pre:border-[#2a2f45]">
                            {message.content}
                          </div>
                        )
                      )}
                      
                      {/* Actions for assistant messages */}
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-4 text-gray-500">
                          <button 
                            onClick={() => copyToClipboard(message.content, index)}
                            className="flex items-center gap-1 px-2 py-1 text-xs transition-colors rounded hover:bg-[#1d2943] hover:text-gray-300"
                          >
                            {copiedIndex === index ? (
                              <>
                                <CheckCheck size={14} className="text-green-400" />
                                <span className="text-green-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                Copy
                              </>
                            )}
                          </button>
                          <div className="flex items-center gap-1 ml-1">
                            <button className="p-1 transition-colors rounded hover:bg-[#1d2943] hover:text-gray-300" aria-label="Thumbs up">
                              <ThumbsUp size={14} />
                            </button>
                            <button className="p-1 transition-colors rounded hover:bg-[#1d2943] hover:text-gray-300" aria-label="Thumbs down">
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
                <div className="px-4 py-6 backdrop-blur-sm md:px-8 lg:px-16 bg-[#131b2c]/80 border-b border-[#1e2f4a]">
                  <div className="flex items-start max-w-4xl gap-4 mx-auto">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-blue-900/20">
                      <Bot size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="mb-2 font-medium text-gray-300">
                        AI Assistant
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 delay-150 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 delay-300 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="ml-1 text-sm">Generating response...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="sticky bottom-0 p-4 bg-[#0c1019]/95 border-t border-[#1e2f4a] md:p-6 backdrop-blur-md">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={sendMessage} className="relative">
                  <div className="relative overflow-hidden transition-all duration-200 border rounded-xl bg-[#131b2c] border-[#243049] focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500/60">
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
                    <div className="flex items-center justify-between px-3 py-2 border-t border-[#243049]">
                      <div className="text-xs text-gray-500">
                        Shift + Enter for new line
                      </div>
                      <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className={`px-4 py-2 flex items-center gap-1.5 rounded-lg shadow-sm transition-all ${
                          input.trim() && !loading
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30'
                            : 'bg-[#1d2943] text-gray-500 cursor-not-allowed'
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