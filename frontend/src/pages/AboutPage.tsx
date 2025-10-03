import { Users, Target, Heart, Award, Github, Twitter, Linkedin } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const AboutPage = () => {
  const team = [
    {
      name: 'Ram Krishna Yadav',
      role: 'Founder & CEO',
      image: '/api/placeholder/150/150',
      bio: 'Full-stack developer passionate about making web development accessible to everyone through AI.',
      social: {
        github: 'https://github.com/imramkrishna',
        twitter: 'https://x.com/ramkrishnacode',
        linkedin: 'https://www.linkedin.com/in/ramkrishnaprofile/'
      }
    }
  ];

  const values = [
    {
      icon: Users,
      title: 'User-Centric',
      description: 'We put our users first, building tools that solve real problems and make development more accessible.'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'We constantly push the boundaries of what\'s possible with AI-powered development tools.'
    },
    {
      icon: Heart,
      title: 'Open Source',
      description: 'We believe in the power of open source and contributing back to the developer community.'
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'We maintain the highest standards in code quality, user experience, and product reliability.'
    }
  ];

  const stats = [
    { label: 'Websites Generated', value: '4.2K+' },
    { label: 'Active Users', value: '720+' },
    { label: 'Lines of Code Generated', value: '1.2M+' },
    { label: 'Countries Served', value: '40+' }
  ];

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
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-transparent md:text-6xl lg:text-7xl bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text">
            Building the future of web development
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-400 md:text-xl">
            We're on a mission to make web development accessible to everyone through the power of AI and natural language processing.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Our Mission</h2>
              <p className="mb-6 text-lg text-gray-400 leading-relaxed">
                At XCodeGen, we believe that creating beautiful, functional websites shouldn't require years of coding experience. Our mission is to democratize web development by bridging the gap between ideas and implementation.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                By leveraging cutting-edge AI technology, we enable anyone to bring their digital vision to life through simple, natural language descriptions. Whether you're an entrepreneur, designer, or complete beginner, XCodeGen empowers you to build professional websites in minutes, not months.
              </p>
            </div>
            <div className="relative">
              <div className="p-8 border border-gray-800 rounded-2xl bg-gray-900/50 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="mb-2 text-2xl font-bold text-white md:text-3xl">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="mb-12 text-3xl font-bold text-center text-white md:text-4xl">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="p-6 text-center transition-all duration-300 border border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 hover:-translate-y-2 group">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 transition-transform duration-300 bg-teal-600 rounded-lg group-hover:scale-110">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">{value.title}</h3>
                  <p className="text-sm text-gray-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="mb-12 text-3xl font-bold text-center text-white md:text-4xl">Meet Our Team</h2>
          <div className="grid gap-8 justify-center md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <div key={index} className="max-w-sm mx-auto p-6 transition-all duration-300 border border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 hover:-translate-y-2 group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full bg-gradient-to-br from-teal-500 to-cyan-600">
                    <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>
                <h3 className="mb-1 text-xl font-semibold text-center text-white">{member.name}</h3>
                <p className="mb-3 text-sm text-center text-teal-400">{member.role}</p>
                <p className="mb-4 text-sm text-center text-gray-400">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  <a 
                    href={member.social.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-gray-500 transition-all duration-300 rounded-lg w-8 h-8 hover:text-white hover:bg-gray-800"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a 
                    href={member.social.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-gray-500 transition-all duration-300 rounded-lg w-8 h-8 hover:text-blue-400 hover:bg-gray-800"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a 
                    href={member.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-gray-500 transition-all duration-300 rounded-lg w-8 h-8 hover:text-blue-600 hover:bg-gray-800"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="mb-8 text-3xl font-bold text-center text-white md:text-4xl">Our Story</h2>
          <div className="p-8 border border-gray-800 rounded-2xl bg-gray-900/50 backdrop-blur-sm">
            <div className="space-y-6 text-gray-400">
              <p className="text-lg leading-relaxed">
                XCodeGen was born out of frustration with the complexity of modern web development. As a developer, I witnessed countless brilliant ideas never see the light of day because their creators lacked the technical skills to bring them to life.
              </p>
              <p className="text-lg leading-relaxed">
                The breakthrough came when I realized that AI could serve as a translator between human creativity and technical implementation. What if anyone could describe their vision in plain English and receive a fully functional website in return?
              </p>
              <p className="text-lg leading-relaxed">
                Today, XCodeGen is making this vision a reality. We're not just building a tool; we're creating a movement toward a more inclusive and accessible web development ecosystem where great ideas matter more than coding expertise.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Join Our Journey</h2>
          <p className="mb-8 text-lg text-gray-400">
            We're always looking for passionate individuals to join our mission of democratizing web development.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="mailto:ramkrishnacode@gmail.com"
              className="px-8 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 hover:shadow-lg hover:shadow-teal-500/30"
            >
              Get In Touch
            </a>
            <a
              href="https://github.com/imramkrishna/XCodeGen"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 font-medium text-gray-300 transition-all border border-gray-700 rounded-lg hover:border-gray-600 hover:text-white hover:bg-gray-800/50"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;