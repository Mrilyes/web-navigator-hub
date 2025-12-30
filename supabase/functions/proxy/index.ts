const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Proxying URL:', formattedUrl);

    const response = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    const contentType = response.headers.get('content-type') || 'text/html';
    
    // For HTML content, rewrite URLs to go through proxy
    if (contentType.includes('text/html')) {
      let html = await response.text();
      const baseUrl = new URL(formattedUrl);
      
      // Rewrite relative URLs to absolute
      html = html.replace(/(href|src|action)=["'](?!http|https|data:|javascript:|#|\/\/)(\/?)([^"']*?)["']/gi, 
        (match, attr, slash, path) => {
          const absoluteUrl = slash ? `${baseUrl.origin}/${path}` : `${baseUrl.origin}${baseUrl.pathname.replace(/\/[^/]*$/, '/')}${path}`;
          return `${attr}="${absoluteUrl}"`;
        }
      );
      
      // Rewrite protocol-relative URLs
      html = html.replace(/(href|src|action)=["']\/\/([^"']+)["']/gi, 
        (match, attr, path) => `${attr}="https://${path}"`
      );
      
      // Inject base tag for additional URL resolution
      if (!html.includes('<base')) {
        html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${baseUrl.origin}${baseUrl.pathname}" target="_self">`);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          html, 
          contentType,
          url: formattedUrl,
          title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || formattedUrl
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // For other content types, return as base64
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: base64, 
        contentType,
        url: formattedUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Proxy error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch URL';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
