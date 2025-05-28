export const MessageFormat = `
Generate responses in this exact format:

[Optional: Brief intro paragraph]

**1. \`path/to/file1.ext\`**

\`\`\`language
code content here
\`\`\`

**2. \`path/to/file2.ext\`**

\`\`\`language
code content here
\`\`\`

## Rules:
- Start with optional intro paragraph (keep brief)
- Each file: **{number}. \`{path}\`**
- Code in fenced blocks with language identifier
- Number files sequentially (1, 2, 3...)
- Use backticks around file paths
- No extra explanatory text between files

## Example:
Creating a simple React app structure:

**1. \`src/App.tsx\`**

\`\`\`tsx
import React from 'react';

function App() {
  return <div>Hello World</div>;
}

export default App;
\`\`\`

**2. \`src/index.css\`**

\`\`\`css
body { margin: 0; }
\`\`\`
`;

// Alternative version with escaped quotes if you prefer double quotes:
const MessageFormatAlt = "Generate responses in this exact format:\n\n[Optional: Brief intro paragraph]\n\n**1. `path/to/file1.ext`**\n\n```language\ncode content here\n```\n\n**2. `path/to/file2.ext`**\n\n```language\ncode content here\n```\n\n## Rules:\n- Start with optional intro paragraph (keep brief)\n- Each file: **{number}. `{path}`**\n- Code in fenced blocks with language identifier\n- Number files sequentially (1, 2, 3...)\n- Use backticks around file paths\n- No extra explanatory text between files";