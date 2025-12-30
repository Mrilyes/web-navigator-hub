import { supabase } from '@/integrations/supabase/client';

export interface ProxyResponse {
  success: boolean;
  error?: string;
  html?: string;
  data?: string;
  contentType?: string;
  url?: string;
  title?: string;
}

export const proxyApi = {
  async fetch(url: string): Promise<ProxyResponse> {
    const { data, error } = await supabase.functions.invoke('proxy', {
      body: { url },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    
    return data;
  },
};

export const isValidUrl = (input: string): boolean => {
  const urlPattern = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/i;
  return urlPattern.test(input.trim());
};

export const formatUrl = (input: string): string => {
  let url = input.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
};

export const getSearchUrl = (query: string): string => {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
};
