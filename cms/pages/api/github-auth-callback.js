// GitHub OAuth callback function as an Astro API endpoint
// Avoid static rendering
export const prerender = false

// APIRoute type is optional but helpful for TypeScript support
export const GET = async ({ request, redirect, url }) => {
  console.log('Request URL:', request.url);
  
  // Extract the code from the URL search params
  const code = url.searchParams.get('code');
  console.log('Authorization code:', code);
  
  if (!code) {
    console.error('No code found in URL:', url.toString());
    return new Response('Error: No code provided', { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: import.meta.env.PUBLIC_POKO_GITHUB_CLIENT_ID,
        client_secret: import.meta.env.POKO_GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(`GitHub error: ${tokenData.error_description || tokenData.error}`);
    }

    // Redirect back to admin page with token in fragment (not querystring for security)
    // The hash fragment is not sent to the server and will be accessed client-side
    return redirect(`/admin#access_token=${tokenData.access_token}`, 302);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return new Response(`Authentication error: ${error.message}`, { status: 500 });
  }
}
