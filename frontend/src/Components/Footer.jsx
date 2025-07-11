import React from "react";
import { BookOpen, Mail, Phone, MapPin, Github, Twitter, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  const contributors = [
    { name: "Calvin Rodriguez", role: "Full Stack Developer", github: "calvindev" },
    { name: "Sarah Johnson", role: "UI/UX Designer", github: "sarahjohnson" },
    { name: "Mike Chen", role: "Backend Developer", github: "mikechen" },
    { name: "Emma Williams", role: "Frontend Developer", github: "emmawilliams" }
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Support", href: "/support" }
  ];

  const categories = [
    { name: "Web Development", href: "/category/web-dev" },
    { name: "Mobile Development", href: "/category/mobile-dev" },
    { name: "Data Science", href: "/category/data-science" },
    { name: "Machine Learning", href: "/category/ml" },
    { name: "DevOps", href: "/category/devops" },
    { name: "Cloud Computing", href: "/category/cloud" }
  ];

  return (
    <footer className="bg-slate-900/50 backdrop-blur-md border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LMS Learning
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering learners worldwide with cutting-edge technology courses. 
              Build your future with industry-relevant skills and expert-led training.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <a 
                    href={category.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">contact@lmslearning.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contributors Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h4 className="text-lg font-semibold text-white mb-6 text-center">Our Contributors</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contributors.map((contributor, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-semibold text-sm">
                    {contributor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h5 className="text-white font-medium text-sm">{contributor.name}</h5>
                <p className="text-gray-400 text-xs mb-2">{contributor.role}</p>
                <a 
                  href={`https://github.com/${contributor.github}`}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mx-auto" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 LMS Learning. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;