import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePrompt } from '../context/PromptContext';
import StepsList from '../components/builder/StepsList';
import FileExplorer from '../components/builder/FileExplorer';
import Header from '../components/common/Header';
import Editor from '@monaco-editor/react';
import { Code, Eye } from 'lucide-react';
import axios from "axios"
import { BACKEND_URL } from '../config';
import { Step, StepType } from '../components/builder/StepsList';

const BuilderPage = () => {
  const location = useLocation();
  const {inputValue}=location.state as {inputValue:string}
  const { prompt, isGenerating, setIsGenerating, currentStep, setCurrentStep } = usePrompt();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<{ name: string; content: string } | null>(null);

  // Mock steps for the generation process
  const [steps]=useState<Step[]>([])

  // Mock file system structure
  const files = [
    {
      name: 'index.html',
      type: 'file',
      content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Your Website</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div id="app"></div>\n  <script src="main.js"></script>\n</body>\n</html>',
    },
    {
      name: 'styles.css',
      type: 'file',
      content: '* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: "Inter", sans-serif;\n  line-height: 1.5;\n  color: #333;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 16px;\n}',
    },
    {
      name: 'main.js',
      type: 'file',
      content: 'document.addEventListener("DOMContentLoaded", () => {\n  console.log("Website initialized!");\n});\n',
    },
    {
      name: 'assets',
      type: 'folder',
      children: [
        { name: 'logo.svg', type: 'file', content: '<svg>...</svg>' },
        { name: 'hero.jpg', type: 'file', content: 'Binary image data' },
      ],
    },
    {
      name: 'components',
      type: 'folder',
      children: [
        { name: 'header.js', type: 'file', content: '// Header component code' },
        { name: 'footer.js', type: 'file', content: '// Footer component code' },
      ],
    },
  ];

  useEffect(() => {
    if (!prompt) {
      navigate('/');
      return;
    }

    setIsGenerating(true);
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          clearInterval(interval);
          setIsGenerating(false);
          return prev;
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [prompt, navigate, setIsGenerating, setCurrentStep, steps.length]);

  const handleFileSelect = (file: any) => {
    if (file.type === 'file') {
      setSelectedFile({
        name: file.name,
        content: file.content
      });
    }
  };

  const getFileLanguage = (fileName: string) => {
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.js')) return 'javascript';
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) return 'typescript';
    return 'plaintext';
  };
  async function init(){
    const response=await axios.post(`${BACKEND_URL}/template`,{
      message:inputValue.trim()
    })
    const {prompts,uiPrompts}=response.data
    const stepsResponse=await axios.post(`${BACKEND_URL}/chat`,{
      messages:[...prompts,inputValue].map(content=>({
        role:"user",
        content
      }))
    })
  }
 useEffect(()=>{
  init();
 },[])
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      
      <div className="flex flex-col flex-grow md:flex-row">
        {/* Left panel - Steps */}
        <div className="w-full overflow-y-auto border-r md:w-1/3 lg:w-1/4 bg-slate-800 border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100">Building Your Website</h2>
            <p className="mt-1 text-sm text-slate-400 line-clamp-2" title={prompt}>
              "{prompt}"
            </p>
          </div>
          <StepsList steps={steps} currentStep={currentStep} isGenerating={isGenerating} />
        </div>
        
        {/* Right panel - File Explorer and Editor/Preview */}
        <div className="flex flex-col flex-grow overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center p-4 border-b bg-slate-800 border-slate-700">
            <div className="flex">
              <button
                className={`flex items-center px-4 py-2 rounded-md mr-2 ${
                  activeTab === 'code'
                    ? 'bg-slate-700 text-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                onClick={() => setActiveTab('code')}
              >
                <Code className="w-4 h-4 mr-2" />
                Code
              </button>
              <button
                className={`flex items-center px-4 py-2 rounded-md ${
                  activeTab === 'preview'
                    ? 'bg-slate-700 text-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex flex-grow">
            {/* File Explorer - Only visible in code tab */}
            {activeTab === 'code' && (
              <div className="w-64 overflow-y-auto border-r border-slate-700">
                <div className="p-3 border-b border-slate-700">
                  <h3 className="text-sm font-medium text-slate-300">Files</h3>
                </div>
                <FileExplorer files={files} onSelectFile={handleFileSelect} />
              </div>
            )}
            
            {/* Editor/Preview Area */}
            <div className="flex-grow">
              {activeTab === 'code' ? (
                selectedFile ? (
                  <Editor
                    height="100%"
                    defaultLanguage={getFileLanguage(selectedFile.name)}
                    value={selectedFile.content}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                      readOnly: isGenerating,
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-slate-400">
                    Select a file to view its contents
                  </div>
                )
              ) : (
                <iframe
                  title="Preview"
                  className="w-full h-full bg-white"
                  srcDoc={files.find(f => f.name === 'index.html')?.content || ''}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;