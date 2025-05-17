import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wand2 } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const isBuilderPage = location.pathname === '/builder';
  
  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-8 rounded-md flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">HexaDev</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            Home
          </Link>
          <a href="#features" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            Features
          </a>
          <a href="#examples" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            Examples
          </a>
          <a href="#pricing" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            Pricing
          </a>
        </nav>
        
        {!isBuilderPage && (
          <div className="hidden md:block">
            <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;