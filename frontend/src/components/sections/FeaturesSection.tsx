import { Code, Layout, Terminal, Zap, Globe, Smartphone, Palette, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
  const features = [
    {
      icon: Layout,
      title: 'Intuitive Design',
      description: 'Beautiful, responsive websites created automatically from your description with modern design principles.',
      color: 'blue'
    },
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Generate well-structured, maintainable code ready for production with best practices built-in.',
      color: 'purple'
    },
    {
      icon: Terminal,
      title: 'Full Control',
      description: 'Examine and edit every file to customize your website exactly how you want it with complete transparency.',
      color: 'green'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate complete websites in seconds, not hours. From idea to deployment in minutes.',
      color: 'yellow'
    },
    {
      icon: Globe,
      title: 'Multi-Platform',
      description: 'Export to React, Vue, Angular, or plain HTML/CSS. Deploy anywhere with platform-agnostic code.',
      color: 'indigo'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Every generated website is fully responsive and optimized for mobile devices by default.',
      color: 'pink'
    },
    {
      icon: Palette,
      title: 'Design Systems',
      description: 'Consistent design patterns and components that follow modern UI/UX best practices.',
      color: 'cyan'
    },
    {
      icon: Database,
      title: 'SEO Optimized',
      description: 'Built-in SEO optimization with meta tags, structured data, and performance optimization.',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-teal-600 border-teal-500/50 hover:border-teal-400/50 group-hover:text-teal-400',
      purple: 'bg-purple-600 border-purple-500/50 hover:border-purple-400/50 group-hover:text-purple-400',
      green: 'bg-green-600 border-green-500/50 hover:border-green-400/50 group-hover:text-green-400',
      yellow: 'bg-yellow-600 border-yellow-500/50 hover:border-yellow-400/50 group-hover:text-yellow-400',
      indigo: 'bg-indigo-600 border-indigo-500/50 hover:border-indigo-400/50 group-hover:text-indigo-400',
      pink: 'bg-pink-600 border-pink-500/50 hover:border-pink-400/50 group-hover:text-pink-400',
      cyan: 'bg-cyan-600 border-cyan-500/50 hover:border-cyan-400/50 group-hover:text-cyan-400',
      orange: 'bg-orange-600 border-orange-500/50 hover:border-orange-400/50 group-hover:text-orange-400'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <section id="features" className="relative py-20">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
            Powerful Features
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-400 md:text-xl">
            Everything you need to build modern, professional websites with AI-powered development tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const colorClasses = getColorClasses(feature.color);
            
            return (
              <div
                key={index}
                className={`p-6 transition-all duration-300 border border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-xl hover:border-gray-700 hover:bg-gray-800/50 group hover:-translate-y-2 ${colorClasses.includes('hover:border') ? colorClasses.split(' ').filter(c => c.includes('hover:border'))[0] : ''}`}
              >
                <div className={`flex items-center justify-center w-12 h-12 mb-4 transition-transform duration-300 rounded-lg group-hover:scale-110 ${colorClasses.split(' ')[0]}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className={`mb-3 text-lg font-semibold text-white transition-colors ${colorClasses.split(' ').filter(c => c.includes('group-hover:text'))[0] || ''}`}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400 transition-colors group-hover:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-teal-300 border rounded-full bg-teal-900/30 border-teal-500/30">
            <Zap className="w-4 h-4" />
            More features coming soon
          </div>
          <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            Ready to build something amazing?
          </h3>
          <p className="max-w-md mx-auto mb-8 text-gray-400">
            Join thousands of developers and creators who are already building with XCodeGen.
          </p>
          <Link
            to="/builder"
            className="px-8 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 hover:shadow-lg hover:shadow-teal-500/30"
          >
            Start Building Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;