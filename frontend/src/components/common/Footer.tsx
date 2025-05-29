import React from 'react';
import { Wand2, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 border-t bg-slate-900 text-slate-400 border-slate-800">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4 space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-purple-500">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HexaDev</span>
            </div>
            <p className="max-w-xs text-sm text-slate-400">
              Create beautiful websites in seconds using natural language prompts. No coding required.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="transition-colors text-slate-500 hover:text-slate-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="transition-colors text-slate-500 hover:text-slate-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="transition-colors text-slate-500 hover:text-slate-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 font-medium text-white">Product</h3>
            <ul className="space-y-2">
              {['Features', 'Templates', 'Pricing', 'Examples', 'Changelog'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm transition-colors text-slate-400 hover:text-slate-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-medium text-white">Resources</h3>
            <ul className="space-y-2">
              {['Documentation', 'Tutorials', 'Blog', 'Support', 'API'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm transition-colors text-slate-400 hover:text-slate-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-medium text-white">Company</h3>
            <ul className="space-y-2">
              {['About', 'Careers', 'Contact', 'Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm transition-colors text-slate-400 hover:text-slate-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-between pt-6 mt-12 border-t border-slate-800 md:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Ram Krishna Yadav. All rights reserved.
          </p>
          <div className="flex mt-4 space-x-6 md:mt-0">
            <a href="#" className="text-xs transition-colors text-slate-500 hover:text-slate-300">
              Privacy Policy
            </a>
            <a href="#" className="text-xs transition-colors text-slate-500 hover:text-slate-300">
              Terms of Service
            </a>
            <a href="#" className="text-xs transition-colors text-slate-500 hover:text-slate-300">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;