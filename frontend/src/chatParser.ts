// Define TypeScript interfaces for better type safety
interface ParsedChatResult {
  type: 'simple' | 'structured';
  content: string;
  sections: Section[];
  codeBlocks: CodeBlock[];
  hasStructure: boolean;
  introduction: string;
  conclusion: string;
}

interface CodeBlock {
  id: string;
  language: string;
  code: string;
  fullMatch: string;
}

interface Section {
  title: string;
  type: 'general' | 'code' | 'features' | 'benefits' | 'concepts';
  content: string;
  items: ListItem[];
  codeBlocks: CodeBlock[];
  subsections: Section[];
}

interface ListItem {
  title: string;
  description: string;
  type: 'simple' | 'titled';
}

// Core parsing function with type safety
function parseChat(aiResponse: string | unknown): ParsedChatResult {
  try {
    if (!aiResponse || typeof aiResponse !== 'string') {
      return { 
        type: 'simple', 
        content: aiResponse?.toString() || '', 
        sections: [], 
        codeBlocks: [], 
        hasStructure: false,
        introduction: '',
        conclusion: ''
      };
    }

    const result: ParsedChatResult = {
      type: 'structured',
      content: aiResponse,
      sections: [],
      codeBlocks: [],
      hasStructure: false,
      introduction: '',
      conclusion: ''
    };

    // Enhanced code block regex that handles various formats
    const codeBlockRegex = /```(\w+)?(?:\s*\n|\s)([\s\S]*?)```/g;
    let codeMatch;
    let codeIndex = 0;
    
    // Extract all code blocks first
    while ((codeMatch = codeBlockRegex.exec(aiResponse)) !== null) {
      result.codeBlocks.push({
        id: `code-${codeIndex++}`,
        language: codeMatch[1]?.toLowerCase() || 'text',
        code: codeMatch[2].trim(),
        fullMatch: codeMatch[0]
      });
    }

    // Split content by horizontal dividers with more flexible pattern
    const parts = aiResponse.split(/\n\s*---+\s*\n|\n\s*\*\*\*+\s*\n/);
    
    if (parts.length > 1) {
      result.hasStructure = true;
      result.introduction = parts[0].trim();
      
      // Process each section
      for (let i = 1; i < parts.length; i++) {
        const sectionContent = parts[i].trim();
        if (!sectionContent) continue;
        
        const section = parseSection(sectionContent, result.codeBlocks);
        if (section) {
          result.sections.push(section);
        }
      }
      
      // Last section might be conclusion
      if (result.sections.length > 0) {
        const lastSection = result.sections[result.sections.length - 1];
        const conclusionKeywords = ['why', 'summary', 'conclusion', 'finally', 'in closing', 'to summarize'];
        
        if (lastSection.title && conclusionKeywords.some(keyword => 
          lastSection.title.toLowerCase().includes(keyword))) {
          result.conclusion = lastSection.content;
        }
      }
    } else {
      // No explicit structure found - try to infer sections from headings
      const headingSections = inferSectionsFromHeadings(aiResponse, result.codeBlocks);
      
      if (headingSections.length > 1) {
        result.hasStructure = true;
        result.introduction = headingSections[0].content;
        result.sections = headingSections.slice(1);
      } else {
        // Simple response without structure
        result.type = 'simple';
        result.introduction = aiResponse;
      }
    }

    return result;
  } catch (error) {
    console.error("Error parsing chat response:", error);
    return { 
      type: 'simple', 
      content: typeof aiResponse === 'string' ? aiResponse : 'Error parsing response', 
      sections: [], 
      codeBlocks: [], 
      hasStructure: false,
      introduction: '',
      conclusion: ''
    };
  }
}

// Infer sections from markdown headings when no explicit dividers exist
function inferSectionsFromHeadings(text: string, codeBlocks: CodeBlock[]): Section[] {
  try {
    // Match any level heading (# to ####)
    const headingRegex = /^(#{1,4})\s+(.+)$/gm;
    const matches = Array.from(text.matchAll(headingRegex));
    
    if (matches.length === 0) {
      return [{
        title: '',
        type: 'general',
        content: text,
        items: [],
        codeBlocks: [],
        subsections: []
      }];
    }

    const sections: Section[] = [];
    let currentIndex = 0;

    // Process each heading and content between headings
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const headingLevel = match[1].length;
      const headingTitle = match[2].replace(/\*\*/g, '').trim();
      const headingStart = match.index || 0;
      
      // For the first heading, check if there's content before it (introduction)
      if (i === 0 && headingStart > 0) {
        sections.push({
          title: '',
          type: 'general',
          content: text.slice(0, headingStart).trim(),
          items: [],
          codeBlocks: [],
          subsections: []
        });
      }
      
      // Find the end of this section (next heading or end of text)
      const nextMatch = matches[i + 1];
      const sectionEnd = nextMatch ? nextMatch.index : text.length;
      const sectionContent = text.slice(headingStart + match[0].length, sectionEnd).trim();
      
      // Create the section
      const section = parseSection(sectionContent, codeBlocks);
      if (section) {
        section.title = headingTitle;
        section.type = detectSectionType(headingTitle);
        sections.push(section);
      }
      
      currentIndex = sectionEnd;
    }
    
    return sections;
  } catch (error) {
    console.error("Error inferring sections:", error);
    return [{
      title: '',
      type: 'general',
      content: text,
      items: [],
      codeBlocks: [],
      subsections: []
    }];
  }
}

// Improved section parser
function parseSection(sectionText: string, codeBlocks: CodeBlock[]): Section | null {
  try {
    const lines = sectionText.split('\n');
    const section: Section = {
      title: '',
      type: 'general',
      content: '',
      items: [],
      codeBlocks: [],
      subsections: []
    };

    let currentContent: string[] = [];
    let inList = false;
    let listItems: ListItem[] = [];
    let listIndentation = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Check for section headers (handles multiple formats)
      if (trimmedLine.match(/^#{1,3}\s+\**[^*]+\**/) || 
          trimmedLine.startsWith('### **') || 
          trimmedLine.startsWith('###')) {
        
        // Extract title from header format and clean it
        section.title = trimmedLine
          .replace(/^#{1,3}\s*\*?\*?/, '')
          .replace(/\*?\*?$/, '')
          .trim();
        
        section.type = detectSectionType(section.title);
        continue;
      }
      
      // Improved list detection with various formats
      const listMatch = trimmedLine.match(/^(\s*)(\d+\.|\*|-|\+)\s+(.+)$/);
      if (listMatch) {
        const indent = listMatch[1] || '';
        const marker = listMatch[2] || '';
        const content = listMatch[3] || '';
        
        if (!inList) {
          if (currentContent.length > 0) {
            section.content += currentContent.join('\n') + '\n';
            currentContent = [];
          }
          inList = true;
          listItems = [];
          listIndentation = indent.length;
        }
        
        const item = parseListItem(content);
        listItems.push(item);
        continue;
      }
      
      // Handle list continuation (indented text under a list item)
      if (inList && trimmedLine === '') {
        // Check next line to see if it's part of the list
        const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
        if (!nextLine.trim() || !nextLine.trim().match(/^(\d+\.|\*|-|\+)\s+/)) {
          // Empty line followed by non-list line ends the list
          section.items.push(...listItems);
          inList = false;
          listItems = [];
        }
        continue;
      }
      
      // Regular content
      if (!inList) {
        currentContent.push(line);
      }
    }
    
    // Handle remaining content
    if (inList && listItems.length > 0) {
      section.items.push(...listItems);
    }
    
    if (currentContent.length > 0) {
      section.content = currentContent.join('\n').trim();
    }
    
    // Process code blocks in this section more accurately
    if (section.content) {
      section.codeBlocks = codeBlocks.filter(block => 
        section.content.includes(block.fullMatch)
      );
    }

    return section.title || section.content || section.items.length > 0 ? section : null;
  } catch (error) {
    console.error("Error parsing section:", error);
    return {
      title: '',
      type: 'general',
      content: sectionText,
      items: [],
      codeBlocks: [],
      subsections: []
    };
  }
}

// Improved list item parser with better handling of formatting
function parseListItem(itemText: string): ListItem {
  try {
    // Clean up any list markers at the beginning
    const cleanText = itemText.replace(/^\d+\.\s*|\*\s*|-\s*|\+\s*/, '');
    
    // Check for "Title: Description" format
    const colonMatch = cleanText.match(/^(.+?):\s+(.+)$/);
    if (colonMatch) {
      return {
        title: colonMatch[1].trim(),
        description: colonMatch[2].trim(),
        type: 'titled'
      };
    }
    
    // Check for bold title format
    const boldMatch = cleanText.match(/\*\*(.*?)\*\*:?\s*(.*)/);
    if (boldMatch) {
      return {
        title: boldMatch[1],
        description: boldMatch[2] || '',
        type: 'titled'
      };
    }
    
    // Simple list item
    return {
      title: cleanText,
      description: '',
      type: 'simple'
    };
  } catch (error) {
    console.error("Error parsing list item:", error);
    return {
      title: itemText || '',
      description: '',
      type: 'simple'
    };
  }
}

// Section type detection
function detectSectionType(title: string): Section['type'] {
  try {
    const titleLower = title.toLowerCase();
    
    const typePatterns = {
      code: ['syntax', 'code', 'example', 'implementation', 'snippet'],
      features: ['key', 'feature', 'capabilities', 'functionality'],
      benefits: ['why', 'benefit', 'advantages', 'pros'],
      concepts: ['concept', 'basic', 'fundamental', 'principle', 'theory']
    };
    
    for (const [type, patterns] of Object.entries(typePatterns)) {
      if (patterns.some(pattern => titleLower.includes(pattern))) {
        return type as Section['type'];
      }
    }
    
    return 'general';
  } catch (error) {
    console.error("Error detecting section type:", error);
    return 'general';
  }
}

export { parseChat, type ParsedChatResult, type CodeBlock, type Section, type ListItem };