import { ExternalLink, Code, Eye, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ExamplesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const examples = [
    {
      title: 'E-commerce Store',
      description: 'A modern online store with product catalog, shopping cart, and checkout functionality.',
      category: 'E-commerce',
      tags: ['React', 'Tailwind', 'Stripe'],
      image: '/api/placeholder/400/250',
      demoUrl: '#',
      codeUrl: '#',
      prompt: 'Create a modern e-commerce website for selling electronics with a dark theme'
    },
    {
      title: 'Portfolio Website',
      description: 'A clean, professional portfolio showcasing projects, skills, and experience.',
      category: 'Portfolio',
      tags: ['Vue', 'CSS Grid', 'Animations'],
      image: '/api/placeholder/400/250',
      demoUrl: '#',
      codeUrl: '#',
      prompt: 'Build a minimalist portfolio website for a UI/UX designer with project gallery'
    },
    {
      title: 'SaaS Landing Page',
      description: 'A conversion-optimized landing page for a software-as-a-service product.',
      category: 'Landing Page',
      tags: ['Next.js', 'TypeScript', 'SEO'],
      image: '/api/placeholder/400/250',
      demoUrl: '#',
      codeUrl: '#',
      prompt: 'Create a SaaS landing page for a project management tool with pricing section'
    },
    {
      title: 'Blog Platform',
      description: 'A content management system with article publishing and reading features.',
      category: 'Blog',
      tags: ['Angular', 'Markdown', 'CMS'],
      image: '/api/placeholder/400/250',
      demoUrl: '#',
      codeUrl: '#',
      prompt: 'Build a tech blog platform with categories, search, and comment system'
    },
    {
      title: 'Restaurant Website',
      description: 'An appetizing restaurant website with menu, reservations, and location info.',
      category: 'Business',
      tags: ['HTML', 'CSS', 'JavaScript'],
      image: '/api/placeholder/400/250',
      demoUrl: '#',
      codeUrl: '#',
      prompt: 'Design a restaurant website with online menu and table booking system'
    },
    {
      title: 'Agency Website',
      description: 'A professional digital agency website showcasing services and team.',
      category: 'Agency',
      tags: ['React', 'GSAP', 'Responsive'],
      image: '/api/placeholder/400/250',
      demoUrl: '#',
      codeUrl: '#',
      prompt: 'Create a digital marketing agency website with animated hero section'
    },
    {
      title: 'Fitness App Landing',
      description: 'A motivational landing page for a fitness mobile application.',
      category: 'App',
      tags: ['Vue', 'Sass', 'Mobile'],
      image: '/api/placeholder/400/250',
      demoUrl: '#',
      codeUrl: '#',
      prompt: 'Design a fitness app landing page with workout tracking features'
    },
    {
      title: 'Corporate Website',
      description: 'A professional corporate website with company information and services.',
      category: 'Corporate',
      tags: ['React', 'TypeScript', 'CMS'],
      image: '/api/placeholder/400/250',
      demoUrl: '#',
      codeUrl: '#',
      prompt: 'Build a corporate website for a consulting firm with team profiles'
    },
    {
      title: 'Event Website',
      description: 'A dynamic event website with registration and schedule management.',
      category: 'Event',
      tags: ['Next.js', 'Tailwind', 'Calendar'],
      image: '/api/placeholder/400/250',
      demoUrl: '#',
      codeUrl: '#',
      prompt: 'Create an event website for a tech conference with speaker profiles'
    }
  ];

  const categories = ['All', 'E-commerce', 'Portfolio', 'Landing Page', 'Blog', 'Business', 'Agency', 'App', 'Corporate', 'Event'];

  const filteredExamples = selectedCategory === 'All' 
    ? examples 
    : examples.filter(example => example.category === selectedCategory);

  return (
    <div className="min-h-screen overflow-hidden text-white bg-black">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-gray-900 to-black"></div>
      </div>

      <Header />

      <main className="relative z-10 px-4 pt-32 pb-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-transparent md:text-6xl lg:text-7xl bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text">
            Built with XCodeGen
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-400 md:text-xl">
            Explore real websites created by our users with simple text prompts. Get inspired and see what's possible.
          </p>
        </div>

        {/* Filter and Search Section */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 text-sm font-medium">Filter by category:</span>
            </div>
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search examples..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  category === selectedCategory
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Examples Grid */}
        <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {filteredExamples.map((example, index) => (
            <div
              key={index}
              className="group transition-all duration-300 border border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-xl hover:border-gray-700 hover:bg-gray-800/50 hover:-translate-y-2 overflow-hidden"
            >
              {/* Image Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-teal-500/20 to-cyan-500/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Example Website</p>
                  </div>
                </div>
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a
                    href={example.demoUrl}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </a>
                  <a
                    href={example.codeUrl}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 border border-gray-600 rounded-lg hover:text-white hover:border-gray-500 transition-colors"
                  >
                    <Code className="w-4 h-4" />
                    Code
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium text-teal-300 bg-teal-900/30 rounded-full border border-teal-500/30">
                    {example.category}
                  </span>
                  <a
                    href={example.demoUrl}
                    className="ml-auto text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
                  {example.title}
                </h3>
                
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  {example.description}
                </p>

                {/* Prompt */}
                <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <p className="text-xs text-gray-500 mb-1">Prompt used:</p>
                  <p className="text-sm text-gray-300 italic">"{example.prompt}"</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {example.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 text-xs text-gray-400 bg-gray-800 rounded border border-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to create your own?
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Start building your dream website today with just a simple description.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/builder"
              className="px-8 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 hover:shadow-lg hover:shadow-teal-500/30"
            >
              Start Building
            </Link>
            <Link
              to="/features"
              className="px-8 py-3 font-medium text-gray-300 transition-all border border-gray-700 rounded-lg hover:border-gray-600 hover:text-white hover:bg-gray-800/50"
            >
              View Features
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExamplesPage;