import React from 'react';
import { Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden text-gray-400 bg-black border-t border-gray-800">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent"></div>
      <div className="absolute w-64 h-64 rounded-full pointer-events-none bg-blue-500/10 blur-3xl -top-32 -right-32"></div>
      <div className="absolute w-64 h-64 rounded-full pointer-events-none bg-purple-500/10 blur-3xl -bottom-32 -left-32"></div>

      {/* CHANGED: Remove 'container' class and use full width with padding */}
      <div className="relative z-10 w-full px-4 py-16 mx-auto max-w-none">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center mb-6 space-x-3 group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 375 375"
                className="transition-transform group-hover:scale-110"
              >
                <defs>
                  <clipPath id="footer-clip-1">
                    <path d="M 165 107 L 280.855469 107 L 280.855469 274.394531 L 165 274.394531 Z M 165 107" />
                  </clipPath>
                  <clipPath id="footer-clip-2">
                    <path d="M 94.105469 71.144531 L 210 71.144531 L 210 239 L 94.105469 239 Z M 94.105469 71.144531" />
                  </clipPath>
                </defs>
                <g>
                  <g clipPath="url(#footer-clip-1)">
                    <path style={{ fill: '#ffffff' }} d="M 280.746094 273.605469 C 275.378906 265.050781 270.003906 256.492188 264.621094 247.933594 L 256.546875 235.128906 L 248.445312 222.316406 L 232.210938 196.714844 L 216.984375 172.734375 L 236.589844 143.941406 L 241.753906 136.371094 C 243.480469 133.851562 245.195312 131.324219 246.933594 128.8125 L 257.363281 113.742188 L 261.582031 107.652344 L 205.964844 107.277344 L 204.792969 109.371094 C 203.078125 112.441406 201.402344 115.527344 199.710938 118.605469 L 198.445312 120.921875 L 197.199219 123.246094 L 194.691406 127.882812 L 189.734375 137.1875 L 187.207031 141.988281 C 186.246094 140.523438 185.28125 139.0625 184.316406 137.605469 L 181.359375 133.183594 L 178.375 128.773438 L 175.386719 124.378906 L 172.359375 120 C 170.332031 117.082031 168.273438 114.183594 166.1875 111.304688 C 166.125 111.203125 166.039062 111.136719 165.921875 111.105469 C 165.808594 111.078125 165.699219 111.089844 165.59375 111.152344 C 165.492188 111.210938 165.425781 111.300781 165.394531 111.414062 C 165.363281 111.53125 165.378906 111.640625 165.441406 111.742188 C 166.957031 114.953125 168.511719 118.144531 170.113281 121.316406 L 172.503906 126.070312 L 174.933594 130.8125 L 177.375 135.539062 L 179.84375 140.25 C 181.503906 143.378906 183.160156 146.515625 184.84375 149.636719 L 187.277344 154.136719 L 190.167969 149.597656 C 192.058594 146.632812 193.902344 143.648438 195.765625 140.671875 L 201.3125 131.710938 L 204.066406 127.214844 L 205.4375 124.976562 L 206.800781 122.734375 C 208.179688 120.453125 209.558594 118.179688 210.925781 115.894531 C 212.015625 115.894531 245.265625 115.765625 246.585938 115.742188 L 240.871094 124.8125 C 239.25 127.402344 237.59375 129.964844 235.957031 132.542969 L 231.023438 140.261719 L 211.261719 171.128906 L 210.230469 172.734375 L 211.261719 174.226562 L 228.394531 199.234375 L 245.5625 224.21875 L 254.148438 236.703125 L 262.761719 249.171875 C 268.5 257.5 274.261719 265.804688 280.039062 274.09375 C 280.105469 274.1875 280.195312 274.246094 280.308594 274.269531 C 280.421875 274.292969 280.527344 274.273438 280.625 274.207031 C 280.722656 274.144531 280.78125 274.054688 280.804688 273.941406 C 280.828125 273.824219 280.808594 273.71875 280.746094 273.621094 Z M 280.746094 273.605469" />
                  </g>
                  <g clipPath="url(#footer-clip-2)">
                    <path style={{ fill: '#ffffff' }} d="M 204.878906 224.042969 L 202.484375 219.28125 L 200.0625 214.546875 L 197.613281 209.820312 L 195.148438 205.109375 C 193.488281 201.976562 191.832031 198.839844 190.144531 195.722656 L 187.714844 191.21875 L 184.824219 195.761719 C 182.933594 198.722656 181.089844 201.710938 179.222656 204.6875 L 173.671875 213.648438 L 170.925781 218.144531 L 169.550781 220.382812 L 168.191406 222.625 C 166.816406 224.90625 165.445312 227.1875 164.085938 229.464844 C 162.996094 229.464844 129.746094 229.597656 128.417969 229.621094 L 134.121094 220.546875 C 135.746094 217.960938 137.398438 215.394531 139.039062 212.816406 L 143.972656 205.09375 L 163.734375 174.230469 L 164.761719 172.625 L 163.734375 171.132812 L 146.601562 146.175781 L 129.429688 121.246094 L 120.847656 108.785156 L 112.222656 96.34375 C 106.492188 88.039062 100.734375 79.753906 94.953125 71.484375 C 94.890625 71.390625 94.800781 71.332031 94.691406 71.308594 C 94.578125 71.285156 94.476562 71.304688 94.378906 71.363281 C 94.28125 71.425781 94.21875 71.515625 94.191406 71.628906 C 94.164062 71.742188 94.183594 71.851562 94.242188 71.949219 C 99.617188 80.496094 104.992188 89.035156 110.367188 97.570312 L 118.441406 110.371094 L 126.546875 123.148438 L 142.773438 148.703125 L 158.007812 172.628906 L 138.410156 201.421875 L 133.25 208.992188 C 131.523438 211.507812 129.8125 214.039062 128.070312 216.550781 L 117.640625 231.617188 L 113.425781 237.710938 L 169.042969 238.082031 L 170.21875 235.972656 C 171.929688 232.902344 173.609375 229.816406 175.296875 226.738281 L 176.5625 224.421875 L 177.816406 222.105469 L 180.324219 217.46875 L 185.257812 208.175781 L 187.78125 203.378906 L 190.675781 207.753906 L 193.632812 212.175781 L 196.617188 216.585938 L 199.605469 220.984375 L 202.632812 225.363281 C 204.65625 228.28125 206.714844 231.175781 208.804688 234.050781 C 208.871094 234.140625 208.957031 234.195312 209.0625 234.21875 C 209.171875 234.238281 209.269531 234.222656 209.363281 234.164062 C 209.460938 234.109375 209.523438 234.03125 209.554688 233.925781 C 209.585938 233.820312 209.578125 233.71875 209.53125 233.621094 C 208.03125 230.417969 206.476562 227.222656 204.878906 224.042969 Z M 204.878906 224.042969" />
                  </g>
                </g>
              </svg>
              <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-cyan-300">
                X<span className="text-white">CodeGen</span>
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-gray-400">
              Create beautiful websites in seconds using natural language prompts. No coding required.
            </p>
            <div className="flex mt-8 space-x-4">
              <a href="https://github.com/imramkrishna/XCodeGen" target='_blank' className="flex items-center justify-center text-gray-500 transition-all duration-300 rounded-lg w-9 h-9 hover:text-white hover:bg-gray-800">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://x.com/ramkrishnacode" target='_blank' className="flex items-center justify-center text-gray-500 transition-all duration-300 rounded-lg w-9 h-9 hover:text-teal-400 hover:bg-gray-800">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/ramkrishnaprofile/" target='_blank' className="flex items-center justify-center text-gray-500 transition-all duration-300 rounded-lg w-9 h-9 hover:text-teal-600 hover:bg-gray-800">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <FooterColumn
            title="Product"
            items={['Features', 'Templates', 'Pricing', 'Examples', 'Changelog']}
            highlight="Templates"
          />

          <FooterColumn
            title="Resources"
            items={['Documentation', 'Tutorials', 'Blog', 'Support', 'API']}
            highlight="Blog"
          />

          <FooterColumn
            title="Company"
            items={['About', 'Careers', 'Contact', 'Privacy', 'Terms']}
            badge="We're Hiring"
          />
        </div>

        {/* Newsletter signup - also ensure full width */}
        <div className="w-full p-6 mt-12 mb-10 border rounded-2xl bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <div className="grid items-center grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <h4 className="text-lg font-medium text-white">Stay in the loop</h4>
              <p className="mt-1 text-sm text-gray-400">Get updates about new features and releases</p>
            </div>
            <div className="md:col-span-2">
              <form className="flex flex-wrap gap-3 sm:flex-nowrap">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 w-full px-4 py-3 text-sm text-gray-200 bg-gray-900 border border-gray-700 rounded-lg placeholder:text-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
                <button className="w-full px-5 py-3 text-sm font-medium text-white transition-all rounded-lg sm:w-auto bg-gradient-to-r from-teal-500 to-teal-700 hover:shadow-lg hover:shadow-teal-500/20 focus:outline-none focus:ring-2 focus:ring-teal-500/50">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer bottom - ensure full width */}
        <div className="flex flex-col items-center justify-between w-full pt-8 mt-8 border-t border-gray-800/70 md:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} <a href="https://ramkrishnacode.tech">Ram Krishna Yadav.</a>  All rights reserved.
          </p>
          <div className="flex mt-4 space-x-6 md:mt-0">
            <a href="#" className="text-xs text-gray-500 transition-colors hover:text-gray-200">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-gray-500 transition-colors hover:text-gray-200">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-gray-500 transition-colors hover:text-gray-200">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Reusable column component for footer links
interface FooterColumnProps {
  title: string;
  items: string[];
  highlight?: string;
  badge?: string;
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, items, highlight, badge }) => (
  <div>
    <div className="flex items-center mb-5">
      <h3 className="font-medium text-white">{title}</h3>
      {badge && (
        <span className="px-2 py-1 ml-2 text-xs font-medium text-green-300 rounded-full bg-green-900/30">
          {badge}
        </span>
      )}
    </div>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item}>
          <a
            href="#"
            className={`group flex items-center text-sm transition-colors ${item === highlight
              ? 'text-teal-400 hover:text-teal-300'
              : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            {item}
            {item === highlight && (
              <ExternalLink
                size={14}
                className="ml-1.5 opacity-70 group-hover:translate-x-0.5 transition-transform"
              />
            )}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;