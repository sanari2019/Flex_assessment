import { Facebook, Instagram, Linkedin, Mail, Phone, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const countryCodes = [
  { code: '+44', flag: '🇬🇧', label: 'GB' },
  { code: '+33', flag: '🇫🇷', label: 'FR' },
  { code: '+213', flag: '🇩🇿', label: 'DZ' },
  { code: '+1', flag: '🇺🇸', label: 'US' },
];

export function PublicFooter() {
  return (
    <footer className="bg-[#1e3a3a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Join The Flex */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-3">Join The Flex</h3>
            <p className="text-sm text-gray-300 mb-4">
              Sign up now and stay up to date on our latest news and exclusive deals including 5% off your first stay!
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input 
                  placeholder="First name" 
                  className="bg-[#2d4a4a] border-[#3d5a5a] text-white placeholder:text-gray-400 h-10"
                />
                <Input 
                  placeholder="Last name" 
                  className="bg-[#2d4a4a] border-[#3d5a5a] text-white placeholder:text-gray-400 h-10"
                />
              </div>
              <Input 
                type="email"
                placeholder="Email address" 
                className="bg-[#2d4a4a] border-[#3d5a5a] text-white placeholder:text-gray-400 h-10"
              />
              <div className="flex gap-2">
                <Select defaultValue="+44">
                  <SelectTrigger className="w-24 bg-[#2d4a4a] border-[#3d5a5a] text-white h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  type="tel"
                  placeholder="Phone number" 
                  className="flex-1 bg-[#2d4a4a] border-[#3d5a5a] text-white placeholder:text-gray-400 h-10"
                />
              </div>
              <Button className="w-full bg-white text-[#1e3a3a] hover:bg-gray-100 h-10">
                <Send className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>

          {/* The Flex */}
          <div>
            <h3 className="text-lg font-semibold mb-3">The Flex</h3>
            <p className="text-sm text-gray-300 mb-4">
              Professional property management services for landlords, flexible corporate lets for businesses and quality accommodations for short-term and long-term guests.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://theflex.global/blog" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://theflex.global/careers" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="https://theflex.global/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="https://theflex.global/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Locations</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://theflex.global/landlord-london" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  LONDON
                </a>
              </li>
              <li>
                <a href="https://theflex.global/landlord-paris" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  PARIS
                </a>
              </li>
              <li>
                <a href="https://theflex.global/landlord-algiers" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  ALGIERS
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">Support Numbers</span>
                </div>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>
                    <span className="text-xs mr-1">🇬🇧</span>
                    United Kingdom<br />
                    <a href="tel:+447723745646" className="hover:text-white">+44 77 2374 5646</a>
                  </p>
                  <p>
                    <span className="text-xs mr-1">🇩🇿</span>
                    Algeria<br />
                    <a href="tel:+33757592241" className="hover:text-white">+33 7 57 59 22 41</a>
                  </p>
                  <p>
                    <span className="text-xs mr-1">🇫🇷</span>
                    France<br />
                    <a href="tel:+33644645717" className="hover:text-white">+33 6 44 64 57 17</a>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@theflex.global" className="text-gray-300 hover:text-white transition-colors">
                  info@theflex.global
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#3d5a5a] py-8">
        <p className="text-center text-sm text-gray-400">
          © 2025 The Flex. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
