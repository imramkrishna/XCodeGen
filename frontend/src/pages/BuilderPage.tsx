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
  const finalAnswerRef=useRef();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const { inputValue } = location.state as { inputValue: string }



  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  // Mock steps for the generation process
  const [steps, setSteps] = useState<Step[]>([])


  // Mock file system structure
  const [files, setFiles] = useState<FileItem[]>([])
  // {
  //   name: 'index.html',
  //   type: 'file',
  //   content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Your Website</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div id="app"></div>\n  <script src="main.js"></script>\n</body>\n</html>',
  // },
  // {
  //   name: 'styles.css',
  //   type: 'file',
  //   content: '* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: "Inter", sans-serif;\n  line-height: 1.5;\n  color: #333;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 16px;\n}',
  // },
  // {
  //   name: 'main.js',
  //   type: 'file',
  //   content: 'document.addEventListener("DOMContentLoaded", () => {\n  console.log("Website initialized!");\n});\n',
  // },
  // {
  //   name: 'assets',
  //   type: 'folder',
  //   children: [
  //     { name: 'logo.svg', type: 'file', content: '<svg>...</svg>' },
  //     { name: 'hero.jpg', type: 'file', content: 'Binary image data' },
  //   ],
  // },
  // {
  //   name: 'components',
  //   type: 'folder',
  //   children: [
  //     { name: 'header.js', type: 'file', content: '// Header component code' },
  //     { name: 'footer.js', type: 'file', content: '// Footer component code' },
  //   ],
  // },

useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
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
    console.log("Steps response: ",stepsResponse.data.response)
    setSteps(s => [...s, ...parseFileStructure(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

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

      <div className="flex flex-col flex-grow md:flex-row">
        {/* Left panel - Steps */}
        <div className="w-full overflow-y-auto border-r md:w-1/3 lg:w-1/4 bg-slate-800 border-slate-700">
          <div className="p-1 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100">Building Your Website</h2>
            <p className="mt-1 text-sm text-slate-400 line-clamp-2" title={inputValue}>
              "{inputValue}"
              <StepsList
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
            </p>
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