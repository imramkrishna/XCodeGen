import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wand2 } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const isBuilderPage = location.pathname === '/builder';
  
  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-purple-500">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">HexaDev</span>
        </Link>
        
        <nav className="items-center hidden space-x-6 md:flex">
          <Link to="/" className="text-sm transition-colors text-slate-400 hover:text-slate-200">
            Home
          </Link>
          <a href="#features" className="text-sm transition-colors text-slate-400 hover:text-slate-200">
            Features
          </a>
          <a href="#examples" className="text-sm transition-colors text-slate-400 hover:text-slate-200">
            Examples
          </a>
          <a href="#pricing" className="text-sm transition-colors text-slate-400 hover:text-slate-200">
            Pricing
          </a>
        </nav>
        
        {!isBuilderPage && (
          <div className="hidden md:block">
            <button className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600">
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;