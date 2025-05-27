import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code, Layout, Terminal, Wand2 } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import parsedFiles from "../xmlParser"

const LandingPage = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate('/builder', { state: { inputValue } });
    }
  };
  console.log("Parsed FIle Structure: ",parsedFiles)


  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      
      <main className="flex flex-col items-center justify-center flex-grow px-4 py-12">
        <section className="w-full max-w-5xl mb-12 text-center animate-fade-in">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl text-slate-100">
            Create Websites with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Natural Language
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-slate-400">
            Describe your dream website and watch it come to life. No coding knowledge required.
          </p>
        </section>

        <section className="w-full max-w-3xl p-6 mb-12 transition-all border shadow-lg bg-slate-800 rounded-2xl md:p-8 hover:shadow-xl border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                className="w-full h-40 p-4 pr-12 text-lg transition-all border outline-none bg-slate-900 text-slate-200 rounded-xl border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500"
                placeholder="Describe your website... (e.g., 'Create a personal portfolio site with a dark theme, project showcase, and contact form')"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Wand2 className="absolute right-4 bottom-4 text-slate-500" size={24} />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all ${
                  inputValue.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                Create Website <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </section>

        <section className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: <Layout className="w-8 h-8 text-blue-400" />,
              title: 'Intuitive Design',
              description: 'Beautiful, responsive websites created automatically from your description.',
            },
            {
              icon: <Code className="w-8 h-8 text-purple-400" />,
              title: 'Clean Code',
              description: 'Generate well-structured, maintainable code ready for production.',
            },
            {
              icon: <Terminal className="w-8 h-8 text-teal-400" />,
              title: 'Full Control',
              description: 'Examine and edit every file to customize your website exactly how you want it.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 transition-all border shadow-md bg-slate-800 rounded-xl hover:shadow-lg border-slate-700"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-slate-200">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;