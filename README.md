# XCodegen ⚡

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)

> **Transform ideas into production-ready code in seconds.** XCodegen is an AI-powered code generation platform that creates beautiful, fully-featured web applications through natural language conversations.

---

## 🌟 Overview

XCodegen is a revolutionary fullstack web application that leverages cutting-edge AI models to generate complete web projects from simple text descriptions. Whether you need a React frontend, Node.js backend, or a full-stack application, XCodegen understands your requirements and builds production-ready code instantly.

<!-- Add demo GIF here -->
<!-- ![XCodegen Demo](./docs/demo.gif) -->

### 🎯 What Makes XCodegen Unique?

- **🧠 Multi-Model AI Support**: Choose from Gemini Pro, Qwen 3, Llama 3, or Mistral for optimal code generation
- **💬 Dual Mode Interface**: Switch between Chat Mode (for Q&A) and Code Mode (for project generation)
- **🎨 Beautiful by Default**: Generated UIs are production-ready with Tailwind CSS and responsive design
- **📁 Complete Project Structure**: Get fully structured projects with all necessary files and configurations
- **👁️ Live Preview**: See your generated project in real-time with instant preview
- **⚡ One-Click Download**: Export your entire project as a ready-to-run ZIP file
- **🔧 Monaco Editor Integration**: View and edit generated code with VS Code-like experience

---

## 🚀 Key Features

### For Developers
- ✅ **Intelligent Project Detection**: Automatically identifies if you need React, Node.js, or fullstack setup
- ✅ **Code Editor with Syntax Highlighting**: Full Monaco editor with IntelliSense support
- ✅ **File Explorer**: Navigate through generated files with a visual tree structure
- ✅ **Step-by-Step Generation**: Watch your project build in real-time with progress tracking
- ✅ **Multiple AI Models**: Switch between AI providers based on your needs
- ✅ **Professional Code Quality**: Clean, maintainable, and well-structured code output

### For Users
- ✅ **Natural Language Input**: Describe what you want in plain English
- ✅ **Instant Results**: Get a working project in under a minute
- ✅ **Live Preview**: See your website render in real-time
- ✅ **Zero Setup**: No installation required to start generating
- ✅ **Learning Tool**: Study generated code to understand best practices

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| ![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react) | UI Framework |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript) | Type Safety |
| ![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite) | Build Tool |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css) | Styling |
| ![Monaco Editor](https://img.shields.io/badge/Monaco-4.6-007ACC) | Code Editor |
| ![React Router](https://img.shields.io/badge/React_Router-6.22-CA4245?logo=react-router) | Routing |
| ![Axios](https://img.shields.io/badge/Axios-1.9-5A29E4) | HTTP Client |
| ![Lucide React](https://img.shields.io/badge/Lucide-0.344-F56565) | Icon Library |

### Backend
| Technology | Purpose |
|-----------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js) | Runtime |
| ![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express) | Web Framework |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript) | Type Safety |
| ![Anthropic SDK](https://img.shields.io/badge/Anthropic-0.50-000000) | Claude AI |
| ![Google GenAI](https://img.shields.io/badge/Gemini-1.0-4285F4?logo=google) | Gemini API |
| ![OpenAI](https://img.shields.io/badge/OpenAI-4.102-412991?logo=openai) | GPT Models |

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **dotenv** - Environment management
- **CORS** - Cross-origin support

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- API Keys for AI models (Gemini, OpenRouter)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/imramkrishna/XCodegen.git
cd XCodegen
```

### 2️⃣ Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure your `.env` file:**
```bash
GEMINI_API_KEY=your-gemini-api-key-here
MISTRAL_API_KEY=your-openrouter-api-key-here
```

### 3️⃣ Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure your `.env` file:**
```bash
VITE_BACKEND_URL=http://localhost:3000
```

### 4️⃣ Getting API Keys

**Google Gemini API:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `backend/.env` as `GEMINI_API_KEY`

**OpenRouter API (for Mistral, Qwen3, Llama):**
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up and get your API key
3. Add to `backend/.env` as `MISTRAL_API_KEY`

---

## 🚀 Usage

### Running the Application

**Start Backend Server:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:3000`

**Start Frontend Development Server:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Using XCodegen

1. **Access the Application**: Open `http://localhost:5173` in your browser

2. **Choose Your Mode**:
   - **Chat Mode**: Ask coding questions, get explanations
   - **Code Mode**: Generate complete projects

3. **Select AI Model**: Choose from:
   - Qwen 3 (Recommended - Powerful & Fast)
   - Llama 3 (Advanced reasoning)
   - Gemini Pro (Google's multimodal AI)
   - Mistral (European AI excellence)

4. **Describe Your Project**: 
   ```
   Example: "Create a todo app with dark mode toggle"
   Example: "Build a REST API for a blog with user authentication"
   Example: "Make a landing page for a SaaS product"
   ```

5. **Watch It Build**: See real-time progress as files are generated

6. **Preview & Edit**: View your live project and edit code if needed

7. **Download**: Click "Download Project" to get a ZIP file

---

## 📁 Project Structure

```
XCodegen/
├── backend/                    # Express.js backend server
│   ├── src/
│   │   ├── index.ts           # Main server file
│   │   ├── prompts.ts         # AI prompt configurations
│   │   ├── constants.ts       # Constants and configs
│   │   └── defaults/          # Default templates
│   │       ├── react.ts       # React project template
│   │       ├── node.ts        # Node.js template
│   │       ├── fullstack.ts   # Fullstack template
│   │       └── chatMessage.ts # Chat system prompts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── pages/             # Page components
│   │   │   ├── LandingPage.tsx    # Home page
│   │   │   ├── BuilderPage.tsx    # Code generation page
│   │   │   ├── ChatMode.tsx       # Chat interface
│   │   │   ├── FeaturesPage.tsx
│   │   │   ├── ExamplesPage.tsx
│   │   │   ├── PricingPage.tsx
│   │   │   └── AboutPage.tsx
│   │   ├── components/        # Reusable components
│   │   │   ├── builder/
│   │   │   │   ├── FileExplorer.tsx
│   │   │   │   └── StepsList.tsx
│   │   │   ├── common/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── sections/
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # Entry point
│   │   ├── steps.ts           # Step parsing logic
│   │   ├── xmlParser.ts       # XML parsing utilities
│   │   └── chatParser.ts      # Chat response parser
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── README.md
```

---

## 🔌 API Documentation

### Backend Endpoints

#### `POST /template`
Determines project type (React, Node, or Fullstack) based on user prompt.

**Request:**
```json
{
  "prompt": "Create a todo app with React"
}
```

**Response:**
```json
{
  "prompts": ["...system prompts..."],
  "uiPrompts": ["...UI-specific prompts..."]
}
```

#### `POST /chatgemini`
Generate code using Google Gemini model.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Create a login form" }
  ]
}
```

**Response:**
```json
{
  "response": "...generated code..."
}
```

#### `POST /chatmistral`
Generate code using Mistral model via OpenRouter.

#### `POST /chatqwen`
Generate code using Qwen 3 model via OpenRouter.

#### `POST /chatllama`
Generate code using Llama 3 model via OpenRouter.

#### `POST /chatmode`
Handle chat mode conversations using Microsoft MAI model.

---

## 🎨 Generated Project Types

### React Projects
- Vite + React + TypeScript setup
- Tailwind CSS pre-configured
- Component-based architecture
- Responsive design by default
- Lucide React icons included

### Node.js Projects
- Express.js server setup
- TypeScript configuration
- RESTful API structure
- Environment variable support
- Error handling middleware

### Fullstack Projects
- Combined frontend and backend
- Monorepo structure
- Shared TypeScript types
- API integration setup
- Complete deployment configuration

---

## 🎯 Example Use Cases

### 1. Generate a Landing Page
```
Input: "Create a modern landing page for a productivity app with hero section, 
features, pricing, and contact form"

Output: Complete React app with:
- Responsive hero section
- Feature cards with icons
- Pricing tiers
- Contact form with validation
- Smooth animations
```

### 2. Build a REST API
```
Input: "Create a REST API for a blog with posts, comments, and user authentication"

Output: Node.js/Express app with:
- User authentication endpoints
- CRUD operations for posts
- Comment management
- Middleware for auth
- Error handling
```

### 3. Create a Dashboard
```
Input: "Build an admin dashboard with charts, tables, and user management"

Output: Full React app with:
- Sidebar navigation
- Data visualization charts
- Sortable data tables
- User CRUD operations
- Dark mode support
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Backend fails to start
```bash
# Solution: Check if port 3000 is available
lsof -ti:3000 | xargs kill -9
```

**Issue**: API key errors
```bash
# Solution: Verify your .env file has correct keys
cat backend/.env
```

**Issue**: Frontend can't connect to backend
```bash
# Solution: Ensure VITE_BACKEND_URL is correct in frontend/.env
# Default: http://localhost:3000
```

**Issue**: Generated code preview not loading
- Wait for generation to complete (progress bar reaches 100%)
- Check browser console for errors
- Ensure all dependencies are installed

---

## 📈 Roadmap

- [ ] Support for more AI models (GPT-4, Claude)
- [ ] Template library for common project types
- [ ] GitHub integration for direct repository creation
- [ ] Collaborative editing features
- [ ] Code versioning and history
- [ ] Custom component library builder
- [ ] Mobile app generation support
- [ ] Docker containerization
- [ ] CI/CD pipeline generation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ram Krishna Yadav**
- GitHub: [@imramkrishna](https://github.com/imramkrishna)
- Repository: [XCodegen](https://github.com/imramkrishna/XCodegen)

---

## 🙏 Acknowledgments

This project wouldn't be possible without:

- **Google Gemini** - Advanced AI capabilities
- **OpenRouter** - Multi-model AI access
- **Monaco Editor** - VS Code-like editing experience
- **Tailwind CSS** - Beautiful UI components
- **React & Vite** - Modern web development tools
- **Express.js** - Robust backend framework
- **Lucide Icons** - Beautiful icon library
- The open-source community for amazing tools and inspiration

---

## 🌟 Star History

If you find XCodegen useful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=imramkrishna/XCodegen&type=Date)](https://star-history.com/#imramkrishna/XCodegen&Date)

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/imramkrishna/XCodegen/issues)
- **Discussions**: [GitHub Discussions](https://github.com/imramkrishna/XCodegen/discussions)
- **Email**: support@xcodegen.dev

---

<div align="center">

Made with ❤️ by developers, for developers

**[Website](https://xcodegen.dev)** • **[Documentation](https://docs.xcodegen.dev)** • **[Blog](https://blog.xcodegen.dev)**

</div>
