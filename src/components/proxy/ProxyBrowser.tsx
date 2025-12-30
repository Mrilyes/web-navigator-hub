import { useProxy } from "@/hooks/useProxy";
import { BrowserHeader } from "./BrowserHeader";
import { ProxyFrame } from "./ProxyFrame";

export const ProxyBrowser = () => {
  const { input, setInput, currentUrl, proxiedUrl, go } = useProxy();

  const isLoading = false; // MVP: iframe controls loading; we can improve later
  const error: string | null = null;

  // MVP nav controls (disabled for now)
  const canGoBack = false;
  const canGoForward = false;

  const handleHome = () => {
    // Home clears current URL
    setInput("");
    // If you want home to fully reset:
    // window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <BrowserHeader
        currentUrl={input}
        isLoading={isLoading}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onNavigate={(url) => {
          setInput(url);
          go(); // go() will normalize + set currentUrl based on input
        }}
        onBack={() => { }}
        onForward={() => { }}
        onRefresh={() => {
          // refresh by re-setting currentUrl to itself
          if (currentUrl) {
            // simplest: reload whole page in iframe by changing key later (we’ll improve)
            window.location.reload();
          }
        }}
        onHome={handleHome}
      />

      <ProxyFrame proxiedUrl={proxiedUrl || null} isLoading={isLoading} error={error} />
    </div>
  );
};
