export const fullStackBasePrompt = `<boltArtifact id="fullstack-project" title="Fullstack Project Setup">
<boltAction type="file" filePath=".gitignore">node_modules/
dist/
build/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.log
.DS_Store
Thumbs.db
coverage/
.nyc_output/
.vscode/
.idea/
</boltAction>
<boltAction type="file" filePath="frontend/.env">VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Frontend App
</boltAction>
<boltAction type="file" filePath="frontend/.gitignore">node_modules/
dist/
build/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.log
.DS_Store
Thumbs.db
coverage/
.nyc_output/
</boltAction>
<boltAction type="file" filePath="frontend/eslint.config.js">import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
</boltAction>
<boltAction type="file" filePath="frontend/index.html"><!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fullstack App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
</boltAction>
<boltAction type="file" filePath="frontend/package.json">{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.8.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
</boltAction>
<boltAction type="file" filePath="frontend/postcss.config.js">export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
</boltAction>
<boltAction type="file" filePath="frontend/tailwind.config.js">/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
</boltAction>
<boltAction type="file" filePath="frontend/tsconfig.app.json">{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
</boltAction>
<boltAction type="file" filePath="frontend/tsconfig.json">{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
</boltAction>
<boltAction type="file" filePath="frontend/tsconfig.node.json">{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
</boltAction>
<boltAction type="file" filePath="frontend/vite.config.ts">import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
</boltAction>
<boltAction type="file" filePath="frontend/src/App.tsx">import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
</boltAction>
<boltAction type="file" filePath="frontend/src/config.ts">export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  appName: import.meta.env.VITE_APP_NAME || 'Fullstack App',
  isDevelopment: import.meta.env.MODE === 'development',
};
</boltAction>
<boltAction type="file" filePath="frontend/src/index.css">@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</boltAction>
<boltAction type="file" filePath="frontend/src/main.tsx">import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
</boltAction>
<boltAction type="file" filePath="frontend/src/vite-env.d.ts">/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
</boltAction>
<boltAction type="file" filePath="frontend/src/pages/LandingPage.tsx">import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container px-4 py-16 mx-auto">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Welcome to Our Platform
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-gray-600">
            Build amazing websites with our intuitive drag-and-drop builder.
            No coding required!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
</boltAction>
<boltAction type="file" filePath="frontend/src/components/common/Header.tsx">import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container px-4 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            Platform
          </div>
          <nav className="flex space-x-6">
            <a href="#" className="text-gray-600 transition-colors hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-gray-600 transition-colors hover:text-gray-900">
              About
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
</boltAction>
<boltAction type="file" filePath="frontend/src/components/common/Footer.tsx">import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 text-white bg-gray-800">
      <div className="container px-4 mx-auto">
        <div className="text-center">
          <p>&copy; 2024 Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
</boltAction>
<boltAction type="file" filePath="backend/.env">PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/fullstack-app
JWT_SECRET=your-jwt-secret-key-here
</boltAction>
<boltAction type="file" filePath="backend/.gitignore">node_modules/
dist/
build/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.log
.DS_Store
Thumbs.db
coverage/
.nyc_output/
</boltAction>
<boltAction type="file" filePath="backend/package.json">{
  "name": "backend",
  "version": "1.0.0",
  "description": "Backend API for fullstack app",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src/**/*.ts",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "helmet": "^6.0.1",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/cors": "^2.8.13",
    "@types/morgan": "^1.9.4",
    "@types/node": "^18.15.11",
    "@typescript-eslint/eslint-plugin": "^5.57.1",
    "@typescript-eslint/parser": "^5.57.1",
    "eslint": "^8.37.0",
    "jest": "^29.5.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.2"
  }
}
</boltAction>
<boltAction type="file" filePath="backend/tsconfig.json">{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
</boltAction>
<boltAction type="file" filePath="backend/tsconfig.tsbuildinfo">{
  "program": {
    "fileNames": [],
    "fileInfos": [],
    "options": {},
    "referencedMap": {},
    "exportedModulesMap": {},
    "semanticDiagnosticsPerFile": []
  },
  "version": "5.0.2"
}
</boltAction>
<boltAction type="file" filePath="backend/src/index.ts">import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
</boltAction>
</boltArtifact>`;