import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code, Layout, Terminal, ChevronDown } from 'lucide-react';
import { SiGithub, SiFigma } from 'react-icons/si';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const LandingPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState<'mistral' | 'gemini' | 'qwen3' | 'llama'>('qwen3');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (developerMode) {
      if (inputValue.trim()) {
        navigate('/builder', { state: { inputValue, selectedModel } });
      }
    } else {
      if (inputValue.trim()) {
       navigate('/chatmode', { state: { inputValue } });
      }
    }
  };

  const models = [
    { id: 'qwen3', name: 'Qwen 3', description: 'Powerful open-source model' },
    { id: 'llama', name: 'Llama 3', description: 'Meta\'s advanced model' },
    { id: 'gemini', name: 'Gemini Pro', description: 'Google\'s multimodal AI' },
    { id: 'mistral', name: 'Mistral', description: 'European AI excellence' }
  ];

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <div className="min-h-screen overflow-hidden text-white bg-black">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orb */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-gray-900 to-black"></div>
      </div>

      <Header />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-32 pb-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-12 text-center animate-float">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-transparent md:text-6xl lg:text-7xl bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text">
            What should we build today?
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-400 md:text-xl">
            Create stunning apps & websites by chatting with AI.
          </p>
        </div>

        {/* Main Input Section */}
        <div className="w-full max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="relative">
            {/* Main input container with gradient border */}
            <div className="relative bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 p-[1px] rounded-2xl">
              <div className="p-6 bg-gray-900 rounded-2xl backdrop-blur-sm">
                {/* Model Selector Dropdown */}
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-white transition-colors bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700"
                    >
                      <span>{selectedModelData?.name || 'Select Model'}</span>
                      <ChevronDown size={16} className={`transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isModelDropdownOpen && (
                      <div className="absolute left-0 z-50 w-64 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl top-full">
                        {models.map((model) => (
                          <button
                            key={model.id}
                            type="button"
                            onClick={() => {
                              setSelectedModel(model.id as any);
                              setIsModelDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 ${
                              selectedModel === model.id ? 'bg-blue-600 hover:bg-blue-700' : ''
                            }`}
                          >
                            <div className="font-medium text-white">{model.name}</div>
                            <div className="text-sm text-gray-400">{model.description}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mode Toggle */}
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${!developerMode ? 'text-white' : 'text-gray-400'}`}>Chat</span>
                    <button
                      type="button"
                      onClick={() => setDeveloperMode(!developerMode)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        developerMode ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        developerMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                    <span className={`text-sm ${developerMode ? 'text-white' : 'text-gray-400'}`}>Code</span>
                  </div>
                </div>

                {/* Input Area */}
                <div className="relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={developerMode 
                      ? "Type your idea and we'll build it together..." 
                      : "Ask me anything about code, tech, or development..."}
                    className="w-full h-32 px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 border border-gray-600 rounded-lg resize-none bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm hover:bg-gray-800/70"
                  />
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className={`absolute bottom-3 right-3 p-3 rounded-lg transition-all duration-300 ${
                      inputValue.trim()
                        ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 animate-pulse-glow'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Import Options */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <span className="text-sm text-gray-400">or import from</span>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-white transition-colors bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700">
                <SiFigma size={16} />
                Figma
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-white transition-colors bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700">
                <SiGithub size={16} />
                GitHub
              </button>
            </div>
          </form>
        </div>

        {/* Stats Section */}
        <div className="grid max-w-4xl grid-cols-2 gap-8 mx-auto mb-20 md:grid-cols-4">
          <div className="text-center group">
            <div className="mb-2 text-2xl font-bold text-white transition-colors md:text-3xl group-hover:text-blue-400">4.2K+</div>
            <div className="text-sm text-gray-400 transition-colors group-hover:text-gray-300">Websites Built</div>
          </div>
          <div className="text-center group">
            <div className="mb-2 text-2xl font-bold text-white transition-colors md:text-3xl group-hover:text-purple-400">720+</div>
            <div className="text-sm text-gray-400 transition-colors group-hover:text-gray-300">Active Users</div>
          </div>
          <div className="text-center group">
            <div className="mb-2 text-2xl font-bold text-white transition-colors md:text-3xl group-hover:text-green-400">99.9%</div>
            <div className="text-sm text-gray-400 transition-colors group-hover:text-gray-300">Uptime</div>
          </div>
          <div className="text-center group">
            <div className="mb-2 text-2xl font-bold text-white transition-colors md:text-3xl group-hover:text-yellow-400">24/7</div>
            <div className="text-sm text-gray-400 transition-colors group-hover:text-gray-300">Support</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid max-w-6xl gap-8 mx-auto mb-20 md:grid-cols-3">
          <div className="p-6 transition-all duration-300 border border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-xl hover:border-blue-500/50 hover:bg-gray-800/50 group hover:-translate-y-2">
            <div className="flex items-center justify-center w-12 h-12 mb-4 transition-transform duration-300 bg-blue-600 rounded-lg group-hover:scale-110">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-blue-400">Intuitive Design</h3>
            <p className="text-gray-400 transition-colors group-hover:text-gray-300">Beautiful, responsive websites created automatically from your description.</p>
          </div>
          
          <div className="p-6 transition-all duration-300 border border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-xl hover:border-purple-500/50 hover:bg-gray-800/50 group hover:-translate-y-2">
            <div className="flex items-center justify-center w-12 h-12 mb-4 transition-transform duration-300 bg-purple-600 rounded-lg group-hover:scale-110">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-purple-400">Clean Code</h3>
            <p className="text-gray-400 transition-colors group-hover:text-gray-300">Generate well-structured, maintainable code ready for production.</p>
          </div>
          
          <div className="p-6 transition-all duration-300 border border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-xl hover:border-green-500/50 hover:bg-gray-800/50 group hover:-translate-y-2">
            <div className="flex items-center justify-center w-12 h-12 mb-4 transition-transform duration-300 bg-green-600 rounded-lg group-hover:scale-110">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-green-400">Full Control</h3>
            <p className="text-gray-400 transition-colors group-hover:text-gray-300">Examine and edit every file to customize your website exactly how you want it.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};



export default LandingPage;