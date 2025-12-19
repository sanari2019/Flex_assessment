import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Mail,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import theFlexLogo from '@/assets/theflex-logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const landlordLocations = [
  { flag: '🇬🇧', label: 'LONDON', href: 'https://theflex.global/landlord-london' },
  { flag: '🇫🇷', label: 'PARIS', href: 'https://theflex.global/landlord-paris' },
  { flag: '🇩🇿', label: 'ALGIERS', href: 'https://theflex.global/landlord-algiers' },
];

const languages = [
  { code: 'GB', label: 'English' },
  { code: 'FR', label: 'Français' },
  { code: 'ES', label: 'Español' },
  { code: 'DZ', label: 'العربية' },
  { code: 'CN', label: '中文' },
];

const currencies = [
  { symbol: '$', code: 'USD' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: 'د.ج', code: 'DZD' },
];

const navItems = [
  { icon: Users, label: 'About Us', href: 'https://theflex.global/about-us', external: true },
  { icon: Briefcase, label: 'Careers', href: 'https://theflex.global/careers', external: true },
  { icon: Mail, label: 'Contact', href: 'https://theflex.global/contact', external: true },
];

interface PublicHeaderProps {
  splashVisible?: boolean;
}

export function PublicHeader({ splashVisible = false }: PublicHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[2]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <TooltipProvider>
      <header 
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-300',
          splashVisible ? 'top-[52px]' : 'top-0',
          isScrolled 
            ? 'bg-primary shadow-lg' 
            : 'bg-card border-b border-border'
        )}
      >
        <div className="flex-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src={theFlexLogo} 
                alt="the flex" 
                className={cn(
                  'h-8 transition-all',
                  isScrolled && 'brightness-0 invert'
                )}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {/* Landlords Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(
                  'flex items-center gap-1 text-sm font-medium transition-colors outline-none',
                  isScrolled 
                    ? 'text-primary-foreground/80 hover:text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                )}>
                  <Building2 className="h-4 w-4" />
                  <span>Landlords</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px] bg-background border border-border shadow-lg z-[200]">
                  {landlordLocations.map((location) => (
                    <DropdownMenuItem key={location.label} asChild>
                      <a 
                        href={location.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center cursor-pointer focus:bg-primary focus:text-primary-foreground"
                      >
                        <span className="mr-2">{location.flag}</span>
                        {location.label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Other Nav Items */}
              {navItems.map(({ icon: Icon, label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors',
                    isScrolled 
                      ? 'text-primary-foreground/80 hover:text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </a>
              ))}
              
              {/* Language & Currency */}
              <div className={cn(
                'flex items-center gap-3 ml-4 pl-4 border-l',
                isScrolled ? 'border-primary-foreground/20' : 'border-border'
              )}>
                {/* Language Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(
                    'flex items-center gap-1 text-sm font-medium transition-colors outline-none',
                    isScrolled 
                      ? 'text-primary-foreground/80 hover:text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}>
                    <span>{selectedLanguage.code}</span>
                    <span>{selectedLanguage.label}</span>
                    <ChevronDown className="h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px] bg-background border border-border shadow-lg z-[200]">
                    {languages.map((lang) => (
                      <DropdownMenuItem 
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang)}
                        className={cn(
                          "cursor-pointer",
                          selectedLanguage.code === lang.code && "bg-primary text-primary-foreground"
                        )}
                      >
                        <span className="font-medium mr-2">{lang.code}</span>
                        {lang.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Currency Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(
                    'flex items-center gap-1 text-sm font-medium transition-colors outline-none',
                    isScrolled 
                      ? 'text-primary-foreground/80 hover:text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}>
                    <span>{selectedCurrency.symbol}</span>
                    <span>{selectedCurrency.code}</span>
                    <ChevronDown className="h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[120px] bg-background border border-border shadow-lg z-[200]">
                    {currencies.map((currency) => (
                      <DropdownMenuItem 
                        key={currency.code}
                        onClick={() => setSelectedCurrency(currency)}
                        className={cn(
                          "cursor-pointer",
                          selectedCurrency.code === currency.code && "bg-primary text-primary-foreground"
                        )}
                      >
                        <span className="mr-2">{currency.symbol}</span>
                        {currency.code}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'md:hidden p-2 transition-colors',
                isScrolled ? 'text-primary-foreground' : 'text-foreground'
              )}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className={cn(
              'md:hidden py-4 border-t',
              isScrolled ? 'border-primary-foreground/20' : 'border-border'
            )}>
              <div className="space-y-2">
                {/* Landlords Section */}
                <div className={cn(
                  'px-2 py-2',
                  isScrolled ? 'text-primary-foreground' : 'text-foreground'
                )}>
                  <p className="font-medium mb-2">Landlords</p>
                  <div className="pl-4 space-y-1">
                    {landlordLocations.map((location) => (
                      <a
                        key={location.label}
                        href={location.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2"
                      >
                        <span>{location.flag}</span>
                        <span>{location.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {navItems.map(({ icon: Icon, label, href, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-2 py-3 rounded-lg transition-colors',
                      isScrolled 
                        ? 'text-primary-foreground hover:bg-primary-foreground/10' 
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </a>
                ))}
                
                {/* Language & Currency in mobile */}
                <div className={cn(
                  'flex items-center gap-6 px-2 py-3 mt-2 border-t',
                  isScrolled ? 'border-primary-foreground/20' : 'border-border'
                )}>
                  <span className={isScrolled ? 'text-primary-foreground' : 'text-foreground'}>
                    {selectedLanguage.code} {selectedLanguage.label}
                  </span>
                  <span className={isScrolled ? 'text-primary-foreground' : 'text-foreground'}>
                    {selectedCurrency.symbol} {selectedCurrency.code}
                  </span>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Fixed WhatsApp Button - Bottom Right */}
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://wa.me/447000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all"
          >
            <MessageCircle className="h-7 w-7" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Chat with us</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
