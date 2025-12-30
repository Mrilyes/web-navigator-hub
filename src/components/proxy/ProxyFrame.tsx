import { Loader2, AlertCircle, Globe } from "lucide-react";

interface ProxyFrameProps {
  proxiedUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ProxyFrame = ({ proxiedUrl, isLoading, error }: ProxyFrameProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold text-foreground">Unable to load page</h2>
          <p className="text-muted-foreground max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  if (!proxiedUrl) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card">
        <div className="flex flex-col items-center gap-6 text-center px-4">
          <div className="p-6 rounded-full bg-primary/10">
            <Globe className="h-16 w-16 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Web Proxy</h1>
            <p className="text-muted-foreground max-w-md">
              Enter a URL above to start browsing through the proxy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      className="flex-1 w-full bg-background border-0"
      title="Proxied Content"
      src={proxiedUrl}
    // NOTE: sandbox can break many sites (like YouTube). For MVP, remove sandbox.
    // If you keep it, you'll break lots of features.
    />
  );
};
