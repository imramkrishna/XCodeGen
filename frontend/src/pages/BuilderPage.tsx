import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StepsList } from '../components/builder/StepsList';
import { FileExplorer } from '../components/builder/FileExplorer';
import Header from '../components/common/Header';
import Editor from '@monaco-editor/react';
import { Code, Eye } from 'lucide-react';
import axios from "axios"

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
  const { inputValue } = location.state as { inputValue: string }



  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showCommand, setShowCommand] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Mock steps for the generation process
  const [steps, setSteps] = useState<Step[]>([])


  // Mock file system structure
  const [files, setFiles] = useState<FileItem[]>([])


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
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }

      }))
    }
    console.log(files);
  }, [steps, files]);



  // const handleFileSelect = (file: any) => {
  //   if (file.type === 'file') {
  //     setSelectedFile({
  //       name: files.name,
  //       content: files.content
  //     });
  //   }
  // };

  const getFileLanguage = (fileName: string) => {
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.js')) return 'javascript';
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) return 'typescript';
    return 'plaintext';
  };
  async function fetchApi() {
    console.log("Sending request to backend")
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: inputValue.trim()
    })
    const { prompts, uiPrompts } = response.data
    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, inputValue].map(content => ({
        role: "user",
        content
      }))
    })
    
    setSteps(s => [...s, ...parseFileStructure(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);
    setShowCommand(true)

  }
  useEffect(() => {
    if (!inputValue) {
      navigate('/');
      return;
    }
    fetchApi();
  }, [])

  const isProjectComplete = steps.length > 0 && !steps.some(step => step.status === 'pending');

  const handleDownloadProject = async () => {
    if (isDownloading) return;

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

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />

      <div className="flex flex-col flex-grow w-full h-full overflow-hidden md:flex-row">
        {/* Left panel - Steps */}
        <div className="flex flex-col w-full h-screen max-h-screen border-r md:w-1/3 lg:w-1/4 bg-slate-800 border-slate-700">
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100">Building Your Website</h2>
          </div>

          {/* Message section */}
          <div className="flex-shrink-0 p-4 border-b border-slate-700">
            <h3 className="mb-2 text-sm font-medium text-slate-300">Your Request</h3>
            <p className="text-sm text-slate-400 line-clamp-3" title={inputValue}>
              {inputValue}
            </p>
          </div>

          {/* Steps list with proper overflow */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-200">Build Progress</h3>
                <span className="px-2 py-1 text-xs font-medium text-blue-300 rounded-full bg-blue-900/30">
                  {steps.filter(s => s.status === "completed").length}/{steps.length} Complete
                </span>
              </div>

              {/* Introduction message */}
              {steps.length > 0 && steps[0].description && (
                <div className="p-4 mb-6 border rounded-lg shadow-lg bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50">
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

              <StepsList
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
              {showCommand && (
                <div className="mt-6 mb-2 overflow-hidden rounded-md">
                  <div className="bg-gray-900 px-3 py-1.5 flex items-center border-b border-gray-700">
                    <div className="flex space-x-1.5 mr-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-400">Terminal</p>
                  </div>
                  <div className="p-4 font-mono text-sm bg-gray-800">
                    <p className="mb-3 text-gray-300">Run these commands to run this project on your system:</p>
                    <div className="flex items-start mb-2">
                      <span className="mr-2 text-green-400">$</span>
                      <span className="text-blue-300">npm install</span>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2 text-green-400">$</span>
                      <span className="text-blue-300">npm run dev</span>
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
          <div className="flex items-center p-4 border-b bg-slate-800 border-slate-700">
            <div className="flex">
              <button
                className={`flex items-center px-4 py-2 rounded-md mr-2 ${activeTab === 'code'
                  ? 'bg-slate-700 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
                onClick={() => setActiveTab('code')}
              >
                <Code className="w-4 h-4 mr-2" />
                Code
              </button>
              <button
                className={`flex items-center px-4 py-2 rounded-md ${activeTab === 'preview'
                  ? 'bg-slate-700 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
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
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  !isProjectComplete
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
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
              <div className="w-64 overflow-y-auto border-r border-slate-700">
                <div className="p-3 border-b border-slate-700">
                  <h3 className="text-sm font-medium text-slate-300">Files</h3>
                </div>
                <FileExplorer
                  files={files}
                  onFileSelect={setSelectedFile}
                />

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