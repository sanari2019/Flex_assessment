import { useState } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
}

const countryCodes = [
  { code: '+44', label: 'UK', flag: '🇬🇧' },
  { code: '+1', label: 'US', flag: '🇺🇸' },
  { code: '+33', label: 'FR', flag: '🇫🇷' },
  { code: '+49', label: 'DE', flag: '🇩🇪' },
  { code: '+34', label: 'ES', flag: '🇪🇸' },
  { code: '+39', label: 'IT', flag: '🇮🇹' },
  { code: '+61', label: 'AU', flag: '🇦🇺' },
  { code: '+86', label: 'CN', flag: '🇨🇳' },
  { code: '+91', label: 'IN', flag: '🇮🇳' },
  { code: '+81', label: 'JP', flag: '🇯🇵' },
];

export function InquiryModal({ isOpen, onClose, propertyName }: InquiryModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+44');
  const [phone, setPhone] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date } | undefined>(undefined);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Inquiry sent successfully! We\'ll get back to you shortly.');
    setIsSubmitting(false);
    onClose();
    
    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setDateRange(undefined);
    setSpecialRequirements('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-background">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold">Send Inquiry</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Fill out the form below and we'll get back to you shortly
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.label}</span>
                        <span className="text-muted-foreground">{country.code}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Stay Dates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Stay Dates</Label>
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM d, yyyy")
                    )
                  ) : (
                    "Select dates"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Special Requirements */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </div>
            <Textarea
              id="specialRequirements"
              placeholder="Any special requests or requirements..."
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
