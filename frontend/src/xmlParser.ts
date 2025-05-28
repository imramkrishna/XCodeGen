/**
 * Enums and types for step processing
 */
export enum StepType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript
}

export type Step = {
  id: number;
  title: string;
  type: StepType;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  code?: string
  path?: string
};

/**
 * Parses a formatted text string and extracts file information as Steps
 * @param text - The formatted text containing file structures
 * @returns Array of Step objects
 */
function parseFileStructure(text: string): Step[] {
  const steps: Step[] = [];
  let stepId = 1;
  
  // Extract general message at the beginning
  let generalMessage = "";
  const firstFileMarker = text.match(/\*\*\d+\.\s*`[^`]+`\*\*/);
  if (firstFileMarker && firstFileMarker.index) {
    generalMessage = text.substring(0, firstFileMarker.index).trim();
  }
  
  // Add a general project folder step if there's a general message
  if (generalMessage) {
    steps.push({
      id: stepId++,
      title: "Project Files",
      type: StepType.CreateFolder,
      description: generalMessage,
      status: "pending"
    });
  }
  
  // Split by file markers (lines that start with **number. `path`**)
  const sections: string[] = text.split(/(?=\*\*\d+\.\s*`[^`]+`\*\*)/);
  
  sections.forEach((section: string) => {
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
      // Create file step
      steps.push({
        id: stepId++,
        title: `Create ${fileName}`,
        type: StepType.CreateFile,
        description: message.trim(),
        status: "pending",
        code: content.trim(),
        path: fullPath
      });
    }
  });
  
  return steps;
}

export default parseFileStructure;