import { useState, KeyboardEvent, FormEvent } from 'react';
import { Search, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddressBarProps {
  value: string;
  isLoading: boolean;
  onNavigate: (url: string) => void;
  className?: string;
}

export const AddressBar = ({ value, isLoading, onNavigate, className }: AddressBarProps) => {
  const [inputValue, setInputValue] = useState(value);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onNavigate(inputValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        onNavigate(inputValue);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex-1 flex gap-2", className)}>
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {value ? <Globe className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </div>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a URL or search..."
          className="pl-10 h-10 bg-card border-border focus-visible:ring-primary"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading || !inputValue.trim()}
        className="h-10 px-6"
      >
        {isLoading ? 'Loading...' : 'Go'}
      </Button>
    </form>
  );
};
