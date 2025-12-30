import { memo } from "react";
import { Link } from "wouter";
import { Leaf, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { name: "Waste Classification", href: "/classify" },
      { name: "Eco Points", href: "/leaderboard" },
      { name: "Leaderboard", href: "/leaderboard" },
      { name: "Campaigns", href: "/campaigns" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Contact", href: "/contact" },
      { name: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  },
];

const SOCIAL_LINKS = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-primary" aria-hidden="true" />
              <span className="text-xl font-bold">EcoWise</span>
            </div>
            <p className="text-gray-400 max-w-xs leading-relaxed">
              Empowering communities to make sustainable choices through AI-powered waste management and gamified environmental action.
            </p>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                const isExternal = social.href.startsWith("http");
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200"
                    aria-label={social.name}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          <nav className="contents" aria-label="Footer">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href}>
                        <span className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {currentYear} EcoWise. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-sm text-gray-400 flex items-center">
              Made with <span className="text-green-500 mx-1" aria-hidden="true">💚</span> for the planet
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
