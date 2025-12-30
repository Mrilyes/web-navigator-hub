import { useProxy } from '@/hooks/useProxy';
import { BrowserHeader } from './BrowserHeader';
import { ProxyFrame } from './ProxyFrame';

export const ProxyBrowser = () => {
  const {
    isLoading,
    error,
    content,
    currentUrl,
    canGoBack,
    canGoForward,
    navigate,
    goBack,
    goForward,
    refresh,
  } = useProxy();

  const handleHome = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <BrowserHeader
        currentUrl={currentUrl}
        isLoading={isLoading}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onNavigate={navigate}
        onBack={goBack}
        onForward={goForward}
        onRefresh={refresh}
        onHome={handleHome}
      />
      
      <ProxyFrame
        content={content}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};
