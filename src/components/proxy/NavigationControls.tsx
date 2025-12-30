import { ArrowLeft, ArrowRight, RotateCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavigationControlsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  onHome: () => void;
}

export const NavigationControls = ({
  canGoBack,
  canGoForward,
  isLoading,
  onBack,
  onForward,
  onRefresh,
  onHome,
}: NavigationControlsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            disabled={!canGoBack || isLoading}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Go back</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onForward}
            disabled={!canGoForward || isLoading}
            className="h-9 w-9"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Go forward</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-9 w-9"
          >
            <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Refresh</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onHome}
            disabled={isLoading}
            className="h-9 w-9"
          >
            <Home className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Home</TooltipContent>
      </Tooltip>
    </div>
  );
};
