import { NavigationControls } from './NavigationControls';
import { AddressBar } from './AddressBar';
import { Shield } from 'lucide-react';

interface BrowserHeaderProps {
  currentUrl: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  onHome: () => void;
}

export const BrowserHeader = ({
  currentUrl,
  isLoading,
  canGoBack,
  canGoForward,
  onNavigate,
  onBack,
  onForward,
  onRefresh,
  onHome,
}: BrowserHeaderProps) => {
  return (
    <header className="bg-card border-b border-border p-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-primary">
          <Shield className="h-5 w-5" />
          <span className="font-semibold hidden sm:inline">Proxy</span>
        </div>
        
        <NavigationControls
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          isLoading={isLoading}
          onBack={onBack}
          onForward={onForward}
          onRefresh={onRefresh}
          onHome={onHome}
        />

        <AddressBar
          value={currentUrl}
          isLoading={isLoading}
          onNavigate={onNavigate}
        />
      </div>
    </header>
  );
};
