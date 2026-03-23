import { Car, Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const links = {
    services: [
      { name: "Pay-Per-Use", href: "#" },
      { name: "Monthly Plans", href: "#" },
      { name: "Event Valet", href: "#" },
      { name: "Corporate", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Employee Sign In", href: "/login" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Contact", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "App Download", href: "#" },
    ],
  };

  return (
    <footer className="bg-primary text-primary-foreground pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                UNi<span className="text-secondary">Vale</span>
              </span>
            </a>
            <p className="text-primary-foreground/60 mb-6 max-w-sm">
              Premium campus valet services designed for the modern university experience. Fast, reliable, and always on time.
            </p>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4" />
                (555) 123-4567
              </a>
              <a href="#" className="flex items-center gap-3 text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4" />
                hello@univale.com
              </a>
              <a href="#" className="flex items-center gap-3 text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <MapPin className="w-4 h-4" />
                123 Campus Drive, University City
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {links.services.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/40">
            © 2025 UNiVale. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-primary-foreground/40 hover:text-primary-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-primary-foreground/40 hover:text-primary-foreground transition-colors">
              Terms of Service
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
