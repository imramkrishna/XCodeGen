import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StepsList } from '../components/builder/StepsList';
import { FileExplorer } from '../components/builder/FileExplorer';
import Header from '../components/common/Header';
import Editor from '@monaco-editor/react';
import { Code, Eye, DownloadCloud, Terminal, File, Info, Loader } from 'lucide-react';
import axios from "axios";

import { Step, StepType } from '../components/builder/StepsList';
import { parseXml } from '../steps';
import { FileItem } from '../types';
import parseFileStructure from '../xmlParser';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const BuilderPage = () => {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const { inputValue } = location.state as { inputValue: string };

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showCommand, setShowCommand] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  // Steps for the generation process
  const [steps, setSteps] = useState<Step[]>([]);

  // File system structure
  const [files, setFiles] = useState<FileItem[]>([]);

  // Add a new state to track if file is loading
  const [isFileLoading, setIsFileLoading] = useState(false);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({ status }) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;

        let currentFolder = ""
        while (parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);

          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }

            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }
    })

    if (updateHappened) {
      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => ({
        ...s,
        status: "completed"
      })))
    }
  }, [steps, files]);

  const getFileLanguage = (fileName: string) => {
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.js')) return 'javascript';
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) return 'typescript';
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };

  async function fetchApi() {
    try {
      setIsGenerating(true);
      const response = await axios.post(`${BACKEND_URL}/template`, {
        prompt: inputValue.trim()
      });

      const { prompts, uiPrompts } = response.data;
      setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
        ...x,
        status: "pending"
      })));

      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...prompts, inputValue].map(content => ({
          role: "user",
          content
        }))
      });
      

      setSteps(s => [...s, ...parseFileStructure(stepsResponse.data.response).map(x => ({
        ...x,
        status: "pending" as "pending"
      }))]);
      console.log("This is steps: ",steps)

      setShowCommand(true);
    } catch (error) {
      console.error('Error generating project:', error);
    } finally {
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    if (!inputValue) {
      navigate('/');
      return;
    }
   fetchApi();
  }, []);
  var isProjectComplete=false;
  var completedSteps= 0;
  var progress=0

  if(showCommand) {
  var isProjectComplete = steps.length > 0 && !steps.some(step => step.status === 'pending');
  var completedSteps = steps.filter(s => s.status === "completed").length;
  var progress = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;
  }

  const handleDownloadProject = async () => {
    if (isDownloading && !showCommand) return;

    try {
      setIsDownloading(true);
      const zip = new JSZip();

      // Function to recursively add files to zip
      const addFilesToZip = (items: FileItem[], currentPath = '') => {
        items.forEach(item => {
          const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name;

          if (item.type === 'file') {
            zip.file(itemPath, item.content || '');
          } else if (item.type === 'folder' && item.children) {
            // Create folder
            const folder = zip.folder(itemPath);
            // Add its children
            addFilesToZip(item.children, itemPath);
          }
        });
      };

      // Add all files and folders to zip
      addFilesToZip(files);

      // Generate zip and trigger download
      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, 'project.zip');
    } catch (error) {
      console.error('Failed to download project:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Format code function
 const formatCode = (code: string | undefined, language: string): string => {
  if (!code) return '';
  
  // Just clean up extra blank lines, no operator spacing
  return code.replace(/\n{3,}/g, '\n\n');
};

  // Modify the file selection handler
  const handleFileSelect = (file: FileItem) => {
    setIsFileLoading(true);
    
    // Format the file content before displaying it
    if (file.content) {
      const language = getFileLanguage(file.name);
      file.content = formatCode(file.content, language);
    }
    
    setSelectedFile(file);
    
    // Hide loading after a small delay
    setTimeout(() => {
      setIsFileLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col mt-4 min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800/30 via-slate-900 to-slate-950">
      <Header />

      <div className="flex flex-col flex-grow w-full h-full pt-16 overflow-hidden md:flex-row">
        {/* Left panel - Steps */}
        <div className="flex flex-col w-full h-screen max-h-screen border-r shadow-lg md:w-1/3 lg:w-1/4 bg-slate-800/90 backdrop-blur-sm border-slate-700/70">
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b border-slate-700/70 bg-gradient-to-r from-slate-800 to-slate-800/50">
            <h2 className="flex items-center text-lg font-semibold text-slate-100">
              <div className="w-2 h-2 mr-2 bg-blue-500 rounded-full animate-pulse"></div>
              Building Your Website
            </h2>
          </div>

          {/* Message section */}
          <div className="flex-shrink-0 p-4 border-b border-slate-700/70 bg-slate-800/50">
            <h3 className="flex items-center mb-2 text-sm font-medium text-slate-300">
              <Info size={14} className="mr-1.5 text-blue-400" />
              Your Request
            </h3>
            <div className="p-3 border rounded-lg bg-slate-900/70 border-slate-700/50">
              <p className="text-sm text-slate-300 line-clamp-3" title={inputValue}>
                {inputValue}
              </p>
            </div>
          </div>

          {/* Steps list with proper overflow */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-200">Build Progress</h3>
                <div className="flex items-center">
                  <div className="w-20 h-2 mr-2 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-blue-300">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Introduction message */}
              {steps.length > 0 && steps[0].description && (
                <div className="p-4 mb-6 border rounded-lg shadow-lg bg-gradient-to-br from-slate-800 to-slate-900/70 border-slate-700/50 backdrop-blur-sm transform transition-all hover:scale-[1.01]">
                  <div className="flex items-start">
                    <div className="p-1.5 rounded-md bg-blue-500/20 text-blue-400 mr-3 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200 mb-1.5">Your Design Plan</h4>
                      <p className="text-sm leading-relaxed text-slate-400">{steps[0].description}</p>
                    </div>
                  </div>
                </div>
              )}

              {isGenerating && steps.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 mb-4 border-4 rounded-full border-slate-700 border-t-blue-500 animate-spin"></div>
                  <p className="text-center text-slate-400">Generating your website...</p>
                  <p className="mt-2 text-sm text-center text-slate-500">This may take a minute</p>
                </div>
              )}

              <StepsList
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />

              {showCommand && (
                <div className="mt-6 mb-2 overflow-hidden rounded-lg border border-slate-700/70 shadow-md transform transition-all hover:shadow-lg hover:border-slate-600/50 hover:scale-[1.01]">
                  <div className="bg-slate-900 px-3 py-1.5 flex items-center border-b border-slate-700/70">
                    <div className="flex space-x-1.5 mr-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <Terminal size={12} className="text-slate-500 mr-1.5" />
                    <p className="text-xs text-slate-400">Terminal</p>
                  </div>
                  <div className="p-4 font-mono text-sm bg-slate-900/80 backdrop-blur-sm">
                    <p className="mb-3 text-slate-300">Run these commands to start this project:</p>
                    <div className="p-3 space-y-2 border rounded-md bg-slate-800/80 border-slate-700/50">
                      <div className="flex items-start">
                        <span className="mr-2 text-green-400">$</span>
                        <span className="text-blue-300">npm install</span>
                      </div>
                      <div className="flex items-start">
                        <span className="mr-2 text-green-400">$</span>
                        <span className="text-blue-300">npm run dev</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right panel - File Explorer and Editor/Preview */}
        <div className="flex flex-col flex-grow overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center p-3 border-b shadow-md bg-slate-800/90 backdrop-blur-sm border-slate-700/70">
            <div className="flex">
              <button
                className={`flex items-center px-4 py-2 rounded-lg mr-2 transition-all duration-200 ${activeTab === 'code'
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 shadow-sm border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                onClick={() => setActiveTab('code')}
              >
                <Code className="w-4 h-4 mr-2" />
                Code
              </button>
              <button
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'preview'
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 shadow-sm border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                onClick={() => setActiveTab('preview')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
            </div>

            {/* Download button */}
            <div className="ml-auto">
              <button
                className={`flex items-center px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 ${!isProjectComplete
                  ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed border border-slate-600/30'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/20 border border-blue-500/30 hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                onClick={handleDownloadProject}
                disabled={!showCommand || isDownloading}
                title={!isProjectComplete ? "Complete all steps to download" : "Download project files"}
              >
                {isDownloading ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparing...
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-4 h-4 mr-2" />
                    Download Project
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-grow">
            {/* File Explorer - Only visible in code tab */}
            {activeTab === 'code' && (
              <div className="w-64 overflow-y-auto border-r shadow-inner border-slate-700/70 bg-slate-800/50 backdrop-blur-sm">
                <div className="p-3 border-b border-slate-700/70 bg-slate-800/90">
                  <h3 className="flex items-center text-sm font-medium text-slate-300">
                    <File size={14} className="mr-1.5 text-blue-400" />
                    Project Files
                  </h3>
                </div>
                <div className="py-2">
                  <FileExplorer
                    files={files}
                    onFileSelect={handleFileSelect}
                  />
                </div>
              </div>
            )}

            {/* Editor/Preview Area */}
            <div className="flex-grow bg-slate-900/60 backdrop-blur-sm">
              {activeTab === 'code' ? (
                selectedFile ? (
                  <div className="relative w-full h-full">
                    {/* Loading overlay for code editor */}
                    {(isFileLoading || !showCommand) && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
                        <div className="w-12 h-12 mb-4 border-4 rounded-full border-slate-700 border-t-blue-500 animate-spin"></div>
                        <p className="text-base font-medium text-slate-300">
                          {!showCommand ? 'Generating code...' : 'Loading file...'}
                        </p>
                        {!showCommand && (
                          <p className="mt-2 text-sm text-slate-500">Please wait until generation is complete</p>
                        )}
                      </div>
                    )}
                    
                    <Editor
                      height="100%"
                      defaultLanguage={getFileLanguage(selectedFile.name)}
                      value={selectedFile.content}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: true },
                        fontSize: 14,
                        wordWrap: 'on',
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: "on",
                        renderLineHighlight: 'all',
                        contextmenu: true,
                        fontLigatures: true
                      }}
                      loading={
                        <div className="flex items-center justify-center h-full">
                          <div className="w-8 h-8 border-4 rounded-full border-slate-700 border-t-blue-500 animate-spin"></div>
                        </div>
                      }
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-sm text-slate-400">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-800">
                      <File className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="mb-2 text-lg font-medium text-slate-300">No file selected</p>
                    <p>Select a file from the explorer to view its contents</p>
                  </div>
                )
              ) : (
                <div className="relative w-full h-full">
                  {/* Loading overlay for preview */}
                  {(!showCommand || progress < 100) && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
                      <div className="w-16 h-16 mb-6 border-4 rounded-full border-slate-700 border-t-blue-500 animate-spin"></div>
                      <h3 className="mb-2 text-xl font-semibold text-slate-200">Building your preview...</h3>
                      <div className="w-64 h-2 mb-3 overflow-hidden rounded-full bg-slate-700">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                          style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}
                        ></div>
                      </div>
                      <p className="text-slate-400">{progress}% complete</p>
                      <p className="mt-4 text-sm text-slate-500">Preview will be available once generation is complete</p>
                    </div>
                  )}

                  {files.length > 0 ? (
                    <iframe
                      title="Preview"
                      className="w-full h-full bg-white"
                      srcDoc={files.find(f => f.name === 'index.html')?.content || ''}
                      sandbox="allow-scripts allow-same-origin"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-sm text-slate-400">
                      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-800">
                        <Eye className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="mb-2 text-lg font-medium text-slate-300">No preview available</p>
                      <p>Files are still being generated</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;