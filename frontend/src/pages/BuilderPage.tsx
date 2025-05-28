import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StepsList } from '../components/builder/StepsList';
import { FileExplorer } from '../components/builder/FileExplorer';
import Header from '../components/common/Header';
import Editor from '@monaco-editor/react';
import { Code, Eye } from 'lucide-react';
import axios from "axios"
import { BACKEND_URL } from '../config';
import { Step, StepType } from '../components/builder/StepsList';
import { parseXml } from '../steps';
import { FileItem } from '../types';
import { useRef } from 'react';
import parseFileStructure from '../xmlParser';

const BuilderPage = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const { inputValue } = location.state as { inputValue: string }



  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showCommand, setShowCommand] = useState(false);

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
    console.log("Steps response: ", stepsResponse.data.response)
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
              <h3 className="mb-2 text-sm font-medium text-slate-300">Build Steps</h3>
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