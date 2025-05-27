/**
 * Interface representing a parsed file object
 */
interface ParsedFile {
  fileName: string;
  path: string;
  content: string;
  message: string;
  initialMessage?:string; // Added message field to store descriptive text
}


/**
 * Parses a formatted text string and extracts file information
 * @param text - The formatted text containing file structures
 * @returns Array of objects with fileName, path, content, and messages
 */
var generalMessage="";
function parseFileStructure(text: string): ParsedFile[] {
  const files: ParsedFile[] = [];
  // Extract general message at the beginning
  const firstFileMarker = text.match(/\*\*\d+\.\s*`[^`]+`\*\*/);
  if (firstFileMarker && firstFileMarker.index) {
    generalMessage = text.substring(0, firstFileMarker.index).trim();
  }
  
  
  // Split by file markers (lines that start with **number. `path`**)
  const sections: string[] = text.split(/(?=\*\*\d+\.\s*`[^`]+`\*\*)/);
  
  sections.forEach((section: string, index: number) => {
    if (!section.trim()) return;
    
    const lines: string[] = section.split('\n');
    
    // Find the file path line
    const filePathLine: string | undefined = lines.find((line: string) => 
      line.match(/\*\*\d+\.\s*`[^`]+`\*\*/)
    );
    if (!filePathLine) return;
    
    // Extract file path
    const pathMatch: RegExpMatchArray | null = filePathLine.match(/\*\*\d+\.\s*`([^`]+)`\*\*/);
    if (!pathMatch) return;
    
    const fullPath: string = pathMatch[1];
    const pathParts: string[] = fullPath.split('/');
    const fileName: string = pathParts[pathParts.length - 1];
    // Extract content from code blocks
    let content: string = '';
    let inCodeBlock: boolean = false;
    let codeLines: string[] = [];
    
    // Find all non-code text (before and after code blocks)
    let message = "";
    if (index === 0) {
      message = generalMessage;
    }
    
    let nonCodeLines: string[] = [];
    let collectingNonCode = true;
    
    lines.forEach((line: string) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          content = codeLines.join('\n');
          inCodeBlock = false;
          collectingNonCode = true;
        } else {
          // Start of code block
          inCodeBlock = true;
          collectingNonCode = false;
          
          // Add collected non-code lines to message
          if (nonCodeLines.length > 0 && !nonCodeLines.every(l => !l.trim())) {
            let nonCodeText = nonCodeLines.join('\n').trim();
            // Skip the file path line from the message
            nonCodeText = nonCodeText.replace(filePathLine, '').trim();
            if (nonCodeText) {
              if (message) message += '\n\n';
              message += nonCodeText;
            }
          }
          nonCodeLines = [];
          codeLines = [];
        }
      } else if (inCodeBlock) {
        codeLines.push(line);
      } else if (collectingNonCode && !line.match(/\*\*\d+\.\s*`[^`]+`\*\*/)) {
        nonCodeLines.push(line);
      }
    });
    
    // Handle any remaining non-code lines after the last code block
    if (nonCodeLines.length > 0 && !nonCodeLines.every(l => !l.trim())) {
      let nonCodeText = nonCodeLines.join('\n').trim();
      if (nonCodeText) {
        if (message) message += '\n\n';
        message += nonCodeText;
      }
    }
    
    // If we're still in a code block at the end, use what we have
    if (inCodeBlock && codeLines.length > 0) {
      content = codeLines.join('\n');
    }
    
    if (content) {
      files.push({
        fileName,
        path: fullPath,
        content: content.trim(),
        message: message.trim() // Include the message
      });
    }
    if(files[0]){
      files[0].initialMessage=generalMessage
    }
  });
  return files;
}

// Example usage with your actual document:
const yourDocumentText: string = `Okay, I will create a frontend structure for a consultancy website with a separate header and footer component. I'll focus on a clean and modern design, making use of Tailwind CSS for styling, and Lucide React for icons. I will also add some placeholder content and Unsplash images to make it visually appealing.

Here's the updated file structure and content:

**1. \`src/App.tsx\`**

\`\`\`tsx
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent'; // Import the MainContent component

function App() {
  return (
    <div className="min-h-screen text-gray-800 bg-white">
      <Header />
      <MainContent /> {/* Render the MainContent component */}
      <Footer />
    </div>
  );
}

export default App;
\`\`\`

**2. \`src/components/Header.tsx\`**

\`\`\`tsx
import React from 'react';
import { Brain } from 'lucide-react'; // Using Brain icon for consultancy
import logo from './assets/logo.png';

function Header() {
  return (
    <header className="py-4 bg-white shadow-md">
      <div className="container flex items-center justify-between px-6 mx-auto">
        <a href="/" className="flex items-center text-2xl font-semibold">
          <img src={logo} alt="Consultancy Logo" className="w-8 h-8 mr-2" />
          Acme Consultancy
        </a>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="/" className="hover:text-blue-500">Home</a></li>
            <li><a href="/services" className="hover:text-blue-500">Services</a></li>
            <li><a href="/about" className="hover:text-blue-500">About</a></li>
            <li><a href="/contact" className="hover:text-blue-500">Contact</a></li>
          </ul>
        </nav>
        <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline">
          Get a Quote
        </button>
      </div>
    </header>
  );
}

export default Header;
\`\`\`

**6. \`src/index.css\`**

\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\``;

// Parse the files
const parsedFiles: ParsedFile[] = parseFileStructure(yourDocumentText);

console.log('Parsed Files:');
parsedFiles.forEach((file: ParsedFile, index: number) => {
  console.log(`\n--- File ${index + 1} ---`);
  console.log('File Name:', file.fileName);
  console.log('Path:', file.path);
  console.log('Content Length:', file.content.length, 'characters');
  console.log('Content Preview:');
  console.log(file.content.substring(0, 100) + '...');
  console.log('Message:', file.message); // Display the message
});

// Export for use in other modules
export default parsedFiles;