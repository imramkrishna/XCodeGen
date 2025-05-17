import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Code } from 'lucide-react';

type FileNode = {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
};

type FileExplorerProps = {
  files: FileNode[];
  onSelectFile: (file: FileNode) => void;
};

const FileTreeNode = ({ node, depth = 0, onSelectFile }: { 
  node: FileNode; 
  depth?: number; 
  onSelectFile: (file: FileNode) => void; 
}) => {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const isFolder = node.type === 'folder';
  
  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node);
    }
  };

  return (
    <li>
      <div 
        className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer hover:bg-slate-700 ${depth > 0 ? 'ml-5' : ''}`}
        onClick={handleToggle}
      >
        {isFolder ? (
          isOpen ? <ChevronDown className="w-4 h-4 text-slate-400 mr-1.5" /> : <ChevronRight className="w-4 h-4 text-slate-400 mr-1.5" />
        ) : (
          <span className="w-4 ml-1.5 mr-1.5" />
        )}
        
        {isFolder ? (
          <Folder className="w-4 h-4 text-blue-400 mr-2" />
        ) : (
          <FileText className="w-4 h-4 text-slate-400 mr-2" />
        )}
        
        <span className="text-sm text-slate-300">{node.name}</span>
      </div>
      
      {isFolder && isOpen && node.children && (
        <ul className="mt-1">
          {node.children.map((child, index) => (
            <FileTreeNode 
              key={`${child.name}-${index}`} 
              node={child} 
              depth={depth + 1} 
              onSelectFile={onSelectFile}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const FileExplorer = ({ files, onSelectFile }: FileExplorerProps) => {
  return (
    <div className="p-2">
      <ul>
        {files.map((file, index) => (
          <FileTreeNode 
            key={`${file.name}-${index}`} 
            node={file} 
            onSelectFile={onSelectFile} 
          />
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;