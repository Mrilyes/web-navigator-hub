import { useEffect, useRef } from 'react';
import { ProxyResponse } from '@/lib/api/proxy';
import { Loader2, AlertCircle, Globe } from 'lucide-react';

interface ProxyFrameProps {
  content: ProxyResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const ProxyFrame = ({ content, isLoading, error }: ProxyFrameProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (content?.html && iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(content.html);
        doc.close();
      }
    }
  }, [content]);

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

  if (!content) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card">
        <div className="flex flex-col items-center gap-6 text-center px-4">
          <div className="p-6 rounded-full bg-primary/10">
            <Globe className="h-16 w-16 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Web Proxy</h1>
            <p className="text-muted-foreground max-w-md">
              Enter a URL or search term above to start browsing securely through our proxy server.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      className="flex-1 w-full bg-background border-0"
      title="Proxied Content"
      sandbox="allow-same-origin allow-scripts allow-forms"
    />
  );
};
